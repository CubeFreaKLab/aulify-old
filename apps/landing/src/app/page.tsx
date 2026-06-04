import { HeroSection } from "../components/landing/HeroSection";
import { PublicNavbar } from "../components/landing/PublicNavbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-offWhite text-neutral-black">
      <PublicNavbar />
      <HeroSection />
    </main>
  );
}
