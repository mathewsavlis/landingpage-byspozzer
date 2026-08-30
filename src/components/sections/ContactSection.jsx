'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { contactData } from '@/data/contactData';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ContactSection() {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      
      // Animação de entrada fluida e expansiva (Estilo Editorial)
      // Como estamos dentro do gsap.context, o '.reveal-item' busca apenas dentro desta seção
      gsap.fromTo('.reveal-item', 
        { opacity: 0, y: 40 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.2, 
          stagger: 0.15, // Efeito cascata suave entre os elementos
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          }
        }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Coletar todos os dados do formulário de forma limpa
    const formData = new FormData(e.target);
    const data = {
      nome: formData.get('nome'),
      email: formData.get('email'),
      tipo: formData.get('tipo'),
      whatsapp: formData.get('whatsapp'),
      mensagem: formData.get('mensagem'),
      dataCadastro: new Date().toLocaleString('pt-BR'),
    };

    // 2. URLs dos Webhooks (Substitua pelos seus links reais, ex: Zapier, Make, n8n, Supabase)
    const webhookPrimario = "URL_DO_SEU_WEBHOOK_1_AQUI"; 
    const webhookSecundario = "URL_DO_SEU_WEBHOOK_2_AQUI"; 

    try {
      // Opcional: Você pode mudar o texto do botão para "Enviando..." aqui se quiser dar feedback visual

      // 3. Disparar o salvamento nos dois lugares simultaneamente
      // Usamos Promise.allSettled para garantir que, se um falhar, o outro ainda tente salvar
      await Promise.allSettled([
        fetch(webhookPrimario, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        }),
        fetch(webhookSecundario, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        })
      ]);

      // 4. Preparar o redirecionamento para o WhatsApp
      // Substitua pelo número da fotógrafa (Código do país + DDD + Número. Ex: 5511999999999)
      const numeroWhatsApp = "5511999999999"; 
      
      // Mensagem pré-pronta personalizada com os dados do cliente
      const textoWhatsApp = `Olá, Sthefani! Meu nome é ${data.nome}. Preenchi o formulário no site e gostaria de falar sobre um trabalho de ${data.tipo}.`;
      
      // Monta a URL oficial do WhatsApp formatando o texto para link
      const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(textoWhatsApp)}`;
      
      // Abre o WhatsApp em uma nova aba
      window.open(urlWhatsApp, "_blank"); 
      
      // 5. Limpar os campos do formulário após o sucesso
      e.target.reset();

    } catch (error) {
      console.error("Erro ao enviar o formulário:", error);
      alert("Ocorreu um erro na comunicação, mas você pode me chamar direto no WhatsApp!");
      // Em caso de falha crítica, você ainda pode forçar a abertura do WhatsApp aqui
    }
  };

  return (
    <section 
      ref={containerRef} 
      id="formulario" 
      aria-label="Formulário de Contato"
      className="relative w-full bg-[#F6F4F0] py-32 md:py-48 px-6 md:px-12 flex justify-center overflow-hidden"
    >
      
      {/* =========================================
          DEGRADÊ DE CONEXÃO (Entre a seção anterior e esta)
      ========================================= */}
      <div className="absolute top-0 left-0 w-full h-[20vh] bg-gradient-to-b from-[#EAE6DF] to-transparent pointer-events-none" aria-hidden="true"></div>

      <div className="relative z-10 max-w-4xl w-full flex flex-col items-center">
        
        {/* Cabeçalho da Seção */}
        <header className="text-center mb-20 md:mb-28 w-full">
          <span className="reveal-item opacity-0 text-[#B59A6D] text-xs font-serif tracking-[0.3em] uppercase mb-6 block">
            {contactData.header.subtitle}
          </span>
          <h2 className="reveal-item opacity-0 text-4xl md:text-5xl lg:text-6xl font-light text-[#2A2A2A] tracking-tight leading-tight">
            {contactData.header.titlePart1} <br className="hidden md:block" />
            <span className="italic font-serif">{contactData.header.titlePart2}</span>
          </h2>
        </header>

        {/* Formulário Editorial */}
        <form 
          onSubmit={handleSubmit} 
          className="w-full flex flex-col gap-12 md:gap-16"
          suppressHydrationWarning 
        >
          
          {/* Linha 1: Nome e E-mail */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            
            {/* Campo: Nome */}
            <div className="reveal-item opacity-0 flex flex-col group">
              <label htmlFor="nome" className="text-xs font-serif uppercase tracking-[0.15em] text-[#2A2A2A]/50 mb-3 group-focus-within:text-[#B59A6D] transition-colors">
                {contactData.form.name.label}
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                autoComplete="name" // Otimização de UX: Auto-preenchimento
                required
                className="w-full bg-transparent border-b border-[#2A2A2A]/20 pb-3 text-lg md:text-xl font-light text-[#2A2A2A] focus:outline-none focus:border-[#2A2A2A] transition-colors rounded-none"
                suppressHydrationWarning
              />
            </div>

            {/* Campo: E-mail */}
            <div className="reveal-item opacity-0 flex flex-col group">
              <label htmlFor="email" className="text-xs font-serif uppercase tracking-[0.15em] text-[#2A2A2A]/50 mb-3 group-focus-within:text-[#B59A6D] transition-colors">
                {contactData.form.email.label}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email" // Otimização de UX: Auto-preenchimento
                required
                className="w-full bg-transparent border-b border-[#2A2A2A]/20 pb-3 text-lg md:text-xl font-light text-[#2A2A2A] focus:outline-none focus:border-[#2A2A2A] transition-colors rounded-none"
                suppressHydrationWarning
              />
            </div>

          </div>

          {/* Linha 2: Tipo de Trabalho e WhatsApp */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            
            {/* Campo: Tipo de Trabalho */}
            <div className="reveal-item opacity-0 flex flex-col group">
              <label htmlFor="tipo" className="text-xs font-serif uppercase tracking-[0.15em] text-[#2A2A2A]/50 mb-3 group-focus-within:text-[#B59A6D] transition-colors">
                {contactData.form.type.label}
              </label>
              <div className="relative">
                <select
                  id="tipo"
                  name="tipo"
                  required
                  defaultValue=""
                  className="w-full bg-transparent border-b border-[#2A2A2A]/20 pb-3 text-lg md:text-xl font-light text-[#2A2A2A] focus:outline-none focus:border-[#2A2A2A] transition-colors appearance-none rounded-none cursor-pointer"
                  suppressHydrationWarning
                >
                  <option value="" disabled hidden>{contactData.form.type.placeholder}</option>
                  {contactData.form.type.options.map((option, idx) => (
                    <option key={idx} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pb-3 pointer-events-none" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2A2A2A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            </div>

            {/* Campo: WhatsApp */}
            <div className="reveal-item opacity-0 flex flex-col group">
              <label htmlFor="whatsapp" className="text-xs font-serif uppercase tracking-[0.15em] text-[#2A2A2A]/50 mb-3 group-focus-within:text-[#B59A6D] transition-colors">
                {contactData.form.whatsapp.label}
              </label>
              <input
                type="tel"
                id="whatsapp"
                name="whatsapp"
                autoComplete="tel" // Otimização de UX: Auto-preenchimento
                placeholder={contactData.form.whatsapp.placeholder}
                className="w-full bg-transparent border-b border-[#2A2A2A]/20 pb-3 text-lg md:text-xl font-light text-[#2A2A2A] focus:outline-none focus:border-[#2A2A2A] transition-colors rounded-none placeholder:text-[#2A2A2A]/30"
                suppressHydrationWarning
              />
            </div>

          </div>

          {/* Linha 3: Mensagem */}
          <div className="reveal-item opacity-0 flex flex-col group">
            <label htmlFor="mensagem" className="text-xs font-serif uppercase tracking-[0.15em] text-[#2A2A2A]/50 mb-3 group-focus-within:text-[#B59A6D] transition-colors">
              {contactData.form.message.label}
            </label>
            <textarea
              id="mensagem"
              name="mensagem"
              rows="3"
              required
              className="w-full bg-transparent border-b border-[#2A2A2A]/20 pb-3 text-lg md:text-xl font-light text-[#2A2A2A] focus:outline-none focus:border-[#2A2A2A] transition-colors rounded-none resize-y"
              suppressHydrationWarning
            ></textarea>
          </div>

          {/* Linha 4: Botão de Enviar */}
          <div className="reveal-item opacity-0 flex justify-end mt-8">
            <button
              type="submit"
              className="group relative flex items-center gap-4 bg-[#2A2A2A] text-[#F6F4F0] px-10 py-5 uppercase tracking-[0.2em] text-xs font-medium transition-all duration-500 hover:bg-[#B59A6D]"
              suppressHydrationWarning
            >
              <span>{contactData.form.submitBtn}</span>
              <svg aria-hidden="true" className="transform transition-transform duration-500 group-hover:translate-x-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>

        </form>

      </div>
    </section>
  );
}