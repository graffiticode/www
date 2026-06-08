/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'app.graffiticode.org' },
      { protocol: 'https', hostname: 'api.graffiticode.org' },
    ],
  },
}

export default nextConfig
