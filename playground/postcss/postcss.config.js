/**
 * smsshcss PostCSS 設定ファイル
 */

module.exports = {
  plugins: [
    // @smsshcss/postcssプラグインを使用
    require('smsshcss-postcss')(),
    
    // 他のプラグイン
    require('autoprefixer')
  ]
}; 