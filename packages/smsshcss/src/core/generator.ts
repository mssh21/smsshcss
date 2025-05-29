import { SmsshCSSConfig, GeneratedCSS, PurgeReport } from './types';
import { generateAllSpacingClasses, extractCustomClasses } from '../utils/spacing';
import { generateDisplayClasses } from '../utils/display';
import { generateFlexboxClasses } from '../utils/flexbox';
import { CSSPurger } from './purger';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

// CJS環境での__dirnameの型宣言
declare const __dirname: string;

export class CSSGenerator {
  private config: SmsshCSSConfig;
  private resetCSS: string;
  private baseCSS: string;
  private purger?: CSSPurger;

  constructor(config: SmsshCSSConfig) {
    this.config = config;
    this.resetCSS = this.loadResetCSS();
    this.baseCSS = this.loadBaseCSS();

    // パージ設定がある場合はパージャーを初期化
    if (this.config.purge?.enabled !== false) {
      this.purger = new CSSPurger({
        content: this.config.content,
        safelist: this.config.safelist || [],
        ...this.config.purge,
      });
    }
  }

  private loadResetCSS(): string {
    // 複数のパスパターンを試す
    const possiblePaths = this.getCSSFilePaths('reset.css');

    for (const filePath of possiblePaths) {
      try {
        if (fs.existsSync(filePath)) {
          return fs.readFileSync(filePath, 'utf-8');
        }
      } catch (error) {
        // 次のパスを試す
        continue;
      }
    }

    console.warn('Failed to load reset.css, using empty string');
    return '';
  }

  private loadBaseCSS(): string {
    // 複数のパスパターンを試す
    const possiblePaths = this.getCSSFilePaths('base.css');

    for (const filePath of possiblePaths) {
      try {
        if (fs.existsSync(filePath)) {
          return fs.readFileSync(filePath, 'utf-8');
        }
      } catch (error) {
        // 次のパスを試す
        continue;
      }
    }

    console.warn('Failed to load base.css, using empty string');
    return '';
  }

  private getCSSFilePaths(filename: string): string[] {
    const paths: string[] = [];

    // ESM/CJS互換の方法でディレクトリパスを取得
    let currentDir: string;

    try {
      // ESM環境の場合
      if (typeof import.meta !== 'undefined' && import.meta.url) {
        const __filename = fileURLToPath(import.meta.url);
        currentDir = path.dirname(__filename);
      } else {
        // CJS環境またはフォールバック
        currentDir =
          typeof __dirname !== 'undefined' ? __dirname : path.join(process.cwd(), 'dist');
      }
    } catch (error) {
      // フォールバック: 現在の作業ディレクトリから相対パスで解決
      currentDir = path.join(process.cwd(), 'dist');
    }

    // 様々なパスパターンを追加
    paths.push(
      // ビルド後のパス（同じディレクトリ）
      path.join(currentDir, filename),
      // 開発時のパス（stylesディレクトリ）
      path.join(currentDir, '../styles', filename),
      // srcディレクトリからの相対パス
      path.join(currentDir, '../../src/styles', filename),
      // プロジェクトルートからの相対パス
      path.join(process.cwd(), 'packages/smsshcss/src/styles', filename),
      // node_modulesからの相対パス
      path.join(process.cwd(), 'node_modules/smsshcss/dist', filename),
      path.join(process.cwd(), 'node_modules/smsshcss/src/styles', filename)
    );

    // __dirnameが利用可能な場合のみ追加
    if (typeof __dirname !== 'undefined') {
      paths.push(
        // テスト環境用のパス
        path.join(__dirname, '../styles', filename),
        path.join(__dirname, '../../styles', filename)
      );
    }

    return paths;
  }

  public async generate(): Promise<GeneratedCSS> {
    const spacingConfig = this.config.theme?.spacing;
    const displayConfig = this.config.theme?.display;
    const flexboxConfig = this.config.theme?.flexbox;

    let utilities = [
      generateAllSpacingClasses(spacingConfig),
      generateDisplayClasses(displayConfig),
      generateFlexboxClasses(flexboxConfig),
    ].join('\n\n');

    let base = this.config.includeBaseCSS ? this.baseCSS : '';
    let reset = this.config.includeResetCSS ? this.resetCSS : '';

    // カスタムクラスを動的に抽出して追加
    const customClasses = await this.extractCustomClassesFromFiles(this.config.content);
    if (customClasses.length > 0) {
      utilities = `${utilities}\n\n/* Custom Value Classes */\n${customClasses.join('\n')}`;
    }

    // パージ処理を実行
    if (this.purger) {
      const fileAnalysis = await this.purger.analyzeSourceFiles();

      // 各CSSセクションをパージ
      utilities = this.purger.purgeCSS(utilities);
      base = this.purger.purgeCSS(base);
      reset = this.purger.purgeCSS(reset);

      // レポートを生成・表示
      const report = this.purger.generateReport(fileAnalysis);
      this.purger.printReport(report);
    }

    return {
      utilities,
      components: '', // 必要に応じて実装
      base,
      reset,
    };
  }

  // ファイルからカスタムクラスを非同期で抽出
  private async extractCustomClassesFromFiles(content: string[]): Promise<string[]> {
    const allCustomClasses: string[] = [];
    const seenClasses = new Set<string>();

    try {
      for (const pattern of content) {
        try {
          const files = glob.sync(pattern, {
            cwd: process.cwd(),
            ignore: ['node_modules/**', 'dist/**', 'build/**'],
          });

          for (const file of files) {
            try {
              const filePath = path.resolve(process.cwd(), file);
              const fileContent = fs.readFileSync(filePath, 'utf-8');
              const fileCustomClasses = extractCustomClasses(fileContent);

              // スペーシングのカスタムクラスを追加
              for (const cssClass of fileCustomClasses) {
                if (!seenClasses.has(cssClass)) {
                  seenClasses.add(cssClass);
                  allCustomClasses.push(cssClass);
                }
              }
            } catch (error) {
              // ファイル読み込みエラーは無視
            }
          }
        } catch (error) {
          // globエラーは無視
        }
      }
    } catch (error) {
      console.warn('[smsshcss] Failed to scan files for custom classes:', error);
    }

    return allCustomClasses;
  }

  public async generateFullCSS(): Promise<string> {
    const { utilities, components, base, reset } = await this.generate();
    return [reset, base, utilities, components].filter(Boolean).join('\n\n');
  }

  /**
   * パージレポートのみを生成（CSS生成なし）
   */
  public async generatePurgeReport(): Promise<PurgeReport | null> {
    if (!this.purger) {
      return null;
    }

    // パージャーのstartTimeを設定
    (this.purger as { startTime: number }).startTime = Date.now();

    const fileAnalysis = await this.purger.analyzeSourceFiles();
    const spacingConfig = this.config.theme?.spacing;
    const displayConfig = this.config.theme?.display;
    const flexboxConfig = this.config.theme?.flexbox;

    const utilities = [
      generateAllSpacingClasses(spacingConfig),
      generateDisplayClasses(displayConfig),
      generateFlexboxClasses(flexboxConfig),
    ].join('\n\n');

    // 全CSSを結合してパージャーに渡す
    const fullCSS = [
      this.config.includeResetCSS ? this.resetCSS : '',
      this.config.includeBaseCSS ? this.baseCSS : '',
      utilities,
    ]
      .filter(Boolean)
      .join('\n\n');

    this.purger.extractAllClasses(fullCSS);
    return this.purger.generateReport(fileAnalysis);
  }

  // 後方互換性のため同期版も保持
  public generateFullCSSSync(): string {
    const spacingConfig = this.config.theme?.spacing;
    const displayConfig = this.config.theme?.display;
    const flexboxConfig = this.config.theme?.flexbox;

    const utilities = [
      generateAllSpacingClasses(spacingConfig),
      generateDisplayClasses(displayConfig),
      generateFlexboxClasses(flexboxConfig),
    ].join('\n\n');

    return [
      this.config.includeResetCSS ? this.resetCSS : '',
      this.config.includeBaseCSS ? this.baseCSS : '',
      utilities,
      '', // components
    ]
      .filter(Boolean)
      .join('\n\n');
  }
}
