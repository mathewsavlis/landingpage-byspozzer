'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { heroData } from '@/data/heroData';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export default function HeroSection() {
  const containerRef = useRef(null);
  const heroContentRef = useRef(null);
  const blurOverlayRef = useRef(null);
  const portfolioRef = useRef(null);
  const galleryRowRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      
      // 1. Animação de Entrada Inicial ao carregar a página
      gsap.fromTo(heroContentRef.current.children, 
        { y: 50, autoAlpha: 0 }, 
        { y: 0, autoAlpha: 1, duration: 1.5, stagger: 0.2, ease: 'power3.out', delay: 0.3 }
      );

      // 2. Timeline de Scroll Principal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          // Aumentamos o percurso para 400% para acomodar as animações de entrada, meio e saída com bastante respiro
          end: "+=400%", 
          pin: true, 
          scrub: 1.2, 
          invalidateOnRefresh: true, 
        }
      });

      // ==========================================
      // FASE 1: MERGULHO (Texto sai, Galeria entra)
      // ==========================================
      // O texto vem na direção da câmara (scale: 1.15) e sobe, criando profundidade
      tl.to(heroContentRef.current, { 
        y: -100, 
        scale: 1.15, 
        autoAlpha: 0, 
        duration: 1.5, 
        ease: "power2.inOut" 
      }, 0);
      
      tl.to(blurOverlayRef.current, { autoAlpha: 1, duration: 1.5, ease: "power2.inOut" }, 0);
      
      // A galeria vem do fundo (scale: 0.85) e assume o tamanho normal
      tl.fromTo(portfolioRef.current, 
        { autoAlpha: 0, y: 80, scale: 0.85 }, 
        { autoAlpha: 1, y: 0, scale: 1, duration: 1.5, ease: "power2.out" },
        0.3 // Começa a aparecer um pouco depois do texto começar a sumir (sobreposição)
      );

      // ==========================================
      // FASE 2: SCROLL HORIZONTAL
      // ==========================================
      tl.to(galleryRowRef.current, {
        x: () => {
          if (!galleryRowRef.current) return 0;
          return -(galleryRowRef.current.scrollWidth - document.documentElement.clientWidth + 80);
        },
        ease: "power1.inOut", 
        duration: 4 
      }, "+=0.2"); // Pausa milimétrica antes de começar a rolar para o lado

      // ==========================================
      // FASE 3: SAÍDA CINEMATOGRÁFICA (Fim do layer)
      // ==========================================
      // Em vez de soltar a página de repente, a galeria sobe e desvanece suavemente
      tl.to(portfolioRef.current, {
        y: -100,
        scale: 1.05,
        autoAlpha: 0,
        duration: 1.5,
        ease: "power2.inOut"
      }, "+=0.5"); // O "+=0.5" é o respiro! O utilizador vê a última foto parar, e só depois ela sai

      // Opcional: remover o blur do fundo enquanto a galeria sai, para preparar a próxima secção
      tl.to(blurOverlayRef.current, { autoAlpha: 0, duration: 1.5, ease: "power2.inOut" }, "<");

    }, containerRef);

    return () => ctx.revert(); 
  }, []);

  return (
    <section 
      ref={containerRef} 
      aria-label="Apresentação Principal"
      className="relative w-full h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-[#2A2A2A]"
    >
      
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover z-0"
        aria-hidden="true"
      >
        <source src="/hero-mobile.mp4" type="video/mp4" media="(max-width: 767px)" />
        <source src="/hero-pc.mp4" type="video/mp4" media="(min-width: 768px)" />
      </video>

      <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none"></div>
      <div ref={blurOverlayRef} className="absolute inset-0 bg-[#2A2A2A]/60 backdrop-blur-xl opacity-0 z-10 pointer-events-none"></div>

      {/* TEXTO INICIAL */}
      <header 
        ref={heroContentRef} 
        className="absolute z-20 text-center px-4 md:px-12 max-w-5xl mx-auto flex flex-col items-center justify-center w-full"
      >
        <h1 className="text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl font-extralight mb-6 leading-[1.1] text-[#F6F4F0] drop-shadow-lg opacity-0 tracking-tight">
          {heroData.heading.part1} <br className="hidden md:block" />
          <span className="italic font-serif text-[#B59A6D] ml-2">{heroData.heading.part2}</span>
        </h1>
        
        <p className="text-sm md:text-base lg:text-lg font-light tracking-wide mb-10 max-w-[90%] md:max-w-2xl text-[#F6F4F0]/90 leading-relaxed drop-shadow-md opacity-0">
          {heroData.subheading}
        </p>
        
        <div className="opacity-0">
          <a 
            href={heroData.ctaButton.link} 
            title={heroData.ctaButton.text}
            className="inline-block border border-[#F6F4F0]/60 text-[#F6F4F0] hover:bg-[#F6F4F0] hover:text-[#2A2A2A] px-8 md:px-12 py-4 uppercase tracking-[0.3em] text-xs md:text-sm font-medium transition-all duration-500"
          >
            {heroData.ctaButton.text}
          </a>
        </div>
      </header>

      {/* GALERIA HORIZONTAL */}
      <div ref={portfolioRef} className="absolute inset-0 z-20 flex flex-col justify-center opacity-0 pointer-events-none">
        <div className="px-6 md:px-12 lg:px-24 mb-10 mt-12 md:mt-0 pointer-events-auto">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-[#F6F4F0] drop-shadow-md">
            {heroData.portfolioTitle}
          </h2>
          <p className="text-[#B59A6D] tracking-[0.2em] uppercase text-xs md:text-sm mt-3">
            {heroData.portfolioSubtitle}
          </p>
        </div>
        
        <div className="w-full pointer-events-auto">
          <div ref={galleryRowRef} className="flex gap-4 md:gap-8 px-6 md:px-12 lg:px-24 w-max">
            {heroData.galleryImages.map((item) => (
              <article 
                key={item.id} 
                className="w-[80vw] md:w-[45vw] lg:w-[30vw] h-[50vh] md:h-[60vh] bg-[#F6F4F0]/5 backdrop-blur-sm border border-[#F6F4F0]/10 rounded-sm flex items-center justify-center transition-all hover:bg-[#F6F4F0]/10 cursor-pointer"
                title={item.title}
              >
                <span className="text-[#F6F4F0]/50 font-serif italic text-lg">{item.title}</span>
              </article>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}