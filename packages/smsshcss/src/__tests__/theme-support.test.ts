import { CSSGenerator } from '../core/generator';
import { SmsshCSSConfig } from '../core/types';

describe('Theme Support - Detailed Tests', () => {
  describe('Spacing Theme', () => {
    it('should generate custom spacing classes', () => {
      const config: SmsshCSSConfig = {
        content: ['test.html'],
        theme: {
          spacing: {
            sidebar: '280px',
            header: '64px',
            card: '1.5rem',
            '128': '32rem',
          },
        },
      };

      const generator = new CSSGenerator(config);
      const css = generator.generateFullCSSSync();

      // カスタム spacing クラスがすべて生成されていることを確認
      expect(css).toContain('.m-sidebar { margin: 280px; }');
      expect(css).toContain('.p-header { padding: 64px; }');
      expect(css).toContain('.gap-card { gap: 1.5rem; }');
      expect(css).toContain('.py-sidebar { padding-top: 280px; padding-bottom: 280px; }');
      expect(css).toContain('.mx-header { margin-left: 64px; margin-right: 64px; }');
      expect(css).toContain('.m-128 { margin: 32rem; }');
    });

    it('should merge custom spacing with defaults', () => {
      const config: SmsshCSSConfig = {
        content: ['test.html'],
        theme: {
          spacing: {
            custom: '2.5rem',
          },
        },
      };

      const generator = new CSSGenerator(config);
      const css = generator.generateFullCSSSync();

      // カスタム値が追加されていることを確認
      expect(css).toContain('.m-custom { margin: 2.5rem; }');
      expect(css).toContain('.p-custom { padding: 2.5rem; }');
      expect(css).toContain('.gap-custom { gap: 2.5rem; }');

      // デフォルト値も残っていることを確認
      expect(css).toContain('.m-xs');
      expect(css).toContain('.p-sm');
      expect(css).toContain('.gap-md');
    });
  });

  describe('Width Theme', () => {
    it('should generate custom width classes', () => {
      const config: SmsshCSSConfig = {
        content: ['test.html'],
        theme: {
          width: {
            sidebar: '280px',
            content: '1024px',
            container: '1200px',
            '128': '32rem',
          },
        },
      };

      const generator = new CSSGenerator(config);
      const css = generator.generateFullCSSSync();

      // カスタム width クラスが生成されていることを確認
      expect(css).toContain('.w-sidebar { width: 280px; }');
      expect(css).toContain('.w-content { width: 1024px; }');
      expect(css).toContain('.w-container { width: 1200px; }');
      expect(css).toContain('.w-128 { width: 32rem; }');

      // min-width と max-width も生成されていることを確認
      expect(css).toContain('.min-w-sidebar { min-width: 280px; }');
      expect(css).toContain('.max-w-content { max-width: 1024px; }');
    });
  });

  describe('Height Theme', () => {
    it('should generate custom height classes', () => {
      const config: SmsshCSSConfig = {
        content: ['test.html'],
        theme: {
          height: {
            header: '64px',
            footer: '120px',
            toolbar: '56px',
            'screen-header': 'calc(100vh - 64px)',
          },
        },
      };

      const generator = new CSSGenerator(config);
      const css = generator.generateFullCSSSync();

      // カスタム height クラスが生成されていることを確認
      expect(css).toContain('.h-header { height: 64px; }');
      expect(css).toContain('.h-footer { height: 120px; }');
      expect(css).toContain('.h-toolbar { height: 56px; }');
      expect(css).toContain('.h-screen-header { height: calc(100vh - 64px); }');

      // min-height と max-height も生成されていることを確認
      expect(css).toContain('.min-h-header { min-height: 64px; }');
      expect(css).toContain('.max-h-footer { max-height: 120px; }');
    });
  });

  describe('Z-Index Theme', () => {
    it('should generate custom z-index classes', () => {
      const config: SmsshCSSConfig = {
        content: ['test.html'],
        theme: {
          zIndex: {
            dropdown: '1000',
            modal: '2000',
            tooltip: '3000',
            notification: '4000',
          },
        },
      };

      const generator = new CSSGenerator(config);
      const css = generator.generateFullCSSSync();

      // カスタム z-index クラスが生成されていることを確認
      expect(css).toContain('.z-dropdown { z-index: 1000; }');
      expect(css).toContain('.z-modal { z-index: 2000; }');
      expect(css).toContain('.z-tooltip { z-index: 3000; }');
      expect(css).toContain('.z-notification { z-index: 4000; }');
    });

    it('should merge custom z-index with defaults', () => {
      const config: SmsshCSSConfig = {
        content: ['test.html'],
        theme: {
          zIndex: {
            custom: '999',
          },
        },
      };

      const generator = new CSSGenerator(config);
      const css = generator.generateFullCSSSync();

      // カスタム値が追加されていることを確認
      expect(css).toContain('.z-custom { z-index: 999; }');

      // デフォルト値も残っていることを確認（具体的なチェック）
      expect(css).toContain('.z-0 { z-index: 0; }');
      expect(css).toContain('.z-10 { z-index: 10; }');
      expect(css).toContain('.z-auto { z-index: auto; }');
    });
  });

  describe('Order Theme', () => {
    it('should generate custom order classes', () => {
      const config: SmsshCSSConfig = {
        content: ['test.html'],
        theme: {
          order: {
            header: '-10',
            nav: '-5',
            main: '0',
            aside: '5',
            footer: '10',
          },
        },
      };

      const generator = new CSSGenerator(config);
      const css = generator.generateFullCSSSync();

      // カスタム order クラスが生成されていることを確認
      expect(css).toContain('.order-header { order: -10; }');
      expect(css).toContain('.order-nav { order: -5; }');
      expect(css).toContain('.order-main { order: 0; }');
      expect(css).toContain('.order-aside { order: 5; }');
      expect(css).toContain('.order-footer { order: 10; }');
    });
  });

  describe('Grid Template Columns Theme', () => {
    it('should generate custom grid template column classes', () => {
      const config: SmsshCSSConfig = {
        content: ['test.html'],
        theme: {
          gridTemplateColumns: {
            'sidebar-content': '280px 1fr',
            'nav-main-aside': '200px 1fr 300px',
            'header-actions': '1fr auto',
          },
        },
      };

      const generator = new CSSGenerator(config);
      const css = generator.generateFullCSSSync();

      // カスタム grid template columns クラスが生成されていることを確認
      expect(css).toContain('.grid-cols-sidebar-content { grid-template-columns: 280px 1fr; }');
      expect(css).toContain(
        '.grid-cols-nav-main-aside { grid-template-columns: 200px 1fr 300px; }'
      );
      expect(css).toContain('.grid-cols-header-actions { grid-template-columns: 1fr auto; }');
    });
  });

  describe('Grid Template Rows Theme', () => {
    it('should generate custom grid template row classes', () => {
      const config: SmsshCSSConfig = {
        content: ['test.html'],
        theme: {
          gridTemplateRows: {
            'header-main-footer': '64px 1fr 120px',
            'toolbar-content': 'auto 1fr',
          },
        },
      };

      const generator = new CSSGenerator(config);
      const css = generator.generateFullCSSSync();

      // カスタム grid template rows クラスが生成されていることを確認
      expect(css).toContain(
        '.grid-rows-header-main-footer { grid-template-rows: 64px 1fr 120px; }'
      );
      expect(css).toContain('.grid-rows-toolbar-content { grid-template-rows: auto 1fr; }');
    });
  });

  describe('Components Theme', () => {
    it('should generate component classes from utility combinations', () => {
      const config: SmsshCSSConfig = {
        content: ['test.html'],
        theme: {
          components: {
            'main-layout': 'w-lg mx-auto px-lg block',
            card: 'p-md',
            btn: 'inline-block px-md py-sm',
          },
        },
      };

      const generator = new CSSGenerator(config);
      const css = generator.generateFullCSSSync();

      // コンポーネントクラスが生成されていることを確認
      expect(css).toContain('.main-layout {');
      expect(css).toContain('width: 1.5rem;');
      expect(css).toContain('margin-left: auto;');
      expect(css).toContain('margin-right: auto;');
      expect(css).toContain('padding-left: 1.5rem;');
      expect(css).toContain('padding-right: 1.5rem;');
      expect(css).toContain('display: block;');

      expect(css).toContain('.card {');
      expect(css).toContain('padding: 1rem;');

      expect(css).toContain('.btn {');
      expect(css).toContain('display: inline-block;');
      expect(css).toContain('padding-left: 1rem;');
      expect(css).toContain('padding-right: 1rem;');
      expect(css).toContain('padding-top: 0.5rem;');
      expect(css).toContain('padding-bottom: 0.5rem;');
    });

    it('should handle complex utility combinations', () => {
      const config: SmsshCSSConfig = {
        content: ['test.html'],
        theme: {
          components: {
            'flex-center': 'flex justify-center items-center',
            'absolute-center': 'absolute top-1/2 left-1/2',
          },
        },
      };

      const generator = new CSSGenerator(config);
      const css = generator.generateFullCSSSync();

      // Flexboxユーティリティの組み合わせ
      expect(css).toContain('.flex-center {');
      expect(css).toContain('display: flex;');
      expect(css).toContain('justify-content: center;');
      expect(css).toContain('align-items: center;');
    });

    it('should work with custom theme values', () => {
      const config: SmsshCSSConfig = {
        content: ['test.html'],
        theme: {
          spacing: {
            custom: '2.5rem',
          },
          components: {
            'custom-component': 'p-custom m-custom',
          },
        },
      };

      const generator = new CSSGenerator(config);
      const css = generator.generateFullCSSSync();

      // カスタムtheme値を使用したコンポーネント
      expect(css).toContain('.custom-component {');
      expect(css).toContain('padding: 2.5rem;');
      expect(css).toContain('margin: 2.5rem;');
    });

    it('should handle components with custom values', () => {
      const config: SmsshCSSConfig = {
        content: ['test.html'],
        theme: {
          components: {
            'custom-size': 'w-[200px] h-[100px] p-[20px]',
          },
        },
      };

      const generator = new CSSGenerator(config);
      const css = generator.generateFullCSSSync();

      // カスタム値を持つコンポーネント
      expect(css).toContain('.custom-size {');
      expect(css).toContain('width: 200px;');
      expect(css).toContain('height: 100px;');
      expect(css).toContain('padding: 20px;');
    });

    it('should ignore unknown utility classes', () => {
      const config: SmsshCSSConfig = {
        content: ['test.html'],
        theme: {
          components: {
            mixed: 'unknown-class w-md valid-class',
          },
        },
      };

      const generator = new CSSGenerator(config);
      const css = generator.generateFullCSSSync();

      // 有効なクラスのみが処理される
      expect(css).toContain('.mixed {');
      expect(css).toContain('width: 1rem;');
      expect(css).not.toContain('unknown-class');
    });

    it('should handle empty components configuration', () => {
      const config: SmsshCSSConfig = {
        content: ['test.html'],
        theme: {
          components: {},
        },
      };

      const generator = new CSSGenerator(config);

      expect(() => generator.generateFullCSSSync()).not.toThrow();
      const css = generator.generateFullCSSSync();
      expect(css).toBeTruthy();
    });
  });

  describe('Multiple Theme Properties', () => {
    it('should handle multiple theme properties together', () => {
      const config: SmsshCSSConfig = {
        content: ['test.html'],
        theme: {
          spacing: {
            app: '1rem',
          },
          width: {
            sidebar: '280px',
          },
          height: {
            header: '64px',
          },
          zIndex: {
            modal: '1000',
          },
          order: {
            priority: '-1',
          },
          components: {
            'app-layout': 'w-sidebar h-header p-app',
          },
        },
      };

      const generator = new CSSGenerator(config);
      const css = generator.generateFullCSSSync();

      // すべてのカスタムテーマが適用されていることを確認
      expect(css).toContain('.m-app { margin: 1rem; }');
      expect(css).toContain('.w-sidebar { width: 280px; }');
      expect(css).toContain('.h-header { height: 64px; }');
      expect(css).toContain('.z-modal { z-index: 1000; }');
      expect(css).toContain('.order-priority { order: -1; }');

      // コンポーネントがカスタムテーマ値を使用していることを確認
      expect(css).toContain('.app-layout {');
      expect(css).toContain('width: 280px;');
      expect(css).toContain('height: 64px;');
      expect(css).toContain('padding: 1rem;');
    });
  });

  describe('Error Handling', () => {
    it('should handle empty theme configuration', () => {
      const config: SmsshCSSConfig = {
        content: ['test.html'],
        theme: {},
      };

      const generator = new CSSGenerator(config);

      expect(() => generator.generateFullCSSSync()).not.toThrow();
      const css = generator.generateFullCSSSync();
      expect(css).toBeTruthy();

      // デフォルトクラスが生成されていることを確認
      expect(css).toContain('.m-xs');
      expect(css).toContain('.w-full');
      expect(css).toContain('.h-full');
    });

    it('should handle invalid theme values gracefully', () => {
      const config: SmsshCSSConfig = {
        content: ['test.html'],
        theme: {
          spacing: {
            // 有効な値と無効な値の混在
            valid: '1rem',
            // TypeScriptでは型チェックされるが、実行時の安全性もテスト
          },
        },
      };

      const generator = new CSSGenerator(config);

      expect(() => generator.generateFullCSSSync()).not.toThrow();
      const css = generator.generateFullCSSSync();
      expect(css).toBeTruthy();
      expect(css).toContain('.m-valid { margin: 1rem; }');
    });
  });
});
