
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  poweredByHeader: false,
  compress: true,

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    domains: [
      'cdn.jsdelivr.net',
      'avatars.githubusercontent.com',
      'github.com',
      'api.github.com',
      'prod.spline.design',
      'unpkg.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        pathname: '/gh/devicons/devicon/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'prod.spline.design',
        pathname: '/**',
      }
    ],
  },

  // Skip type checking during build if environment variable is set
  typescript: {
    ignoreBuildErrors: process.env.SKIP_TYPE_CHECK === 'true',
  },
  eslint: {
    ignoreDuringBuilds: process.env.SKIP_TYPE_CHECK === 'true',
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },
  webpack: (config, { isServer }) => {
    // Handle Three.js and other client-side libraries
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    // Exclude Netlify edge functions from build
    config.externals = config.externals || [];
    config.externals.push({
      'https://edge.netlify.com': 'commonjs https://edge.netlify.com'
    });

    // Ignore netlify directory during build
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/netlify/**', '**/node_modules/**']
    };

    // Handle shader files for Three.js
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      type: 'asset/source',
    });

    return config;
  },
  transpilePackages: [
    '@splinetool/react-spline',
    '@splinetool/runtime',
    '@splinetool/loader',
    'three',
    '@react-three/fiber',
    '@react-three/drei',
    'gsap'
  ],
  compiler: {
    styledComponents: true,
  },
  env: {
    CUSTOM_KEY: 'my-value',
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        // Allow PDF files to be embedded
        source: '/resume.pdf',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
          {
            key: 'Content-Type',
            value: 'application/pdf',
          },
        ],
      },
      {
        // Allow all PDF files to be embedded
        source: '/(.*).pdf',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
          {
            key: 'Content-Type',
            value: 'application/pdf',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
