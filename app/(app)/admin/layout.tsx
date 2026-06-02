import { notFound } from "next/navigation";

import { auth } from "@/auth";

// Admin-only sub-surface. The parent (app) layout already enforces
// authentication; here we additionally require the Keycloak `admin` realm role.
// Non-admins get a 404 (the console's existence isn't advertised). The backend
// independently enforces the same role on every /admin endpoint.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.isAdmin) {
    notFound();
  }
  return children;
}
