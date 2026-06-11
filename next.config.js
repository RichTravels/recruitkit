/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Prevent Vercel's edge network from caching any authenticated app routes
        source: "/(dashboard|outreach/:path*|interview/:path*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
