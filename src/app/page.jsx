import SectionTransition from '@/components/ui/SectionTransition';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import TestimonialSection from '@/components/sections/TestimonialSection';
import ServiceSection from '@/components/sections/ServiceSection';
import ProcessSection from '@/components/sections/ProcessSection';
import ContactSection from '@/components/sections/ContactSection';

export default function Home() {
  return (
    <main className="min-h-screen text-secondary selection:bg-tertiary selection:text-primary bg-[#F6F4F0]">
      
      {/* O Hero agora faz sua própria transição interna */}
      <HeroSection />

      {/* Você pode manter o SectionTransition nas outras seções se quiser, ou usar o fluxo natural */}
      <AboutSection />
      
      <TestimonialSection />
      <ServiceSection />
      <ProcessSection />
      <ContactSection />
      
    </main>
  );
}