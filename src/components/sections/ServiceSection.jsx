'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { servicesIntro } from '@/data/servicesIntroData';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ServiceSection() {
  const containerRef = useRef(null);

  const subtitleWords = servicesIntro.subtitle.split(" ");
  const titleWords = servicesIntro.title.split(" ");
  const paragraphWords = servicesIntro.paragraph.split(" ");

  useEffect(() => {
    let ctx = gsap.context(() => {
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          end: "bottom 50%", 
          scrub: 1.5, 
        }
      });

      tl.fromTo('.reveal-svc-title', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 1.5, stagger: 0.1, ease: "power1.out" }
      );

      tl.fromTo('.reveal-svc-word', 
        { opacity: 0 }, 
        { opacity: 1, duration: 2, stagger: 0.05, ease: "none" },
        0.5 
      );

    }, containerRef);

    return () => ctx.revert(); 
  }, []);

  return (
    // A MÁGICA AQUI: min-h-[100svh]
    <section ref={containerRef} className="relative w-full min-h-[100svh] py-32 bg-[#0A0A0A] flex items-center justify-center overflow-hidden -mt-[1px]">
      
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <video 
          src="/landingpage-byspozzer/background-services.mp4" 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover scale-105 filter grayscale contrast-125 opacity-80"
        />
        <div className="absolute inset-0 bg-[#0A0A0A]/70 backdrop-blur-[2px]"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 md:px-12 flex flex-col items-center justify-center text-center">
        
        <div className="mb-10 md:mb-16">
          <h2 className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#B59A6D] mb-6 font-medium">
            {subtitleWords.map((word, index) => (
              <span key={index} className="reveal-svc-title inline-block opacity-0 mr-[0.4em]">
                {word}
              </span>
            ))}
          </h2>
          <h3 className="text-3xl md:text-5xl lg:text-7xl font-extralight text-[#F6F4F0] leading-[1.1] max-w-4xl tracking-tight">
            {titleWords.map((word, index) => (
              <span key={index} className="reveal-svc-title inline-block opacity-0 mr-[0.25em]">
                {word}
              </span>
            ))}
          </h3>
        </div>
        
        <div className="max-w-3xl">
          <p className="text-base md:text-xl lg:text-2xl font-light leading-loose text-[#F6F4F0]/80">
            {paragraphWords.map((word, index) => (
              <span key={index} className="reveal-svc-word inline-block opacity-0 mr-[0.25em]">
                {word}
              </span>
            ))}
          </p>
        </div>
        
      </div>

    </section>
  );
}