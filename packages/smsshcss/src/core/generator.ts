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
import { generatePositioningClasses } from '../utils/positioning';
// import { generateComponentClasses } from '../utils/components';
import { validateConfig, formatValidationResult } from './config-validator';
import { CSSPurger } from './purger';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import { generateApplyClasses } from '../utils/apply';
import { debugGenerator, logWarning, performanceTiming, devHelpers } from '../utils/debug';

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
    debugGenerator('CSSGenerator constructor called');
    debugGenerator('Config:', JSON.stringify(config, null, 2));

    this.config = config;
    this.options = {
      development: process.env.NODE_ENV === 'development',
      skipValidation: false,
      suppressWarnings: false,
      ...options,
    };

    debugGenerator('Options merged:', JSON.stringify(this.options, null, 2));

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
        const formatted = formatValidationResult(result);
        debugGenerator('Configuration validation result:', formatted);
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
          debugGenerator(`Loaded reset.css from: ${filePath}`);
          return content;
        }
      } catch (error) {
        errors.push(`${filePath}: ${error instanceof Error ? error.message : String(error)}`);
        continue;
      }
    }

    if (this.options.development && !this.options.suppressWarnings) {
      if (errors.length > 0) {
        debugGenerator(`Failed to load reset.css. Tried paths:\n${errors.join('\n')}`);
      } else {
        debugGenerator('Failed to load reset.css, no valid paths found');
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
          debugGenerator(`Loaded base.css from: ${filePath}`);
          return content;
        }
      } catch (error) {
        errors.push(`${filePath}: ${error instanceof Error ? error.message : String(error)}`);
        continue;
      }
    }

    if (this.options.development && !this.options.suppressWarnings) {
      if (errors.length > 0) {
        debugGenerator(`Failed to load base.css. Tried paths:\n${errors.join('\n')}`);
      } else {
        debugGenerator('Failed to load base.css, no valid paths found');
      }
    }
    return '';
  }

  private getCSSFilePaths(filename: string): string[] {
    const paths: string[] = [];

    // ESMファーストのパス解決
    let currentDir: string;

    try {
      // import.meta.urlを使用してESM環境でパスを解決
      if (typeof import.meta !== 'undefined' && import.meta.url) {
        const currentFile = fileURLToPath(import.meta.url);
        currentDir = path.dirname(currentFile);
      } else {
        // フォールバック: プロセスの作業ディレクトリを基準
        currentDir = path.join(process.cwd(), 'dist');
      }
    } catch (error) {
      // 最終フォールバック
      currentDir = path.join(process.cwd(), 'dist');
    }

    // 様々なパスパターンを追加（ESMベース）
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
      path.join(process.cwd(), 'node_modules/smsshcss/src/styles', filename),
      // 追加のフォールバックパス
      path.join(process.cwd(), 'src/styles', filename),
      path.join(process.cwd(), 'styles', filename)
    );

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
      generatePositioningClasses(),
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
            logWarning.fileProcessing(
              pattern,
              error instanceof Error ? error : new Error(String(error))
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

          // 各種カスタムクラスを抽出（同期関数なのでPromise.resolveは不要）
          const [
            spacingClasses,
            widthClasses,
            heightClasses,
            gridClasses,
            flexClasses,
            zIndexClasses,
            orderClasses,
            colorClasses,
          ] = [
            extractCustomSpacingClasses(fileContent),
            extractCustomWidthClasses(fileContent),
            extractCustomHeightClasses(fileContent),
            extractCustomGridClasses(fileContent),
            extractCustomFlexClasses(fileContent),
            extractCustomZIndexClasses(fileContent),
            extractCustomOrderClasses(fileContent),
            extractCustomColorClasses(fileContent),
          ];

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
            logWarning.fileProcessing(
              file,
              error instanceof Error ? error : new Error(String(error))
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
        debugGenerator(
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
      generatePositioningClasses(),
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

  /**
   * 同期版CSS生成（非推奨）
   * @deprecated この関数は非推奨です。generateFullCSS()を使用してください。
   * 同期版では以下の問題があります：
   * - ファイルからのカスタムクラス抽出が実行されない
   * - 大規模なファイル群でブロッキングを引き起こす可能性
   * - 将来のバージョンで削除される予定
   * この関数は将来のバージョンで削除される予定です。
   */
  public generateFullCSSSync(): string {
    // 強化された非推奨警告
    logWarning.deprecation(
      'generateFullCSSSync()',
      'generateFullCSS()',
      'https://github.com/mssh21/smsshcss/docs/migration-guide.md'
    );

    // パフォーマンス警告
    logWarning.performance(
      'generateFullCSSSync() は同期処理のため、大規模なプロジェクトではブロッキングが発生する可能性があります',
      { method: 'generateFullCSSSync', fileCount: this.config.content?.length || 0 }
    );

    performanceTiming.start('generateFullCSSSync');

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
      generatePositioningClasses(),
    ].join('\n\n');

    // applyクラスを生成
    const apply = generateApplyClasses(this.config.apply);
    debugGenerator('Apply config:', this.config.apply);
    debugGenerator('Generated apply CSS length:', apply.length);

    const result = [
      this.config.includeResetCSS ? this.resetCSS : '',
      this.config.includeBaseCSS ? this.baseCSS : '',
      utilities,
      apply,
    ]
      .filter(Boolean)
      .join('\n\n');

    const sections = result.split('\n\n').filter((s) => s);
    debugGenerator('Total CSS sections:', sections.length);
    devHelpers.logGeneratedSections(sections);

    performanceTiming.end('generateFullCSSSync');

    return result;
  }
}
