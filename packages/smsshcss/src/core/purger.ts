import fs from 'fs';
import path from 'path';
import fastGlob from 'fast-glob';
import { PurgeConfig, PurgeReport } from './types';

export class CSSPurger {
  private config: PurgeConfig;
  private usedClasses: Set<string> = new Set();
  private allClasses: Set<string> = new Set();
  private startTime: number = 0;

  constructor(config: PurgeConfig) {
    this.config = {
      enabled: true,
      keyframes: true,
      fontFace: true,
      variables: true,
      ...config,
    };
  }

  /**
   * ソースファイルを解析してクラス名を抽出
   */
  async analyzeSourceFiles(): Promise<
    Array<{ file: string; classesFound: string[]; size: number }>
  > {
    this.startTime = Date.now(); // 処理開始時間を記録

    if (!this.config.enabled) {
      return [];
    }

    try {
      const files = await fastGlob(this.config.content, {
        ignore: ['**/node_modules/**', '**/dist/**', '**/.git/**'],
      });

      const results: Array<{ file: string; classesFound: string[]; size: number }> = [];

      for (const file of files) {
        try {
          const content = fs.readFileSync(file, 'utf-8');
          const classesFound = this.extractClassNames(content, file);
          const size = fs.statSync(file).size;

          // 使用されているクラス名を記録
          classesFound.forEach((className) => this.usedClasses.add(className));

          results.push({
            file,
            classesFound,
            size,
          });
        } catch (error) {
          console.warn(`Failed to process file ${file}:`, error);
        }
      }

      return results;
    } catch (error) {
      console.warn('Failed to analyze source files:', error);
      return [];
    }
  }

  /**
   * ファイル内容からクラス名を抽出
   */
  private extractClassNames(content: string, filePath: string): string[] {
    const classes: string[] = [];
    const extension = path.extname(filePath);

    // カスタムエクストラクターがある場合は使用
    const customExtractor = this.config.extractors?.find((extractor) =>
      extractor.extensions.includes(extension)
    );

    if (customExtractor) {
      return customExtractor.extractor(content);
    }

    // デフォルトのクラス名抽出パターン
    const patterns = [
      // HTML class属性
      /class\s*=\s*["']([^"']*?)["']/g,
      /className\s*=\s*["']([^"']*?)["']/g,
      // CSS-in-JS パターン
      /css\s*`[^`]*?\.([a-zA-Z][\w-]*)/g,
      // Tailwind風のクラス名（通常のクラス名）
      /['"]\s*([a-zA-Z][\w-]*(?:\s+[a-zA-Z][\w-]*)*)\s*['"]/g,
      // カスタム値クラス（任意の値）- [...]形式
      /\b([mp][trlbxy]?|gap(?:-[xy])?)-\[([^\]]+)\]/g,
      // 動的クラス名パターン
      /\$\{[^}]*\}/g,
    ];

    patterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        if (match[1]) {
          // カスタム値クラスの場合は特別処理
          if (pattern.source.includes('\\[')) {
            // カスタム値クラス全体をクラス名として追加
            const fullClassName = `${match[1]}-[${match[2]}]`;
            classes.push(fullClassName);
          } else {
            // スペースで区切られたクラス名を分割
            const classNames = match[1].split(/\s+/).filter(Boolean);
            classes.push(...classNames);
          }
        }
      }
    });

    return [...new Set(classes)];
  }

  /**
   * セーフリストのクラス名をチェック
   */
  private isInSafelist(className: string): boolean {
    if (!this.config.safelist) return false;

    return this.config.safelist.some((item) => {
      if (typeof item === 'string') {
        return className === item;
      } else if (item instanceof RegExp) {
        return item.test(className);
      }
      return false;
    });
  }

  /**
   * ブロックリストのクラス名をチェック
   */
  private isInBlocklist(className: string): boolean {
    if (!this.config.blocklist) return false;

    return this.config.blocklist.some((item) => {
      if (typeof item === 'string') {
        return className === item;
      } else if (item instanceof RegExp) {
        return item.test(className);
      }
      return false;
    });
  }

  /**
   * CSSを解析して全てのクラス名を抽出
   */
  extractAllClasses(css: string): void {
    // 通常のクラス名パターン
    const classPattern = /\.([a-zA-Z][\w-]*)/g;
    // カスタム値クラスパターン（エスケープされた文字を含む）
    const customClassPattern = /\.([mp][trlbxy]?|gap(?:-[xy])?)-\\?\[([^\]\\]+)\\?\]/g;

    let match;

    // 通常のクラス名を抽出
    while ((match = classPattern.exec(css)) !== null) {
      this.allClasses.add(match[1]);
    }

    // カスタム値クラスを抽出
    while ((match = customClassPattern.exec(css)) !== null) {
      const fullClassName = `${match[1]}-[${match[2]}]`;
      this.allClasses.add(fullClassName);
    }
  }

  /**
   * 未使用のCSSクラスを削除
   */
  purgeCSS(css: string): string {
    if (!this.config.enabled) {
      return css;
    }

    this.extractAllClasses(css);

    // CSSルールを行ごとに処理
    const lines = css.split('\n');
    const purgedLines: string[] = [];
    let currentRule = '';
    let inRule = false;
    let braceCount = 0;

    for (const line of lines) {
      const trimmedLine = line.trim();

      // 空行やコメントはそのまま保持
      if (!trimmedLine || trimmedLine.startsWith('/*') || trimmedLine.startsWith('//')) {
        purgedLines.push(line);
        continue;
      }

      currentRule += line + '\n';

      // 波括弧の数をカウント
      braceCount += (line.match(/{/g) || []).length;
      braceCount -= (line.match(/}/g) || []).length;

      if (trimmedLine.includes('{')) {
        inRule = true;
      }

      if (inRule && braceCount === 0) {
        // ルールの終了
        if (this.shouldKeepRule(currentRule)) {
          purgedLines.push(...currentRule.split('\n').slice(0, -1));
        }
        currentRule = '';
        inRule = false;
      } else if (!inRule) {
        // ルール外の行（@import, @media等）
        purgedLines.push(line);
        currentRule = '';
      }
    }

    return purgedLines.join('\n');
  }

  /**
   * CSSルールを保持すべきかどうかを判定
   */
  private shouldKeepRule(rule: string): boolean {
    // @ルール（@media, @keyframes等）は保持
    if (rule.trim().startsWith('@')) {
      if (rule.includes('@keyframes') && !this.config.keyframes) {
        return false;
      }
      if (rule.includes('@font-face') && !this.config.fontFace) {
        return false;
      }
      return true;
    }

    // CSS変数は設定に応じて保持
    if (rule.includes('--') && !this.config.variables) {
      return false;
    }

    // クラスセレクターをチェック
    const classMatches = rule.match(/\.([a-zA-Z][\w-]*)/g);
    if (!classMatches) {
      return true; // クラスセレクターでない場合は保持
    }

    return classMatches.some((classSelector) => {
      const className = classSelector.substring(1); // '.'を除去

      // ブロックリストにある場合は除去
      if (this.isInBlocklist(className)) {
        return false;
      }

      // セーフリストにある場合は保持
      if (this.isInSafelist(className)) {
        return true;
      }

      // 使用されている場合は保持
      return this.usedClasses.has(className);
    });
  }

  /**
   * パージレポートを生成
   */
  generateReport(
    fileAnalysis: Array<{ file: string; classesFound: string[]; size: number }>
  ): PurgeReport {
    const purgedClasses = Array.from(this.allClasses).filter(
      (className) => !this.usedClasses.has(className) && !this.isInSafelist(className)
    );

    const safelist = this.config.safelist
      ? this.config.safelist
          .filter((item) => typeof item === 'string')
          .map((item) => item as string)
      : [];

    // buildTimeの計算を修正
    const buildTime = this.startTime > 0 ? Date.now() - this.startTime : 1;

    return {
      totalClasses: this.allClasses.size,
      usedClasses: this.usedClasses.size,
      purgedClasses: purgedClasses.length,
      purgedClassNames: purgedClasses,
      safelist,
      buildTime,
      fileAnalysis,
    };
  }

  /**
   * パージレポートをコンソールに出力
   */
  printReport(report: PurgeReport): void {
    console.log('\n🎯 CSS Purge Report');
    console.log('==================');
    console.log(`📊 Total classes: ${report.totalClasses}`);
    console.log(`✅ Used classes: ${report.usedClasses}`);
    console.log(`🗑️  Purged classes: ${report.purgedClasses}`);
    console.log(`⏱️  Build time: ${report.buildTime}ms`);
    console.log(`🛡️  Safelist: ${report.safelist.length} items`);

    if (report.purgedClasses > 0) {
      const reductionPercentage = ((report.purgedClasses / report.totalClasses) * 100).toFixed(1);
      console.log(`📉 Size reduction: ${reductionPercentage}%`);
    }

    console.log('\n📁 File Analysis:');
    report.fileAnalysis.forEach((file) => {
      console.log(`  ${file.file}: ${file.classesFound.length} classes (${file.size} bytes)`);
    });

    if (report.purgedClassNames.length > 0 && report.purgedClassNames.length <= 20) {
      console.log('\n🗑️  Purged classes:');
      report.purgedClassNames.forEach((className) => {
        console.log(`  - ${className}`);
      });
    } else if (report.purgedClassNames.length > 20) {
      console.log(`\n🗑️  Purged classes (showing first 20 of ${report.purgedClassNames.length}):`);
      report.purgedClassNames.slice(0, 20).forEach((className) => {
        console.log(`  - ${className}`);
      });
    }
  }
}
