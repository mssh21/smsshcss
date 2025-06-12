import { SmsshCSSConfig, GeneratedCSS, PurgeReport } from './types';
import { generateAllSpacingClasses, extractCustomSpacingClasses } from '../utils/spacing';
import { generateDisplayClasses } from '../utils/display';
import { generateFlexboxClasses, extractCustomFlexClasses } from '../utils/flexbox';
import { generateAllWidthClasses, extractCustomWidthClasses } from '../utils/width';
import { generateAllHeightClasses, extractCustomHeightClasses } from '../utils/height';
import { generateAllGridClasses, extractCustomGridClasses } from '../utils/grid';
import { generateAllZIndexClasses, extractCustomZIndexClasses } from '../utils/z-index';
import { generateAllOrderClasses, extractCustomOrderClasses } from '../utils/order';
import { generateGridTemplateClasses } from '../utils/grid-template';
import { generateAllColorClasses, extractCustomColorClasses } from '../utils';
// import { generateComponentClasses } from '../utils/components';
import { validateConfig, formatValidationResult } from './config-validator';
import { CSSPurger } from './purger';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import { generateApplyClasses } from '../utils/apply';

// CJS環境での__dirnameの型宣言
declare const __dirname: string;

/**
 * CSS Generator のオプション
 */
export interface GeneratorOptions {
  /** 開発モード（詳細なログとバリデーション） */
  development?: boolean;
  /** バリデーションを無効にする */
  skipValidation?: boolean;
  /** 警告を表示しない */
  suppressWarnings?: boolean;
}

export class CSSGenerator {
  private config: SmsshCSSConfig;
  private options: GeneratorOptions;
  private resetCSS: string;
  private baseCSS: string;
  private purger?: CSSPurger;

  constructor(config: SmsshCSSConfig, options: GeneratorOptions = {}) {
    this.config = config;
    this.options = {
      development: process.env.NODE_ENV === 'development',
      skipValidation: false,
      suppressWarnings: false,
      ...options,
    };

    // 開発モードまたは明示的に指定された場合、設定をバリデーション
    if (!this.options.skipValidation) {
      this.validateConfiguration();
    }

    this.resetCSS = this.loadResetCSS();
    this.baseCSS = this.loadBaseCSS();

    // パージが明示的に有効な場合、またはパージ設定があってenabledがfalseでない場合はパージャーを初期化
    if (
      this.config.purge?.enabled === true ||
      (this.config.purge && this.config.purge.enabled !== false && this.config.purge.content)
    ) {
      this.purger = new CSSPurger({
        content: this.config.purge.content || this.config.content,
        safelist: this.config.safelist || [],
        ...this.config.purge,
      });
    }
  }

  /**
   * 設定の妥当性をチェックし、問題があれば警告またはエラーを出力
   */
  private validateConfiguration(): void {
    const result = validateConfig(this.config);

    if (!result.isValid || result.warnings.length > 0 || result.suggestions.length > 0) {
      if (this.options.development && !this.options.suppressWarnings) {
        console.log('\n📋 SmsshCSS Configuration Validation:');
        console.log(formatValidationResult(result));
      }

      if (!result.isValid) {
        const errorMessage = `SmsshCSS Configuration Error:\n${formatValidationResult(result)}`;
        throw new Error(errorMessage);
      }
    }
  }

  private loadResetCSS(): string {
    // 複数のパスパターンを試す
    const possiblePaths = this.getCSSFilePaths('reset.css');
    const errors: string[] = [];

    for (const filePath of possiblePaths) {
      try {
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf-8');
          if (this.options.development) {
            console.log(`✅ Loaded reset.css from: ${filePath}`);
          }
          return content;
        }
      } catch (error) {
        errors.push(`${filePath}: ${error instanceof Error ? error.message : String(error)}`);
        continue;
      }
    }

    if (this.options.development && !this.options.suppressWarnings) {
      if (errors.length > 0) {
        console.warn(`⚠️  Failed to load reset.css. Tried paths:\n${errors.join('\n')}`);
      } else {
        console.warn('⚠️  Failed to load reset.css, no valid paths found');
      }
    }
    return '';
  }

  private loadBaseCSS(): string {
    // 複数のパスパターンを試す
    const possiblePaths = this.getCSSFilePaths('base.css');
    const errors: string[] = [];

    for (const filePath of possiblePaths) {
      try {
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf-8');
          if (this.options.development) {
            console.log(`✅ Loaded base.css from: ${filePath}`);
          }
          return content;
        }
      } catch (error) {
        errors.push(`${filePath}: ${error instanceof Error ? error.message : String(error)}`);
        continue;
      }
    }

    if (this.options.development && !this.options.suppressWarnings) {
      if (errors.length > 0) {
        console.warn(`⚠️  Failed to load base.css. Tried paths:\n${errors.join('\n')}`);
      } else {
        console.warn('⚠️  Failed to load base.css, no valid paths found');
      }
    }
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
    let utilities = [
      generateAllSpacingClasses(),
      generateDisplayClasses(),
      generateFlexboxClasses(),
      generateAllWidthClasses(),
      generateAllHeightClasses(),
      generateAllGridClasses(),
      generateGridTemplateClasses(),
      generateAllZIndexClasses(),
      generateAllOrderClasses(),
      generateAllColorClasses(),
    ].join('\n\n');

    let base = this.config.includeBaseCSS ? this.baseCSS : '';
    let reset = this.config.includeResetCSS ? this.resetCSS : '';

    // カスタムクラスを動的に抽出して追加
    const customClasses = await this.extractCustomClassesFromFiles(this.config.content);
    if (customClasses.length > 0) {
      utilities = `${utilities}\n\n/* Custom Value Classes */\n${customClasses.join('\n')}`;
    }

    // applyクラスを生成
    let apply = generateApplyClasses(this.config.apply);

    // パージ処理を実行
    if (this.purger) {
      const fileAnalysis = await this.purger.analyzeSourceFiles();

      // 各CSSセクションをパージ
      utilities = this.purger.purgeCSS(utilities);
      base = this.purger.purgeCSS(base);
      reset = this.purger.purgeCSS(reset);
      apply = this.purger.purgeCSS(apply);

      // レポートを生成・表示
      const report = this.purger.generateReport(fileAnalysis);
      this.purger.printReport(report);
    }

    return {
      utilities,
      components: apply, // 後方互換性のため、componentsフィールドにapplyの内容を設定
      base,
      reset,
    };
  }

  // ファイルからカスタムクラスを非同期で抽出
  private async extractCustomClassesFromFiles(content: string[]): Promise<string[]> {
    const allCustomClasses: string[] = [];
    const seenClasses = new Set<string>();
    const fileCache = new Map<string, string>(); // ファイル内容のキャッシュ

    try {
      // ファイルパターンをまとめて処理
      const allFiles = new Set<string>();

      for (const pattern of content) {
        try {
          const files = glob.sync(pattern, {
            cwd: process.cwd(),
            ignore: ['node_modules/**', 'dist/**', 'build/**', '.git/**', '*.min.*'],
          });
          files.forEach((file) => allFiles.add(file));
        } catch (error) {
          if (this.options.development && !this.options.suppressWarnings) {
            console.warn(
              `Failed to glob pattern "${pattern}": ${error instanceof Error ? error.message : String(error)}`
            );
          }
        }
      }

      // ファイルを並列処理
      const filePromises = Array.from(allFiles).map(async (file) => {
        try {
          const filePath = path.resolve(process.cwd(), file);

          // キャッシュから取得または読み込み
          let fileContent: string;
          if (fileCache.has(filePath)) {
            fileContent = fileCache.get(filePath)!;
          } else {
            fileContent = fs.readFileSync(filePath, 'utf-8');
            fileCache.set(filePath, fileContent);
          }

          // 各種カスタムクラスを抽出
          const [spacingClasses, widthClasses, heightClasses] = await Promise.all([
            Promise.resolve(extractCustomSpacingClasses(fileContent)),
            Promise.resolve(extractCustomWidthClasses(fileContent)),
            Promise.resolve(extractCustomHeightClasses(fileContent)),
            Promise.resolve(extractCustomGridClasses(fileContent)),
            Promise.resolve(extractCustomFlexClasses(fileContent)),
            Promise.resolve(extractCustomZIndexClasses(fileContent)),
            Promise.resolve(extractCustomOrderClasses(fileContent)),
            Promise.resolve(extractCustomColorClasses(fileContent)),
          ]);

          return [
            ...spacingClasses,
            ...widthClasses,
            ...heightClasses,
            ...gridClasses,
            ...flexClasses,
            ...zIndexClasses,
            ...orderClasses,
            ...colorClasses,
          ];
        } catch (error) {
          if (this.options.development && !this.options.suppressWarnings) {
            console.warn(
              `Failed to process file "${file}": ${error instanceof Error ? error.message : String(error)}`
            );
          }
          return [];
        }
      });

      const results = await Promise.all(filePromises);

      // 重複を除去して結果をマージ
      for (const fileClasses of results) {
        for (const cssClass of fileClasses) {
          if (!seenClasses.has(cssClass)) {
            seenClasses.add(cssClass);
            allCustomClasses.push(cssClass);
          }
        }
      }
    } catch (error) {
      if (this.options.development) {
        console.error(
          `Error extracting custom classes: ${error instanceof Error ? error.message : String(error)}`
        );
      }
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

    const utilities = [
      generateAllSpacingClasses(),
      generateDisplayClasses(),
      generateFlexboxClasses(),
      generateAllWidthClasses(),
      generateAllHeightClasses(),
      generateAllGridClasses(),
      generateGridTemplateClasses(),
      generateAllZIndexClasses(),
      generateAllOrderClasses(),
      generateAllColorClasses(),
    ].join('\n\n');

    // applyクラスを生成
    const apply = generateApplyClasses(this.config.apply);

    // 全CSSを結合してパージャーに渡す
    const fullCSS = [
      this.config.includeResetCSS ? this.resetCSS : '',
      this.config.includeBaseCSS ? this.baseCSS : '',
      utilities,
      apply,
    ]
      .filter(Boolean)
      .join('\n\n');

    this.purger.extractAllClasses(fullCSS);
    return this.purger.generateReport(fileAnalysis);
  }

  // 後方互換性のため同期版も保持
  public generateFullCSSSync(): string {
    const utilities = [
      generateAllSpacingClasses(),
      generateDisplayClasses(),
      generateFlexboxClasses(),
      generateAllWidthClasses(),
      generateAllHeightClasses(),
      generateAllGridClasses(),
      generateGridTemplateClasses(),
      generateAllZIndexClasses(),
      generateAllOrderClasses(),
      generateAllColorClasses(),
    ].join('\n\n');

    // applyクラスを生成
    const apply = generateApplyClasses(this.config.apply);

    return [
      this.config.includeResetCSS ? this.resetCSS : '',
      this.config.includeBaseCSS ? this.baseCSS : '',
      utilities,
      apply,
    ]
      .filter(Boolean)
      .join('\n\n');
  }
}
