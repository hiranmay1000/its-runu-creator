import { AboutSection } from "../components/sections/AboutSection";
import { ConnectSection } from "../components/sections/ConnectSection";
import { ContactSection } from "../components/sections/ContactSection";
import { FashionSection } from "../components/sections/FashionSection";
import { HeroSection } from "../components/sections/HeroSection";
import { InstagramSection } from "../components/sections/InstagramSection";
import { JournalSection } from "../components/sections/JournalSection";

export function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <FashionSection />
      <JournalSection />
      <InstagramSection />
      <ConnectSection />
      <ContactSection />
    </main>
  );
}
