/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { isServer }) => {
    // Ignore optional dependencies that cause build warnings
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'utf-8-validate': false,
        'bufferutil': false,
        'ws': false,
      };
      
      // Ignore WebSocket-related warnings from Supabase Realtime
      config.ignoreWarnings = [
        { module: /node_modules\/ws\/lib\/validation\.js/ },
        { module: /node_modules\/ws\/lib\/websocket\.js/ },
        { module: /node_modules\/ws\/index\.js/ },
        { module: /node_modules\/@supabase\/realtime-js/ },
      ];
    }
    
    // CRITICAL: Exclude Supabase Edge Functions from webpack compilation
    config.module.rules.push({
      test: /supabase\/functions\/.*\.ts$/,
      use: 'ignore-loader'
    });
    
    // Also exclude the entire supabase/functions directory
    config.resolve.alias = {
      ...config.resolve.alias,
      // Prevent webpack from trying to resolve Edge Function files
    };
    
    // Suppress specific warnings
    config.infrastructureLogging = {
      level: 'error',
    };
    
    return config;
  },
  // Exclude Supabase functions from Next.js build completely
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        './supabase/functions/**/*',
        './supabase/functions',
      ],
    },
  },
  // Exclude from TypeScript checking
  typescript: {
    ignoreBuildErrors: false,
  },
  // Suppress specific warnings in development
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
};

module.exports = nextConfig;