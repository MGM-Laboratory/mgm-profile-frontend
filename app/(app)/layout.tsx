import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AppHeader } from "@/components/app/app-header";
import { QueryProvider } from "@/components/providers/query-provider";

// Protected shell for the private dashboard + onboarding. Auth is enforced
// server-side (no middleware/proxy): unauthenticated users are redirected to
// the login page with a callback back here.
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.accessToken) {
    redirect("/login?callbackUrl=/dashboard");
  }

  return (
    <QueryProvider>
      <AppHeader name={session.user?.name ?? null} email={session.user?.email ?? null} />
      <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">{children}</div>
    </QueryProvider>
  );
}
