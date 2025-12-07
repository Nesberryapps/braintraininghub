
/** @type {import('next').NextConfig} */
const nextConfig = {
  /* 
     SMART CONFIGURATION:
     - If running in GitHub Actions (Mobile Build), use 'export' to generate the ./out folder.
     - If running in Firebase App Hosting (Web Build), use default (dynamic) mode.
  */
  output: process.env.GITHUB_ACTIONS ? 'export' : undefined,

  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    unoptimized: true, // Required for static export (mobile)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
