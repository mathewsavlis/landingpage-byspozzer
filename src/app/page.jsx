import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import TestimonialSection from '@/components/sections/TestimonialSection';
import ServiceSection from '@/components/sections/ServiceSection';
import ProcessSection from '@/components/sections/ProcessSection';
import ContactSection from '@/components/sections/ContactSection';

export default function Home() {
  return (
    // Agora ele puxa o Off-white (primary) e a cor da seleção do mouse fica Dourada (tertiary)
    <main className="bg-primary min-h-screen text-secondary selection:bg-tertiary selection:text-primary">
      <HeroSection />
      <AboutSection />
      <TestimonialSection />
      <ServiceSection />
      <ProcessSection />
      <ContactSection />
    </main>
  );
}