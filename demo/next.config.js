/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/Interminimal/demo",
  reactStrictMode: true,
  images: { loader: "custom", domains: ["placekitten.com"] }
};

module.exports = nextConfig;
