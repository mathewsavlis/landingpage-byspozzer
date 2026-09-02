/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.2.129'],
  reactCompiler: true,
  output: 'export', // Diz ao Next para gerar uma pasta HTML/CSS estática
  basePath: '/landingpage-byspozzer', // Substitua pelo nome exato do seu repositório no GitHub
  images: {
    unoptimized: true, // Necessário se você usa a tag <Image /> do Next
  }
};

export default nextConfig;