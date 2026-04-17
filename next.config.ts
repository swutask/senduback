import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "10.10.7.26",
        port: "5001",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "10.10.7.26",
        port: "5002",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    unoptimized: true,
  },

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.senduback.com",
          },
        ],
        destination: "https://senduback.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
