import './style.css';

// SmsshCSS Vite Plugin のテスト用ファイル
console.log('🎨 SmsshCSS Vite Plugin - テスト環境起動中...');

// ヒーローヘッダーの統計情報を更新する関数
function updateHeroStats(): void {
  // SmsshCSSクラスの数を動的に計算
  const allElements = document.querySelectorAll('*');
  const smsshClasses = new Set<string>();

  allElements.forEach((element) => {
    const classes = Array.from(element.classList);
    classes.forEach((className) => {
      // SmsshCSSのパターンに一致するクラスを検出
      if (
        /^[mp][trblxy]?-/.test(className) || // margin/padding
        /^gap-/.test(className) || // gap
        /^w-/.test(className) || // width
        /^h-/.test(className) || // height
        /^flex/.test(className) || // flex
        /^grid/.test(className) || // grid
        /^(block|inline|hidden)$/.test(className) || // display
        className.includes('[') || // custom values
        /^(btn|card|heading|body-text|caption|form-|stack-|interactive|disabled|loading)/.test(
          className
        ) // apply classes
      ) {
        smsshClasses.add(className);
      }
    });
  });

  const classCountElement = document.getElementById('class-count');
  if (classCountElement) {
    classCountElement.textContent = `${smsshClasses.size}+`;
  }

  console.log(
    `%c📊 検出されたSmsshCSSクラス: ${smsshClasses.size}個`,
    'color: #2196F3; font-weight: bold;'
  );
  console.log('クラス一覧:', Array.from(smsshClasses).sort());
}

// DOM が読み込まれたらインタラクティブ要素を初期化
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM読み込み完了 - SmsshCSSクラスが適用されています');

  // テスト用のCSS変数を動的に設定
  document.documentElement.style.setProperty('--custom-padding-24', '24px');
  document.documentElement.style.setProperty('--custom-margin-16', '16px');
  document.documentElement.style.setProperty('--demo-size', '150px');

  // ヒーローヘッダーの統計情報を更新
  updateHeroStats();

  // ボタンのクリックイベント
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      console.log(`Button clicked: ${target.textContent}`);

      // 簡単なフィードバック
      target.style.transform = 'scale(0.95)';
      setTimeout(() => {
        target.style.transform = '';
      }, 150);
    });
  });

  // フォーカス可能な要素にインタラクションを追加
  const focusableElements = document.querySelectorAll('[tabindex]');
  focusableElements.forEach((element) => {
    element.addEventListener('focus', () => {
      console.log('Element focused - apply設定のfocus効果を確認');
    });
  });

  // デバッグ情報をコンソールに出力
  console.log('📊 SmsshCSS デバッグ情報:');
  console.log('- フィボナッチ数列ベースのSpacing');
  console.log('- 包括的なApply設定');
  console.log('- カスタム値サポート');
  console.log('- Grid/Flexboxユーティリティ');

  // CSS生成状況の確認
  const stylesheets = document.styleSheets;
  let smsshcssFound = false;

  for (let i = 0; i < stylesheets.length; i++) {
    try {
      const rules = stylesheets[i].cssRules;
      if (rules && rules.length > 0) {
        // SmsshCSSコメントを探す
        for (let j = 0; j < Math.min(10, rules.length); j++) {
          if (rules[j].cssText.includes('SmsshCSS')) {
            smsshcssFound = true;
            break;
          }
        }
      }
    } catch (e) {
      // CORS制限等でアクセスできない場合はスキップ
    }
  }

  if (smsshcssFound) {
    console.log('✅ SmsshCSS生成済みスタイルが検出されました');
  } else {
    console.log('⚠️ SmsshCSS生成済みスタイルが見つかりませんでした');
  }
});

// ページ読み込み完了時の統計情報
window.addEventListener('load', () => {
  console.log('🏁 ページ読み込み完了');

  // 使用されているSmsshCSSクラスを検出（簡易版）
  const allElements = document.querySelectorAll('*');
  const smsshcssClasses = new Set<string>();

  allElements.forEach((element) => {
    const classes = element.className.toString().split(' ');
    classes.forEach((cls) => {
      // SmsshCSSパターンを検出
      if (
        cls.match(/^(p|m|w|h|gap)-/) ||
        cls.match(/^(flex|grid|block|inline)/) ||
        cls.match(/^(btn|card|heading|body-text|caption)/) ||
        (cls.includes('[') && cls.includes(']'))
      ) {
        smsshcssClasses.add(cls);
      }
    });
  });

  console.log(`📈 検出されたSmsshCSSクラス数: ${smsshcssClasses.size}`);
  console.log('主要なクラス:', Array.from(smsshcssClasses).slice(0, 10));
});

// 開発者用のグローバル関数
(window as Record<string, unknown>).smsshcssDebug = {
  listAllClasses: (): string[] => {
    const allElements = document.querySelectorAll('*');
    const allClasses = new Set<string>();

    allElements.forEach((element) => {
      const classes = element.className.toString().split(' ');
      classes.forEach((cls) => {
        if (cls.trim()) allClasses.add(cls.trim());
      });
    });

    return Array.from(allClasses).sort();
  },

  findElementsWithClass: (className: string): NodeListOf<Element> => {
    return document.querySelectorAll(`.${className}`);
  },

  getApplyClasses: (): string[] => {
    return [
      'main-layout',
      'container',
      'section-spacing',
      'card',
      'card-header',
      'card-body',
      'card-footer',
      'btn',
      'btn-primary',
      'btn-secondary',
      'btn-danger',
      'flex-center',
      'flex-between',
      'flex-col-center',
      'grid-2-cols',
      'grid-3-cols',
      'grid-4-cols',
      'heading-1',
      'heading-2',
      'heading-3',
      'body-text',
      'caption',
      'form-group',
      'form-label',
      'form-input',
      'stack-sm',
      'stack-md',
      'stack-lg',
      'interactive',
      'disabled',
      'loading',
    ];
  },
};

console.log('🛠️ デバッグ用関数が利用可能です: window.smsshcssDebug');
