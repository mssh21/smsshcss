/**
 * SmsshCSS Configuration Example
 * Updated for v2.3.0 with enhanced validation and versioning support
 *
 * Copy this file and use it as `smsshcss.config.js`
 *
 * Usage:
 * 1. cp smsshcss.config.example.js smsshcss.config.js
 * 2. Customize the settings as needed
 * 3. Check the configuration with npm run validate:config
 */

module.exports = {
  // Version info (added in v2.3.0)
  // Used for configuration compatibility checks and migration support
  version: '2.3.0',

  // 📁 File patterns to scan
  content: [
    './src/**/*.{html,js,jsx,ts,tsx,vue,svelte}',
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    // '**/*.html', // すべてのHTMLファイル（パフォーマンスに注意）
  ],

  // 🔒 CSS classes to always include (not purged)
  safelist: [
    'btn',
    'btn-primary',
    'container',
    /^grid-cols-/, // 正規表現も使用可能
    // 動的に生成されるクラス
    'm-2xl',
    'p-2xl',
    'mt-2xl',
    'mb-2xl',
    'mx-2xl',
    'py-2xl',
    'gap-2xl',
    'gap-x-2xl',
    'gap-y-2xl',

    // 正規表現パターン
    /^hover:p-/,
    /^focus:m-/,
    /^sm:/, // レスポンシブクラス（将来の実装）
    /^md:/,
    /^lg:/,
  ],

  // 📝 Include base CSS and reset CSS
  includeResetCSS: true, // Include Normalize/Reset CSS
  includeBaseCSS: true, // Include basic styles

  // 🗜️ CSS purge settings (recommended for production)
  purge: {
    enabled: process.env.NODE_ENV === 'production', // Enable only in production

    // Files to purge (usually same as content)
    content: ['./src/**/*.{html,js,jsx,ts,tsx,vue,svelte}', './public/**/*.html'],

    // Classes to protect (not removed)
    safelist: [
      'dynamic-class-*',
      /^toast-/, // Classes dynamically added
    ],

    // Classes to exclude (forcefully removed)
    blocklist: [
      'unused-class',
      'debug-*',
      'm-2xs', // Margin too small to use
      'p-2xs', // Padding too small to use
      'gap-2xs', // Gap too small to use
      /^gap-x-2xs/,
      /^gap-y-2xs/,
    ],

    // Handling of @keyframes, @font-face, and CSS variables in CSS
    keyframes: true, // Keep @keyframes
    fontFace: true, // Keep @font-face
    variables: true, // Keep CSS variables

    // Custom extractor (for specific extensions)
    extractors: [
      {
        extensions: ['vue'],
        /**
         * @param {string} content
         * @returns {string[]}
         */
        extractor: (content) => {
          // Extract classes from Vue.js templates
          const classes = [];
          const classMatches = content.match(/class\s*=\s*["']([^"']*?)["']/g);
          if (classMatches) {
            classMatches.forEach((match) => {
              const classList = match.match(/["']([^"']*?)["']/);
              if (classList) {
                classes.push(...classList[1].split(/\s+/).filter(Boolean));
              }
            });
          }
          return classes;
        },
      },
    ],
  },

  // 🎨 Apply settings (define frequently used utility class combinations)
  // The theme feature has been deprecated. Use arbitrary value notation for custom values.
  apply: {
    // Layout components
    'main-layout': 'w-lg mx-auto px-lg block',
    container: 'max-w-7xl mx-auto ',
    section: 'py-xl md:py-2xl',

    // Card components
    card: 'bg-white shadow -lg p-6',
    'card-header': 'pb-sm mb-sm',
    'card-body': 'py-sm',
    'card-footer': 'pt-sm mt-sm',

    // Button components
    btn: ' font-medium',
    'btn-primary': 'bg-blue-500 text-white hover:bg-blue-600',
    'btn-secondary': 'bg-gray-200 text-gray-800 hover:bg-gray-300',

    // Form components
    'form-group': 'mb-md',
    'form-label': 'block mb-xs',
    'form-input': 'w-full px-sm py-xs',

    // Grid components
    'grid-container': 'grid grid-cols-12 gap-md',
    'grid-item': 'col-span-12',

    // Header and footer
    header: 'py-md',
    footer: 'py-lg mt-auto',

    // Example of custom components
    'hero-section': 'py-2xl md:py-3xl',
    'feature-box': 'p-lg',

    // Frequently used utility combinations
    'flex-center': 'flex justify-center items-center',
    'flex-between': 'flex justify-between items-center',
    'absolute-center': 'absolute',

    // Responsive components
    'responsive-grid': 'grid grid-cols-1 gap-md',
    'sidebar-layout': 'flex flex-col gap-lg',
  },

  // 🛠️ Developer options
  development: {
    // Disable purge during development to speed up build
    purge: { enabled: false },
    // Detailed log output
    verbose: true,

    // Enable validation
    enableValidation: true,

    // Show warnings
    showWarnings: true,

    // Show purge report
    showPurgeReport: process.env.NODE_ENV === 'production',
  },
};

// 🎯 Available scripts:
//
// yarn generate:utility <name>         - Generate a new utility class
// pnpm generate:utility <name>         - Generate a new utility class
// yarn validate:config                 - Check the validity of the config file
// pnpm validate:config                 - Check the validity of the config file
// yarn debug:classes                   - Show detailed info of generated CSS
// pnpm debug:classes                   - Show detailed info of generated CSS
//
// 💡 Example usage of Apply settings:
//
// With Apply settings, you can apply a frequently used utility class combination with a single class name:
//
// 🏗️ Layout:
// <div class="main-layout">            // w-lg mx-auto px-lg block will be applied
// <div class="container">              // Container settings will be applied
// <div class="flex-center">            // flex justify-center items-center will be applied
//
// 📦 Components:
// <div class="card">                   // p-md will be applied
// <button class="btn">                 // inline-block px-md py-sm will be applied
// <header class="header">              // py-md will be applied
//
// 💡 Using custom values:
// Custom values can be implemented using custom properties:
// <div class="m-[var(--custom-margin)]">    // Margin using CSS variable
