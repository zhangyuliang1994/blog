const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// 根据环境变量决定是否使用Contentlayer
let withContentlayer = (config) => config
if (process.env.SKIP_CONTENTLAYER !== 'true') {
  try {
    withContentlayer = require('next-contentlayer').withContentlayer
  } catch (error) {
    console.warn('Contentlayer not available, skipping...')
  }
}

// You might need to insert additional domains in script-src if you are using external services
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app analytics.umami.is twikoo.xiaofeng.show vercel.app vercel.com va.vercel-scripts.com *.vercel-scripts.com;
  style-src 'self' 'unsafe-inline' fonts.loli.net;
  img-src * blob: data:;
  media-src *.s3.amazonaws.com;
  connect-src *;
  font-src 'self' fonts.loli.net gstatic.loli.net;
  frame-src giscus.app twikoo.xiaofeng.show
`

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
module.exports = () => {
  const plugins = [withContentlayer, withBundleAnalyzer]
  return plugins.reduce((acc, next) => next(acc), {
    // 开启静态 HTML 导出模式
    output: 'export',
    trailingSlash: true,
    // 禁用 Next.js 图片优化，支持纯静态导出
    images: {
      unoptimized: true,
      domains: ['picsum.photos'],
      remotePatterns: [
        { protocol: 'https', hostname: '**' }
      ],
    },
    reactStrictMode: true,
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    eslint: {
      dirs: ['app', 'components', 'layouts', 'scripts'],
    },
    experimental: {
      appDir: true,
    },
    webpack: (config, options) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      })

      // 优化静态导出的包大小
      if (options.isServer === false) {
        config.optimization = {
          ...config.optimization,
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all',
                enforce: true,
              },
              contentlayer: {
                test: /[\\/]contentlayer[\\/]/,
                name: 'contentlayer',
                chunks: 'all',
                enforce: true,
              },
              docs: {
                test: /[\\/]data[\\/]docs[\\/]/,
                name: 'docs',
                chunks: 'all',
                enforce: true,
              },
            },
          },
        }
      }

      return config
    },
  })
}
