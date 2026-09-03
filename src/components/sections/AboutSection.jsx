'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { aboutData } from '@/data/aboutData';

export default function AboutSection() {
  const containerRef = useRef(null);
  const imageContainerRef = useRef(null);
  const photo1Ref = useRef(null);
  const photo2Ref = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    let ctx = gsap.context(() => {
      if (!containerRef.current) return;

      if (photo2Ref.current) gsap.set(photo2Ref.current, { autoAlpha: 0 });

      const textElements = gsap.utils.toArray('.about-anim-item');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          // Sincronia Perfeita: Começa a animação quando o topo do About 
          // encosta em 95% da tela (logo após o Hero terminar de clarear)
          start: "top 95%", 
          end: "bottom 30%", 
          scrub: 1, 
        }
      });

      // ORDEM EXATA CONFORME SOLICITADO:

      // A foto 1 aparece primeiro
      if (imageContainerRef.current) {
        tl.fromTo(imageContainerRef.current, 
          { autoAlpha: 0, y: 100 }, 
          { autoAlpha: 1, y: 0, duration: 1.5, ease: "power2.out", force3D: true }, 0 
        );
      }

      // Os textos aparecem
      if (textElements.length > 0) {
        tl.fromTo(textElements, 
          { autoAlpha: 0, y: 50 }, 
          { autoAlpha: 1, y: 0, duration: 1.5, stagger: 0.3, ease: "power2.out", force3D: true }, 0.5
        );
      }

      // CORREÇÃO: Switch das fotos puxado para o segundo 1.8 (Logo após o texto aparecer)
      if (photo1Ref.current && photo2Ref.current) {
        tl.to(photo1Ref.current, { autoAlpha: 0, duration: 0.8, ease: "power2.inOut" }, 1.8);
        tl.to(photo2Ref.current, { autoAlpha: 1, duration: 0.8, ease: "power2.inOut" }, 1.8);
      }
      
      // 4. O scroll para o próximo layer ocorrerá naturalmente ao final dessa timeline
      // pois o usuário continuará rolando a página para baixo.

    }, containerRef);

    return () => ctx.revert(); 
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-[100svh] py-24 flex items-center justify-center overflow-hidden bg-[#F6F4F0]"
    >
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-24 flex flex-col md:flex-row items-center justify-between gap-16 lg:gap-24 h-full">
        
        {/* CONTAINER DA IMAGEM */}
        <div 
          ref={imageContainerRef} 
          className="relative w-full md:w-5/12 h-[55vh] md:h-[75vh] rounded-sm overflow-hidden bg-[#2A2A2A]/5 border border-black/5 shadow-2xl invisible will-change-transform transform-gpu"
        >
          <div className="absolute inset-0 bg-black/5 z-10 pointer-events-none mix-blend-overlay"></div>
          
          <div ref={photo1Ref} className="absolute inset-0 flex items-center justify-center invisible">
            <img src={aboutData.images.photo1.src} alt={aboutData.images.photo1.alt} className="w-full h-full object-cover will-change-transform scale-110" />
          </div>
          
          <div ref={photo2Ref} className="absolute inset-0 flex items-center justify-center invisible">
            <img src={aboutData.images.photo2.src} alt={aboutData.images.photo2.alt} className="w-full h-full object-cover will-change-transform scale-110" />
          </div>
        </div>
        
        {/* CONTAINER DE TEXTOS */}
        <div className="w-full md:w-6/12 flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="about-anim-item text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#B59A6D] mb-6 font-medium invisible">
              {aboutData.subtitle}
            </h2>
            <h3 className="about-anim-item text-4xl md:text-5xl lg:text-6xl font-extralight text-[#2A2A2A] leading-[1.1] tracking-tight invisible">
              {aboutData.title}
            </h3>
          </div>
          <div className="space-y-6">
            <p className="about-anim-item text-base md:text-lg lg:text-xl font-light leading-relaxed text-[#2A2A2A]/80 invisible">
              {aboutData.paragraph}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}