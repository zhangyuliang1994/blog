/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: "我的博客",
  author: 'Prabhu Kiran Konda',
  headerTitle: "我的博客",
  description: '技术探索与分享',
  language: 'zh-CN',
  theme: 'light', // system, dark or light
  siteUrl: 'https://prabhukirankonda.vercel.app',
  siteRepo: 'https://github.com/PrabhuKiran8790/prabhukirankonda',
  siteLogo: '/static/images/logo.png',
  socialBanner: '/static/images/twitter-card.png',
  email: 'prabhukiran426@gmail.com',
  github: 'https://github.com/PrabhuKiran8790',
  twitter: 'https://twitter.com/prabhukirantwt',
  linkedin: 'https://www.linkedin.com/in/prabhukirankonda',
  locale: 'zh-CN',
  socialLinks: {
    github: 'https://www.github.com/prabhukiran8790',
    linkedin: 'https://www.linkedin.com/in/prabhukirankonda',
    twitter: 'https://twitter.com/prabhukirantwt',
    mail: 'mailto:prabhukiran426@gmail.com',
  },
  analytics: {
    // If you want to use an analytics provider you have to add it to the
    // content security policy in the `next.config.js` file.
    // supports Plausible, Simple Analytics, Umami, Posthog or Google Analytics.
    umamiAnalytics: {
      // We use an env variable for this site to avoid other users cloning our analytics ID
      umamiWebsiteId: process.env.NEXT_UMAMI_ID, // e.g. 123e4567-e89b-12d3-a456-426614174000
    },
    // plausibleAnalytics: {
    //   plausibleDataDomain: '', // e.g. tailwind-nextjs-starter-blog.vercel.app
    // },
    // simpleAnalytics: {},
    // posthogAnalytics: {
    //   posthogProjectApiKey: '', // e.g. 123e4567-e89b-12d3-a456-426614174000
    // },
    // googleAnalytics: {
    //   googleAnalyticsId: '', // e.g. G-XXXXXXX
    // },
  },
  newsletter: {
    // supports mailchimp, buttondown, convertkit, klaviyo, revue, emailoctopus
    // Please add your .env file and modify it according to your selection
    provider: 'mailchimp',
  },
  comments: {
    // If you want to use an analytics provider you have to add it to the
    // content security policy in the `next.config.js` file.
    // Select a provider and use the environment variables associated to it
    // https://vercel.com/docs/environment-variables
    provider: 'twikoo', // 将provider改为twikoo
    twikooConfig: {
      envId: 'https://twikoo.xiaofeng.show/', // 您的环境ID
      lang: 'zh-CN',
    },
    // 保留旧的giscus配置，但已不再使用
    giscusConfig: {
      // Visit the link below, and follow the steps in the 'configuration' section
      // https://giscus.app/
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
      repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID,
      category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
      mapping: 'pathname', // supported options: pathname, url, title
      reactions: '1', // Emoji reactions: 1 = enable / 0 = disable
      // Send discussion metadata periodically to the parent window: 1 = enable / 0 = disable
      metadata: '0',
      theme: 'light',
      darkTheme: 'transparent_dark',
      themeURL: '',
      lang: 'zh-CN',
    },
  },
  search: {
    provider: 'kbar', // kbar or algolia
    kbarConfig: {
      searchDocumentsPath: 'search.json', // path to load documents to search
    },
    // provider: 'algolia',
    // algoliaConfig: {
    //   // The application ID provided by Algolia
    //   appId: 'R2IYF7ETH7',
    //   // Public API key: it is safe to commit it
    //   apiKey: '599cec31baffa4868cae4e79f180729b',
    //   indexName: 'docsearch',
    // },
  },
}

module.exports = siteMetadata
