import type { Metadata } from "next";

import { OnboardingWizard } from "@/components/onboarding/wizard";

export const metadata: Metadata = { title: "Onboarding" };

// First-time setup. Lives in the protected (app) group; the dashboard routes
// here when onboarding is incomplete.
export default function OnboardingPage() {
  return <OnboardingWizard />;
}
