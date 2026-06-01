"use server";

import { signOut } from "@/auth";

// Server action to end the session and return to the public directory.
export async function logout() {
  await signOut({ redirectTo: "/" });
}
