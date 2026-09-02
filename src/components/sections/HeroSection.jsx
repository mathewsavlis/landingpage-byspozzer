'use client';

import { useEffect, useRef, memo } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { heroData } from '@/data/heroData';

const GalleryItem = memo(({ item, index, total }) => {
  return (
    <article
      title={item.title}
      className="gallery-item relative w-[85vw] md:w-[45vw] lg:w-[35vw] h-[80svh] md:h-[75vh] flex items-center justify-center cursor-pointer overflow-hidden rounded-sm border border-[#F6F4F0]/15 shrink-0 bg-black/20"
    >
      <img
        src={item.src}
        alt={item.title}
        loading="eager"
        className="inner-parallax-img absolute inset-0 w-full h-full object-cover will-change-transform transform-gpu"
      />
      <div className="absolute inset-0 bg-black/10 transition-colors hover:bg-transparent z-10" />
      <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 text-[#F6F4F0] font-light text-sm tracking-[0.2em] z-20 drop-shadow-md">
        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:bottom-8 text-[#F6F4F0] font-medium text-xs tracking-[0.4em] uppercase z-20 whitespace-nowrap drop-shadow-md">
        {item.title}
      </div>
    </article>
  );
});
GalleryItem.displayName = 'GalleryItem';

export default function HeroSection() {
  const containerRef = useRef(null);
  const layerRef = useRef(null);
  const videoRef = useRef(null);
  const heroContentRef = useRef(null);
  const blurOverlayRef = useRef(null);
  const portfolioHeaderRef = useRef(null);
  const portfolioTitleGroupRef = useRef(null);
  const galleryRowRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });
    }

    // Força o autoplay no mobile de maneira absoluta
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      const playRes = videoRef.current.play();
      if (playRes !== undefined) {
        playRes.catch(e => console.warn("Autoplay bloqueado:", e));
      }
    }

    let ctx = gsap.context(() => {
      if (!containerRef.current) return;

      const galleryItems = gsap.utils.toArray('.gallery-item');
      const innerImages = gsap.utils.toArray('.inner-parallax-img');
      const heroElements = gsap.utils.toArray('.hero-anim-item');

      if (heroElements.length > 0) {
        gsap.fromTo(heroElements,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, stagger: 0.3, ease: 'power4.out', duration: 2.5, delay: 0.2, force3D: true }
        );
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=450%",
          pin: true,
          scrub: 0.7,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (!galleryRowRef.current || galleryItems.length === 0) return;
            const progress = self.progress;

            if (progress > 0.25 && progress < 0.8) {
              const center = window.innerWidth / 2;
              const rowX = gsap.getProperty(galleryRowRef.current, "x");

              galleryItems.forEach((item, i) => {
                const itemCenter = (item.offsetLeft + rowX) + (item.offsetWidth / 2);
                const scale = 1.15 - (Math.abs(center - itemCenter) / window.innerWidth) * 0.15;
                const clampedScale = Math.max(1, Math.min(1.15, scale));

                gsap.set(innerImages[i], { scale: clampedScale, force3D: true });
              });
            }
          }
        }
      });

      tl.to(heroContentRef.current, { y: -100, autoAlpha: 0, duration: 1, ease: "power2.inOut" }, 0);
      tl.to(blurOverlayRef.current, { autoAlpha: 1, duration: 1, ease: "power2.inOut" }, 0);

      tl.fromTo(portfolioHeaderRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, 0.5);
      tl.fromTo(portfolioTitleGroupRef.current, { y: 0, autoAlpha: 0 }, { autoAlpha: 1, y: 0, duration: 1, ease: "expo.out" }, 0.5);

      // Movimenta a BARRA inteira para cima (sem diminuir a largura dela)
      tl.to(portfolioTitleGroupRef.current, {
        y: () => window.innerWidth < 768 ? -window.innerHeight * 0.45 : -window.innerHeight * 0.43,
        duration: 1.1, ease: "power3.inOut"
      }, 1.5);

      // Diminui elegantemente APENAS os textos dentro da barra
      tl.to('.inner-title-content', {
        scale: 0.78,
        duration: 1.1, ease: "power3.inOut"
      }, 1.5);

      if (galleryItems.length > 0) {
        tl.fromTo(galleryItems,
          { autoAlpha: 0, x: 80 },
          { autoAlpha: 1, x: 0, duration: 1, stagger: 0.1, ease: "expo.out", force3D: true }, 1.6
        );
      }

      // CORREÇÃO BARRA: Largura total, vidro quase transparente, bordas horizontais sutis
      tl.to(portfolioTitleGroupRef.current, {
        backgroundColor: "rgba(255, 255, 255, 0.03)", // Quase 100% transparente
        backdropFilter: "blur(12px)", // Vidro jateado leve
        WebkitBackdropFilter: "blur(12px)",
        borderTopColor: "rgba(255, 255, 255, 0.1)", // Borda apenas em cima
        borderBottomColor: "rgba(255, 255, 255, 0.1)", // e embaixo
        duration: 0.8, ease: "power1.inOut"
      }, 2.5);

      if (galleryRowRef.current) {
        const scrollDist = () => -(galleryRowRef.current.scrollWidth - window.innerWidth + (window.innerWidth * 0.12));
        tl.to(galleryRowRef.current, { x: scrollDist, ease: "none", duration: 4, force3D: true }, 2.5);
      }
      tl.to(progressBarRef.current, { scaleX: 1, ease: "none", duration: 4 }, 2.5);

      // FASE 4: SAÍDA SUAVE
      tl.to([galleryRowRef.current, progressBarRef.current], { autoAlpha: 0, duration: 1, ease: "power2.inOut" }, 5.0);
      tl.to(portfolioTitleGroupRef.current, { autoAlpha: 0, duration: 1, ease: "power2.inOut" }, 5.2);
      tl.to(containerRef.current, { backgroundColor: "#F6F4F0", duration: 1, ease: "none" }, 5.5);
      tl.to(layerRef.current, { borderColor: "transparent", autoAlpha: 0, duration: 1, ease: "power2.inOut" }, 5.5);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} aria-label="Apresentação Principal" className="relative w-full h-[100svh] bg-[#2A2A2A]">
      <div
        ref={layerRef}
        className="absolute inset-0 w-full h-full flex flex-col items-center justify-center overflow-hidden origin-center will-change-transform transform-gpu border border-[#F6F4F0]/15"
      >
        {/* VÍDEO: Configurado estritamente para autoplay contínuo e looping em todas as plataformas */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          defaultMuted
          playsInline
          webkit-playsinline="true"
          x5-video-player-type="h5"
          x5-video-player-fullscreen="false"
          disablePictureInPicture
          disableRemotePlayback
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none"
        >
          <source src="/landingpage-byspozzer/hero-mobile.mp4" type="video/mp4" media="(max-width: 767px)" />
          <source src="/landingpage-byspozzer/hero-pc.mp4" type="video/mp4" media="(min-width: 768px)" />
        </video>

        {/* PELÍCULAS: Escurecimento bastante reduzido (de 30 para 10) para revelar bem o vídeo */}
        <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none" />
        {/* O overlay que entra com a galeria agora tem desfoque, mas é menos escuro (bg-[#2A2A2A]/40) */}
        <div ref={blurOverlayRef} className="absolute inset-0 bg-[#2A2A2A]/40 backdrop-blur-md opacity-0 z-10 pointer-events-none will-change-[opacity]" />

        <header ref={heroContentRef} className="absolute z-20 text-center px-4 md:px-12 max-w-6xl mx-auto flex flex-col items-center justify-center w-full">
          <h1 className="hero-anim-item text-4xl sm:text-5xl md:text-7xl lg:text-[5rem] font-light mb-6 leading-[1.05] text-[#F6F4F0] tracking-tighter drop-shadow-2xl">
            {heroData.heading.part1} <br className="hidden md:block" />
            <span className="italic font-serif text-[#B59A6D] ml-[0.2em] font-normal tracking-normal pr-2">
              {heroData.heading.part2}
            </span>
          </h1>
          <p className="hero-anim-item text-sm md:text-base lg:text-lg font-light tracking-wide mb-12 max-w-[95%] sm:max-w-[80%] md:max-w-2xl text-[#F6F4F0]/80 leading-relaxed mx-auto">
            {heroData.subheading}
          </p>
          <div className="hero-anim-item">
            <a href={heroData.ctaButton.link} title={heroData.ctaButton.text} className="inline-block border border-[#F6F4F0]/40 text-[#F6F4F0] hover:bg-[#F6F4F0] hover:text-[#2A2A2A] px-10 py-4 uppercase tracking-[0.3em] text-xs font-medium transition-colors duration-500 rounded-sm">
              {heroData.ctaButton.text}
            </a>
          </div>
        </header>

        <div ref={portfolioHeaderRef} className="absolute inset-0 z-30 pointer-events-none opacity-0 flex items-center justify-center">
          {/* BARRA: w-full (ponta a ponta), padding Y maior, flex-col para centralizar textos um em cima do outro, border-y */}
          <div
            ref={portfolioTitleGroupRef}
            className="absolute z-10 flex flex-col items-center justify-center w-full py-6 md:py-6 will-change-transform border-y border-transparent"
          >
            {/* O CONTEÚDO QUE VAI DIMINUIR DE TAMANHO */}
            <div className="inner-title-content flex flex-col items-center text-center">
              <h2 className="text-3xl md:text-4xl font-light text-[#F6F4F0] tracking-tight leading-none drop-shadow-md">
                {heroData.portfolioTitle}
              </h2>
              <p className="text-[#B59A6D] tracking-[0.3em] uppercase text-[10px] md:text-xs font-medium mt-3">
                {heroData.portfolioSubtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 z-20 flex flex-col justify-center pointer-events-none">
          <div className="w-full h-full flex items-center overflow-hidden pointer-events-auto">
            <div ref={galleryRowRef} className="flex gap-4 md:gap-10 px-[7.5vw] md:px-16 w-max will-change-transform h-full items-center">
              {heroData.galleryImages.map((item, index) => (
                <GalleryItem key={item.id} item={item} index={index} total={heroData.galleryImages.length} />
              ))}
            </div>
          </div>
        </div>

        <div ref={progressBarRef} className="absolute bottom-0 left-0 h-[2px] bg-[#B59A6D] z-40 origin-left scale-x-0 w-full" />
      </div>
    </section>
  );
}