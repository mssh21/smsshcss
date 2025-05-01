/* global document */

/**
 * SmsshCSS Vite プレイグラウンドのメインエントリーポイント
 */

// スタイルをインポート
import './style.css';

// このファイルはViteによって処理され、htmlにリンクされます
// 一般的に、このファイルを通じてスタイルをインポートしたり、
// 動的な機能を追加したりします

console.log('SmsshCSS Vite プレイグラウンドが正常に読み込まれました');

// 動的にクラス操作のデモ
document.addEventListener('DOMContentLoaded', () => {
  // すべてのボタン要素を取得
  const buttons = document.querySelectorAll('button');

  // クリックイベントを追加
  buttons.forEach((button) => {
    button.addEventListener('click', (e) => {
      // ボタンのパディングサイズを切り替え
      if (e.target.classList.contains('p-sm')) {
        e.target.classList.remove('p-sm');
        e.target.classList.add('p-lg');
      } else {
        e.target.classList.remove('p-lg');
        e.target.classList.add('p-sm');
      }

      console.log('ボタンクリック: パディングサイズを切り替えました');
    });
  });
});
