'use client';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { testimonials } from '@/data/testimonialsData';

export default function TestimonialsSection() {
  const containerRef = useRef(null);
  const ctxRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    ctxRef.current = gsap.context(() => {}, containerRef);
    return () => ctxRef.current.revert();
  }, []);

  useEffect(() => {
    if (!ctxRef.current) return;

    ctxRef.current.add(() => {
      testimonials.forEach((_, i) => {
        const slide = `.test-card-${i}`;
        const overlay = `.overlay-dark-${i}`; 
        const diff = i - activeIdx;

        const targetX = diff * 85; 
        const targetRotY = diff * -22; 
        const targetScale = diff === 0 ? 1 : 0.78; 
        
        // A MÁGICA ACONTECE AQUI: Usamos a profundidade Z real no lugar de zIndex
        // O card ativo fica em Z: 0. Os inativos vão para Z: -100 (fisicamente para trás)
        const targetZ = diff === 0 ? 0 : -100; 
        
        const targetAlpha = Math.abs(diff) <= 1 ? 1 : 0; 
        const targetDarkness = diff === 0 ? 0 : 0.85; 

        gsap.to(slide, {
          xPercent: targetX,
          rotationY: targetRotY, 
          scale: targetScale,
          z: targetZ, // Movemos no espaço 3D real
          autoAlpha: targetAlpha, 
          // zIndex foi completamente removido!
          duration: 1.2,
          ease: 'power3.inOut',
          overwrite: 'auto'
        });

        gsap.to(overlay, {
          autoAlpha: targetDarkness,
          duration: 1.2,
          ease: 'power3.inOut',
          overwrite: 'auto'
        });
      });
    });
  }, [activeIdx]);

  const nextSlide = () => {
    if (activeIdx < testimonials.length - 1) setActiveIdx(prev => prev + 1);
  };

  const prevSlide = () => {
    if (activeIdx > 0) setActiveIdx(prev => prev - 1);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;  
    const isRightSwipe = distance < -50; 

    if (isLeftSwipe && activeIdx < testimonials.length - 1) {
      nextSlide();
    }
    if (isRightSwipe && activeIdx > 0) {
      prevSlide();
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <section 
      ref={containerRef} 
      aria-label="Depoimentos de Clientes"
      className="relative w-full h-[100dvh] bg-gradient-to-b from-[#2A2A2A] to-[#0A0A0A] overflow-hidden flex items-center justify-center"
    >
      
      {/* A MÁGICA DO CSS 3D:
        Adicionamos transformStyle: 'preserve-3d' ao container principal.
        Isso garante que a placa de vídeo processe todos os cards em um único ambiente 3D.
      */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center touch-pan-y"
        style={{ perspective: '1200px', transformStyle: 'preserve-3d' }} 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        
        {testimonials.map((test, i) => (
          <article 
            key={test.id} 
            onClick={() => i === activeIdx + 1 && nextSlide()}
            className={`test-card-${i} pointer-events-auto absolute left-0 right-0 mx-auto top-1/2 -translate-y-1/2 w-[85vw] max-w-[400px] h-[75vh] max-h-[650px] rounded-[30px] overflow-hidden border border-[#F6F4F0]/10 opacity-0 shadow-2xl ${i === activeIdx ? 'cursor-default' : 'cursor-pointer'}`}
            // Removemos o transformStyle inline daqui para o GSAP gerenciar melhor as matrizes de rotação
          >
            
            <img 
              src={test.img} 
              alt={`Cliente ${test.name}`} 
              loading={i === 0 ? "eager" : "lazy"} 
              className="absolute inset-0 w-full h-full object-cover grayscale opacity-90"
            />

            <div className="absolute inset-x-0 bottom-0 h-3/5 backdrop-blur-xl z-0 [mask-image:linear-gradient(to_top,black_60%,transparent_100%)]"></div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/95 via-[#111111]/60 to-transparent z-0"></div>

            <div className={`overlay-dark-${i} absolute inset-0 bg-[#050505] z-50 pointer-events-none opacity-0`}></div>

            <div className="relative z-10 w-full h-full p-8 flex flex-col justify-between">
              
              <div className="flex justify-start">
                <span className="text-[#F6F4F0]/50 font-serif tracking-widest text-sm font-light">
                  ( 0{test.id} )
                </span>
              </div>

              <div className="flex flex-col items-start mt-auto">
                <h3 className="text-3xl md:text-4xl font-light text-[#F6F4F0] uppercase tracking-tight leading-none mb-1">
                  {test.name}
                </h3>
                <p className="text-[#B59A6D] text-[10px] md:text-xs tracking-[0.2em] uppercase mb-6 font-medium">
                  {test.role}
                </p>

                <h4 className="text-lg md:text-xl font-medium text-[#F6F4F0] leading-snug mb-4 uppercase">
                  {test.quote}
                </h4>
                <p className="text-xs md:text-sm font-light text-[#F6F4F0]/70 leading-relaxed">
                  {test.text}
                </p>
              </div>

            </div>

          </article>
        ))}
      </div>

      <div className="absolute bottom-8 left-6 md:left-12 flex items-center gap-4 z-40">
        <button 
          onClick={prevSlide}
          disabled={activeIdx === 0}
          aria-label="Depoimento anterior"
          className={`w-12 h-12 md:w-14 md:h-14 rounded-full border border-[#F6F4F0]/20 flex items-center justify-center transition-all duration-300 hover:border-[#F6F4F0] hover:bg-[#F6F4F0]/10 ${activeIdx === 0 ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F6F4F0" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        
        <button 
          onClick={nextSlide}
          disabled={activeIdx === testimonials.length - 1}
          aria-label="Próximo depoimento"
          className={`w-12 h-12 md:w-14 md:h-14 rounded-full border border-[#F6F4F0]/20 flex items-center justify-center transition-all duration-300 hover:border-[#F6F4F0] hover:bg-[#F6F4F0]/10 ${activeIdx === testimonials.length - 1 ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F6F4F0" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>

    </section>
  );
}