/** @type {import('next').NextConfig} */
var AES = require("crypto-js/aes");
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
}

module.exports = nextConfig
