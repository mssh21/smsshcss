/**
 * smsshcss PostCSS 設定ファイル
 */

module.exports = {
  plugins: [
    // @smsshcss/postcssプラグインを使用
    require('@smsshcss/postcss')({
      // 設定ファイルのパスを指定（省略可能）
      // configFile: './smsshcss.config.js'
      
      // 以下の設定はsmsshcss.config.jsに移動しました
      // content, safelist, legacyMode
    }),
    
    // 他のプラグイン
    require('autoprefixer')
  ]
}; 