'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { methodData } from '@/data/methodData';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ProcessSection() {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Escopo definido (containerRef.current) melhora a performance de busca do GSAP
      const steps = gsap.utils.toArray('.method-step', containerRef.current);
      
      steps.forEach((step) => {
        gsap.fromTo(step, 
          { opacity: 0.3, x: -10 }, 
          { 
            opacity: 1, 
            x: 0, 
            duration: 0.5,
            scrollTrigger: {
              trigger: step,
              start: "top 60%", 
              end: "bottom 40%", 
              toggleActions: "play reverse play reverse" 
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      aria-label="Nosso Método"
      className="relative w-full bg-gradient-to-b from-[#F6F4F0] to-[#EAE6DF] py-24 md:py-40"
    >
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-16 lg:gap-24 relative">
        
        {/* COLUNA ESQUERDA: TEXTOS ROLÁVEIS */}
        <div className="w-full md:w-1/2 flex flex-col z-10">
          
          <header className="mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#2A2A2A] mb-6">
              {methodData.sectionTitle}
            </h2>
            <p className="text-lg font-light text-[#2A2A2A]/80 max-w-md leading-relaxed">
              {methodData.sectionDescription}
            </p>
          </header>

          {/* Lista do Método (Timeline) -> Agora semanticamente uma <ol> */}
          <ol className="relative border-l border-[#2A2A2A]/15 pl-8 md:pl-12 ml-2 md:ml-4 flex flex-col gap-16 list-none m-0">
            
            {methodData.steps.map((step) => (
              // Substituímos a key index pelo step.id (melhor prática React) e div por li
              <li key={step.id} className="method-step relative">
                
                {/* Bolinha dourada */}
                <div className="absolute -left-[37px] md:-left-[53px] top-1 w-2 h-2 rounded-full bg-[#B59A6D] shadow-[0_0_10px_rgba(181,154,109,0.3)]" aria-hidden="true"></div>
                
                {/* Número do Passo (Escondido do leitor de tela para não duplicar áudio) */}
                <span className="text-[#B59A6D] text-xs font-serif tracking-[0.2em] mb-4 block" aria-hidden="true">
                  ( {step.id} )
                </span>
                
                {/* Título */}
                <h3 className="text-2xl md:text-3xl font-light text-[#2A2A2A] uppercase tracking-wide mb-4">
                  {/* Texto exclusivo para acessibilidade */}
                  <span className="sr-only">Etapa {step.id}: </span>
                  {step.title}
                </h3>
                
                {/* Descrição */}
                <p className="text-[#2A2A2A]/75 font-light leading-relaxed mb-6 max-w-sm">
                  {step.description}
                </p>
                
                {/* Item de Aprovação */}
                {step.approval && (
                  <div className="flex items-center gap-3">
                    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B59A6D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-sm font-medium text-[#B59A6D] uppercase tracking-wider">
                      {step.approval}
                    </span>
                  </div>
                )}
                
              </li>
            ))}
          </ol>
        </div>

        {/* COLUNA DIREITA: MÍDIA FIXA (Sticky) */}
        <div className="w-full md:w-1/2 h-[60vh] md:h-[100vh] relative md:sticky top-0 md:top-0 flex items-center justify-center">
          
          <div className="relative w-full max-w-[500px] aspect-[4/3] bg-white p-3 md:p-5 shadow-xl border border-[#2A2A2A]/5">
            <video 
              src="/metodo-video.mp4" 
              autoPlay 
              muted 
              loop 
              playsInline
              aria-hidden="true" // Oculta o vídeo de leitores de tela (pois é decorativo/atmosférico)
              className="w-full h-full object-cover grayscale opacity-90"
            />
          </div>
          
        </div>

      </div>
    </section>
  );
}