/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    },
    serverComponentsExternalPackages: ['@node-rs/argon2', '@node-rs/bcrypt']
  },
  webpack: (config) => {
    config.externals = config.externals || []
    // Keep native bindings and oslo out of the bundle (use Node to resolve at runtime)
    config.externals.push(({ request }, callback) => {
      if (!request) return callback()
      if (
        request.startsWith('@node-rs/argon2') ||
        request.startsWith('@node-rs/bcrypt') ||
        request === 'oslo' ||
        request.startsWith('oslo/')
      ) {
        return callback(null, 'commonjs ' + request)
      }
      callback()
    })
    return config
  }
};

export default nextConfig;
