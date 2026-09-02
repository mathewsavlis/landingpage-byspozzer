'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export default function SectionTransition({ children, currentBg, nextBg }) {
  const wrapperRef = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
    
    let ctx = gsap.context(() => {
      if (!wrapperRef.current || !layerRef.current || !nextBg) return;

      const maskSettings = { fadeStart: 100 };

      // 1. Animação da Máscara (Degradê)
      gsap.to(maskSettings, {
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "bottom bottom", // Começa quando a seção bate no fundo da tela
          end: "+=80%", 
          scrub: true,
          onUpdate: (self) => {
            if (!layerRef.current) return;
            
            // O SEGREDO DA PERFORMANCE E DO PIN ESTÁ AQUI:
            // Se o progresso for 0, removemos a máscara totalmente.
            // Assim, o elemento "pai" deixa de ser um Containing Block 
            // e permite que o filho (HeroSection) faça o "pin: true" normalmente.
            if (self.progress === 0) {
              layerRef.current.style.maskImage = 'none';
              layerRef.current.style.WebkitMaskImage = 'none';
            } else {
              // Aplica o degradê apenas durante a transição
              const gradient = `linear-gradient(to bottom, black ${maskSettings.fadeStart}%, transparent 100%)`;
              layerRef.current.style.maskImage = gradient;
              layerRef.current.style.WebkitMaskImage = gradient;
            }
          }
        },
        fadeStart: 70, 
        ease: "none",
      });

      // 2. Animação da Troca de Cor de Fundo
      gsap.to(wrapperRef.current, {
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "bottom bottom",
          end: "+=80%",
          scrub: true,
        },
        backgroundColor: nextBg,
        ease: "none"
      });

    }, wrapperRef);

    return () => ctx.revert();
  }, [nextBg]);

  return (
    // IMPORTANTE: Removi o "will-change-transform" e a máscara inline que quebravam o Pin
    <div 
      ref={wrapperRef} 
      className="relative w-full transition-colors duration-300" 
      style={{ backgroundColor: currentBg }}
    >
      <div 
        ref={layerRef} 
        className="w-full"
      >
        {children}
      </div>
    </div>
  );
}