/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, // Disable React Strict Mode to prevent multiple renders in development

    experimental: {
      serverComponentsExternalPackages: ["mongoose"],
    },
    images: {
      domains: ['lh3.googleusercontent.com'],
    },
    webpack(config) {
      config.experiments = {
        ...config.experiments,
        topLevelAwait: true,
      }
      return config
    }
  }
  export default nextConfig
  