'use client';
import { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { aboutData } from '@/data/aboutData';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutSection() {
  const containerRef = useRef(null);
  const photo1Ref = useRef(null);
  const photo2Ref = useRef(null);

  const subtitleWords = useMemo(() => aboutData.subtitle.split(" "), []);
  const titleWords = useMemo(() => aboutData.title.split(" "), []);
  const paragraphWords = useMemo(() => aboutData.paragraph.split(" "), []);

  useEffect(() => {
    let ctx = gsap.context(() => {
      
      gsap.set(photo2Ref.current, { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%", 
          end: "bottom 40%", 
          scrub: 1, 
        }
      });

      tl.fromTo(photo1Ref.current, 
        { autoAlpha: 0, y: 30 }, 
        { autoAlpha: 1, y: 0, duration: 1, ease: "power2.out" },
        0 
      );

      tl.fromTo('.reveal-title', 
        { opacity: 0, y: 10 }, 
        { opacity: 1, y: 0, duration: 1.5, stagger: 0.1, ease: "none" },
        0
      );

      tl.fromTo('.reveal-word', 
        { opacity: 0 }, 
        { opacity: 1, duration: 2, stagger: 0.05, ease: "none" },
        0.5 
      );

      tl.to(photo1Ref.current, { autoAlpha: 0, duration: 1.5, ease: "power2.inOut" }, 1.5);
      tl.to(photo2Ref.current, { autoAlpha: 1, duration: 1.5, ease: "power2.inOut" }, 1.5);

    }, containerRef);

    return () => ctx.revert(); 
  }, []);

  return (
    // A MÁGICA AQUI: min-h-[100svh]
    <section ref={containerRef} className="relative w-full min-h-[100svh] py-24 bg-primary flex items-center justify-center overflow-hidden">
      
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-24 flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24 h-full">
        
        <div className="relative w-full md:w-1/2 h-[50vh] md:h-[70vh] flex items-center justify-center">
          <div ref={photo1Ref} className="absolute inset-0 flex items-center justify-center invisible">
            <img src={aboutData.images.photo1.src} alt={aboutData.images.photo1.alt} className="w-full h-full object-contain drop-shadow-2xl" />
          </div>
          <div ref={photo2Ref} className="absolute inset-0 flex items-center justify-center invisible">
            <img src={aboutData.images.photo2.src} alt={aboutData.images.photo2.alt} className="w-full h-full object-contain drop-shadow-2xl" />
          </div>
        </div>
        
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-tertiary mb-6 font-medium">
              {subtitleWords.map((word, index) => (
                <span key={`sub-${index}`} className="reveal-title inline-block opacity-0 mr-[0.4em]">
                  {word}
                </span>
              ))}
            </h2>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-extralight text-secondary leading-[1.1] tracking-tight">
              {titleWords.map((word, index) => (
                <span key={`title-${index}`} className="reveal-title inline-block opacity-0 mr-[0.25em]">
                  {word}
                </span>
              ))}
            </h3>
          </div>
          
          <div className="space-y-6">
            <p className="text-base md:text-lg lg:text-xl font-light leading-loose text-secondary/80">
              {paragraphWords.map((word, index) => (
                <span key={`para-${index}`} className="reveal-word inline-block opacity-0 mr-[0.25em]">
                  {word}
                </span>
              ))}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}