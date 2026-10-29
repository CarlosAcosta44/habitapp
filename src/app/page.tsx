import { cookies } from "next/headers";
import { LandingNavbar } from "@/components/layout/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProgressSection } from "@/components/landing/ProgressSection";
import { CommunitySection } from "@/components/landing/CommunitySection";
import { LandingFooter } from "@/components/layout/LandingFooter";

export default async function RootPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const isAuthenticated = !!token;

  return (
    <main className="min-h-screen bg-[#030612] selection:bg-indigo-500/30">
      <LandingNavbar isAuthenticated={isAuthenticated} />
      <HeroSection isAuthenticated={isAuthenticated} />
      <ProgressSection />
      <CommunitySection />
      <LandingFooter />
    </main>
  );
}
