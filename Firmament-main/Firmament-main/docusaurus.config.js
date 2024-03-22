// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

// @ts-ignore
const lightCodeTheme = require('prism-react-renderer/themes/github');
// @ts-ignore
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Firmament - 蒼穹',
  tagline: 'Firmament Web Apps',
  url: 'https://amentfirm.github.io/',
  baseUrl: '/',
  projectName: 'amentfirm.github.io',
  organizationName: 'amentfirm',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/firmament.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  // @ts-ignore
  organizationName: 'Firmament', // Usually your GitHub org/user name.
  // @ts-ignore
  projectName: 'Firmament', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  
  //i18n: {
  //  defaultLocale: 'en',
  //  locales: ['en', 'zh', 'cn'],
  //  path: 'lang',
  //  localeConfigs: {
  //    en: {
  //      label: 'English (US)',
  //      htmlLang: 'en-US',
  //      path: 'en',
  //    },
  //    zh: {
  //      label: '漢語',
  //      htmlLang: 'zh-Hant',
  //      path: 'zh',
  //    },
  //    cn: {
  //      label: '汉语',
  //      htmlLang: 'zh-Hans',
  //      path: 'cn',
  //    }
  //  }
  //},

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          //editUrl: 'https://github.com/amentfirm/amentfirm.github.io/tree/main/packages/create-docusaurus/templates/shared/', TODO
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          //editUrl: 'https://github.com/amentfirm/amentfirm.github.io/blog', TODO
        },
        theme: {
          customCss: [require.resolve('./src/css/custom.css')],
        },
      }),
    ],
  ],
  
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Firmament',
        logo: {
          alt: 'Firmament Logo',
          src: 'img/firmament.svg',
        },
        items: [
          {
            type: 'dropdown',
            position: 'left',
            label: 'Web Apps',
            items: [
              {
                type: 'doc',
                label: 'Firebase',
                docId: 'Firebase/Display',
              },
              {
                type: 'doc',
                label: 'NewsViz',
                docId: 'NewsViz/Scrape',
              },
              {
                type: 'doc',
                label: 'Games',
                docId: 'Games/GomokuNetPlay',
              },
              {
                type: 'doc',
                label: 'Stella',
                docId: 'Stella/Chatbot',
              }
            ]
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            type: 'localeDropdown',
            position: 'left',
          },
          // Custom item for login
          {
            type: 'custom-login-navbar-item',
            position: 'right'
          },
          {
            href: 'https://github.com/amentfirm/amentfirm.github.io',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Apps',
                to: '/docs/Games/Gomoku',
              },
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/amentfirm/amentfirm.github.io',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Firmament. Built with Docusaurus and Firebase.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
    
  plugins: [
    './postcss-tailwind-loader',
    'docusaurus-node-polyfills',
    () => ({
      name: 'my-webpack-loader',
      configureWebpack() {
        return {
          //module: {
          //  rules: [
          //    {
          //      resourceQuery: /raw/,
          //      type: 'asset/source',
          //    },
          //  ],
          resolve: {
            fallback: {
              fs: false,
              net: false,
              tls: false,
              child_process: false,
              readline: false,
            },
          },
          experiments: {
            topLevelAwait: true
          },
        };
      },
    }),
  ]
};


module.exports = config;
