import { Directory } from "@/components/public/directory";
import { SiteHeader } from "@/components/site-header";

// Public directory (plan §5): browse lab members, grouped by division, with
// search and filters. No login required.
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        <Directory />
      </main>
    </>
  );
}
