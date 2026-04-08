import { LandingNavbar }   from "@/components/layout/LandingNavbar";
import { HeroSection }     from "@/components/landing/HeroSection";
import { ProgressSection } from "@/components/landing/ProgressSection";
import { CommunitySection } from "@/components/landing/CommunitySection";
import { LandingFooter }   from "@/components/layout/LandingFooter";

export default function RootPage() {
  return (
    <main className="min-h-screen bg-[#030612] selection:bg-indigo-500/30">
      <LandingNavbar />
      <HeroSection />
      <ProgressSection />
      <CommunitySection />
      <LandingFooter />
    </main>
  );
}
