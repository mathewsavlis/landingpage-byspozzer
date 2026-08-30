import './globals.css'; // Isso é OBRIGATÓRIO para puxar as cores e fontes!

export const metadata = {
  title: 'Sthefani Pozzer',
  description: 'Se veja como a mulher que você admira.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}