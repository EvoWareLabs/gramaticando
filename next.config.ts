/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Aviso: Isso irá ignorar erros de ESLint durante o build de produção
    // Use com cautela e apenas se você estiver ciente dos riscos
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Opcionalmente, você também pode ignorar erros de TypeScript
    // Use com cautela
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig

