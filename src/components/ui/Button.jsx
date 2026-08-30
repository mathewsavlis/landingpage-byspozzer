export default function Button({ children, href, onClick, className = "", variant = "primary" }) {
  const baseStyle = "inline-block px-8 py-4 uppercase tracking-[0.2em] text-xs font-medium transition-all duration-300";
  
  const variants = {
    // Fundo Grafite, Texto Off-White
    primary: "bg-secondary text-primary hover:bg-secondary/80",
    // Contorno
    outline: "border border-secondary text-secondary hover:bg-secondary hover:text-primary"
  };

  // Se o botão for usado sobre um fundo muito escuro (como o Hero), usamos uma variante especial:
  const heroVariant = "border border-primary text-primary hover:bg-primary hover:text-secondary";

  // Pequeno truque para o botão do hero:
  const isHero = className.includes('hero-btn');
  const appliedVariant = isHero ? heroVariant : variants[variant];

  const style = `${baseStyle} ${appliedVariant} ${className.replace('hero-btn', '')}`;

  if (href) {
    return <a href={href} className={style}>{children}</a>;
  }
  return <button onClick={onClick} className={style}>{children}</button>;
}