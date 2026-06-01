// Auth.js v5 configuration. Authenticates MGM Profile users against the lab's
// Keycloak realm (`mgm`) via the public web client (Auth Code + PKCE). The
// Keycloak access token is carried in the session so the backend API can be
// called as the user (Bearer JWT validated server-side via JWKS).
import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";

const issuer = process.env.AUTH_KEYCLOAK_ISSUER;
const clientId = process.env.AUTH_KEYCLOAK_ID;
// Public PKCE clients have no secret; confidential clients do. Support both.
const clientSecret = process.env.AUTH_KEYCLOAK_SECRET ?? "";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Keycloak({
      issuer,
      clientId,
      clientSecret,
      // A public client authenticates with no secret at the token endpoint.
      ...(clientSecret ? {} : { client: { token_endpoint_auth_method: "none" } }),
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    // Persist Keycloak tokens on the JWT; refresh the access token when it
    // expires using the refresh token.
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        return token;
      }
      if (typeof token.expiresAt === "number" && Date.now() < token.expiresAt * 1000 - 30_000) {
        return token;
      }
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.error = token.error;
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
});

// refreshAccessToken exchanges the stored refresh token for a new access token.
async function refreshAccessToken(token: import("next-auth/jwt").JWT) {
  try {
    if (!issuer || !clientId || !token.refreshToken) {
      return { ...token, error: "RefreshFailed" as const };
    }
    const res = await fetch(`${issuer}/protocol/openid-connect/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: clientId,
        ...(clientSecret ? { client_secret: clientSecret } : {}),
        refresh_token: token.refreshToken,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error("refresh failed");
    return {
      ...token,
      accessToken: data.access_token,
      expiresAt: Math.floor(Date.now() / 1000) + Number(data.expires_in ?? 0),
      refreshToken: data.refresh_token ?? token.refreshToken,
      error: undefined,
    };
  } catch {
    return { ...token, error: "RefreshFailed" as const };
  }
}
