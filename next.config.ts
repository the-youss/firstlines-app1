import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: false,
  typescript:{
    ignoreBuildErrors:true
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/app/dashboard',
        permanent: true, // set true if you want 301
      },
    ];
  },
};

export default nextConfig;
