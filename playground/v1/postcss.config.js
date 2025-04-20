/**
 * smsshcss PostCSS 設定ファイル
 */

module.exports = {
  plugins: [
    // @smsshcss/postcssプラグインを使用
    require('@smsshcss/postcss')({
      // スキャン対象のファイル
      content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
      ],
      // 常に含めるクラス
      safelist: [
        'flex', 'items-center', 'justify-between', 'grow'
      ]
    }),
    
    // 他のプラグイン
    require('autoprefixer')
  ]
}; 