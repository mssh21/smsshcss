import { readFile, stat } from 'fs/promises';
import path from 'path';
import fastGlob from 'fast-glob';
import { PurgeConfig, PurgeReport } from './types';
import { debugPurger, logReport, logWarning, devHelpers } from '../utils/debug';

/**
 * Improved CSS Rule Parser
 * Handles complex CSS structures more robustly than simple brace counting
 */
export class CSSRuleParser {
  private css: string;
  private position: number = 0;
  private rules: Array<{ selector: string; content: string; startPos: number; endPos: number }> =
    [];

  constructor(css: string) {
    this.css = css;
  }

  parse(): Array<{ selector: string; content: string; startPos: number; endPos: number }> {
    this.position = 0;
    this.rules = [];

    while (this.position < this.css.length) {
      this.skipWhitespaceAndComments();

      if (this.position >= this.css.length) break;

      const rule = this.parseRule();
      if (rule) {
        this.rules.push(rule);
      }
    }

    return this.rules;
  }

  private skipWhitespaceAndComments(): void {
    let loopCount = 0;
    const maxLoops = 10000; // Prevent infinite loop

    while (this.position < this.css.length && loopCount < maxLoops) {
      const char = this.css[this.position];

      // Skip whitespace
      if (/\s/.test(char)) {
        this.position++;
        loopCount++;
        continue;
      }

      // Skip comments
      if (char === '/' && this.css[this.position + 1] === '*') {
        this.position += 2;
        let commentLoopCount = 0;
        while (this.position < this.css.length - 1 && commentLoopCount < maxLoops) {
          if (this.css[this.position] === '*' && this.css[this.position + 1] === '/') {
            this.position += 2;
            break;
          }
          this.position++;
          commentLoopCount++;
        }
        loopCount++;
        continue;
      }

      break;
    }
  }

  /**
   * Remove comments from CSS text while preserving string literals
   */
  private removeCommentsFromText(text: string): string {
    let result = '';
    let position = 0;
    let inString = false;
    let stringChar = '';
    let loopCount = 0;
    const maxLoops = text.length + 1000; // Prevent infinite loop

    while (position < text.length && loopCount < maxLoops) {
      const char = text[position];

      // Handle strings
      if (!inString && (char === '"' || char === "'")) {
        inString = true;
        stringChar = char;
        result += char;
      } else if (inString && char === stringChar && text[position - 1] !== '\\') {
        inString = false;
        stringChar = '';
        result += char;
      } else if (inString) {
        result += char;
      } else if (char === '/' && text[position + 1] === '*') {
        // Skip comment
        position += 2;
        let commentLoopCount = 0;
        while (position < text.length - 1 && commentLoopCount < maxLoops) {
          if (text[position] === '*' && text[position + 1] === '/') {
            position += 2;
            break;
          }
          position++;
          commentLoopCount++;
        }
        loopCount++;
        continue;
      } else {
        result += char;
      }

      position++;
      loopCount++;
    }

    return result;
  }

  private parseRule(): {
    selector: string;
    content: string;
    startPos: number;
    endPos: number;
  } | null {
    const startPos = this.position;

    // Find the opening brace
    let selectorEnd = this.position;
    let braceCount = 0;
    let inString = false;
    let stringChar = '';

    let selectorLoopCount = 0;
    const maxSelectorLoops = 10000;

    while (selectorEnd < this.css.length && selectorLoopCount < maxSelectorLoops) {
      const char = this.css[selectorEnd];

      // Handle strings
      if (!inString && (char === '"' || char === "'")) {
        inString = true;
        stringChar = char;
      } else if (inString && char === stringChar && this.css[selectorEnd - 1] !== '\\') {
        inString = false;
        stringChar = '';
      }

      if (!inString) {
        if (char === '{') {
          braceCount++;
          if (braceCount === 1) {
            break; // Found the opening brace
          }
        } else if (char === '}') {
          braceCount--;
        }
      }

      selectorEnd++;
      selectorLoopCount++;
    }

    if (selectorEnd >= this.css.length) {
      return null; // No opening brace found
    }

    const selector = this.css.substring(startPos, selectorEnd).trim();

    // Parse the content inside braces
    const contentStart = selectorEnd + 1;
    let contentEnd = contentStart;
    braceCount = 1;
    inString = false;
    stringChar = '';

    let contentLoopCount = 0;
    const maxContentLoops = 10000;

    while (contentEnd < this.css.length && braceCount > 0 && contentLoopCount < maxContentLoops) {
      const char = this.css[contentEnd];

      // Handle strings
      if (!inString && (char === '"' || char === "'")) {
        inString = true;
        stringChar = char;
      } else if (inString && char === stringChar && this.css[contentEnd - 1] !== '\\') {
        inString = false;
        stringChar = '';
      }

      if (!inString) {
        if (char === '{') {
          braceCount++;
        } else if (char === '}') {
          braceCount--;
        }
      }

      contentEnd++;
      contentLoopCount++;
    }

    if (braceCount > 0) {
      return null; // Unclosed braces
    }

    const rawContent = this.css.substring(contentStart, contentEnd - 1);
    const content = this.removeCommentsFromText(rawContent).trim();
    this.position = contentEnd;

    return {
      selector,
      content,
      startPos,
      endPos: contentEnd,
    };
  }
}

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

    debugPurger('CSSPurger initialized', { config: this.config });
  }

  /**
   * Analyze source files and extract class names
   */
  async analyzeSourceFiles(): Promise<
    Array<{ file: string; classesFound: string[]; size: number }>
  > {
    this.startTime = Date.now(); // Record processing start time

    if (!this.config.enabled) {
      debugPurger('Purging disabled, skipping analysis');
      return [];
    }

    try {
      const files = await fastGlob(this.config.content, {
        ignore: ['**/node_modules/**', '**/dist/**', '**/.git/**'],
      });

      debugPurger(`Found ${files.length} files to analyze`);

      // 並列処理でファイルを読み込み
      const filePromises = files.map(async (file) => {
        try {
          const [content, stats] = await Promise.all([readFile(file, 'utf-8'), stat(file)]);

          const classesFound = this.extractClassNames(content, file);
          const size = stats.size;

          // 使用されているクラス名を記録
          classesFound.forEach((className) => this.usedClasses.add(className));

          devHelpers.logClassExtraction(file, classesFound);

          return {
            file,
            classesFound,
            size,
          };
        } catch (error) {
          logWarning.fileProcessing(
            file,
            error instanceof Error ? error : new Error(String(error))
          );
          return null;
        }
      });

      const results = await Promise.all(filePromises);
      const validResults = results.filter(
        (result): result is NonNullable<typeof result> => result !== null
      );

      debugPurger(`Analysis complete: ${this.usedClasses.size} unique classes found`);
      return validResults;
    } catch (error) {
      debugPurger('Failed to analyze source files:', error);
      return [];
    }
  }

  /**
   * Improved class name extraction with better pattern matching
   */
  private extractClassNames(content: string, filePath: string): string[] {
    const classes: string[] = [];
    const extension = path.extname(filePath);

    // カスタムエクストラクターがある場合は使用
    const customExtractor = this.config.extractors?.find((extractor) =>
      extractor.extensions.includes(extension)
    );

    if (customExtractor) {
      debugPurger(`Using custom extractor for ${extension}`);
      return customExtractor.extractor(content);
    }

    // Improved extraction patterns with better handling of edge cases
    const extractionPatterns = [
      {
        name: 'HTML class attributes',
        pattern: /class\s*=\s*["']([^"']*?)["']/g,
        processor: (match: string): string[] => match.split(/\s+/).filter(Boolean),
      },
      {
        name: 'React className attributes',
        pattern: /className\s*=\s*["']([^"']*?)["']/g,
        processor: (match: string): string[] => match.split(/\s+/).filter(Boolean),
      },
      {
        name: 'Template literals with classes',
        pattern: /[`"']\s*([^`"']*?(?:class|className)[^`"']*?)\s*[`"']/g,
        processor: (match: string): string[] => {
          const classMatches = match.match(/\b[a-zA-Z][\w-]*(?:-\[([^\]]+)\])?\b/g) || [];
          return classMatches;
        },
      },
      {
        name: 'Template literal dynamic classes',
        pattern: /\$\{[^}]*?\?\s*["']([^"']+)["'][^}]*?\}/g,
        processor: (match: string, className: string): string[] => [className],
      },
      {
        name: 'Arbitrary value classes',
        pattern: /\b([mp][trlbxy]?|gap(?:-[xy])?|w|h|text|bg|border|)-\[([^\]]+)\]/g,
        processor: (match: string, prefix: string, value: string): string[] => [
          `${prefix}-[${value}]`,
        ],
      },
      {
        name: 'CSS-in-JS patterns',
        pattern: /(?:css|className|class)\s*[`"']\s*([^`"']+)\s*[`"']/g,
        processor: (match: string): string[] => {
          // Extract potential class names from CSS-in-JS
          const possibleClasses = match.match(/\b[a-zA-Z][\w-]*\b/g) || [];
          return possibleClasses.filter(
            (cls) =>
              // Filter out CSS properties and values
              ![
                'css',
                'className',
                'class',
                'px',
                'rem',
                'em',
                'auto',
                'none',
                'block',
                'inline',
              ].includes(cls)
          );
        },
      },
    ];

    for (const { name, pattern, processor } of extractionPatterns) {
      let match;
      let lastIndex = 0;
      let loopCount = 0;
      const maxLoops = 10000; // 無限ループ防止

      // Reset regex lastIndex to avoid issues with global patterns
      pattern.lastIndex = 0;

      while ((match = pattern.exec(content)) !== null && loopCount < maxLoops) {
        try {
          // 無限ループ防止: 同じ位置でマッチし続ける場合は中断
          if (pattern.lastIndex === lastIndex) {
            debugPurger(`Preventing infinite loop in ${name} extraction`);
            break;
          }
          lastIndex = pattern.lastIndex;

          const extracted = processor(match[1] || match[0], match[1], match[2]);
          classes.push(...extracted);

          debugPurger(`Extracted via ${name}: ${extracted.join(', ')}`);
        } catch (error) {
          debugPurger(`Error in ${name} extraction:`, error);
        }
        loopCount++;
      }

      // Reset regex lastIndex for next use
      pattern.lastIndex = 0;
    }

    // Remove duplicates and empty strings
    const uniqueClasses = [...new Set(classes.filter(Boolean))];
    debugPurger(`Total unique classes extracted from ${filePath}: ${uniqueClasses.length}`);

    return uniqueClasses;
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
   * CSSを解析して全てのクラス名を抽出 - Improved version
   */
  extractAllClasses(css: string): void {
    debugPurger('Extracting all classes from CSS');

    // Enhanced class extraction patterns
    const classPatterns = [
      {
        name: 'Standard classes',
        pattern: /\.([a-zA-Z][\w-]*)/g,
        processor: (match: RegExpExecArray): string => match[1],
      },
      {
        name: 'Arbitrary value classes',
        pattern: /\.([a-zA-Z][\w-]*)-\\?\[([^\]\\]+)\\?\]/g,
        processor: (match: RegExpExecArray): string => `${match[1]}-[${match[2]}]`,
      },
      {
        name: 'Escaped arbitrary values',
        pattern: /\.([a-zA-Z][\w-]*-\\[0-9a-fA-F]+\\])/g,
        processor: (match: RegExpExecArray): string => match[1].replace(/\\/g, ''),
      },
    ];

    for (const { name, pattern, processor } of classPatterns) {
      let match;
      let lastIndex = 0;
      let loopCount = 0;
      const maxLoops = 10000; // 無限ループ防止

      // Reset regex lastIndex to avoid issues with global patterns
      pattern.lastIndex = 0;

      while ((match = pattern.exec(css)) !== null && loopCount < maxLoops) {
        try {
          // 無限ループ防止: 同じ位置でマッチし続ける場合は中断
          if (pattern.lastIndex === lastIndex) {
            debugPurger(`Preventing infinite loop in ${name} class extraction`);
            break;
          }
          lastIndex = pattern.lastIndex;

          const className = processor(match);
          this.allClasses.add(className);
        } catch (error) {
          debugPurger(`Error processing ${name}:`, error);
        }
        loopCount++;
      }

      // Reset regex lastIndex for next use
      pattern.lastIndex = 0;
    }

    debugPurger(`Extracted ${this.allClasses.size} total classes from CSS`);
  }

  /**
   * 未使用のCSSクラスを削除 - Improved with robust CSS parsing
   */
  purgeCSS(css: string): string {
    if (!this.config.enabled) {
      debugPurger('Purging disabled, returning original CSS');
      return css;
    }

    debugPurger('Starting CSS purging process');
    this.extractAllClasses(css);

    // Use the improved CSS parser for more robust processing
    const parser = new CSSRuleParser(css);
    const rules = parser.parse();

    debugPurger(`Parsed ${rules.length} CSS rules`);

    const keptRules: string[] = [];
    let purgedCount = 0;

    for (const rule of rules) {
      if (this.shouldKeepRule(rule.selector + '{' + rule.content + '}')) {
        // Reconstruct the rule with proper formatting
        keptRules.push(`${rule.selector} {\n  ${rule.content.replace(/;\s*/g, ';\n  ')}\n}`);
      } else {
        purgedCount++;
        debugPurger(`Purged rule: ${rule.selector}`);
      }
    }

    // Handle any remaining CSS that wasn't parsed as rules (imports, etc.)
    const remainingCSS = this.extractNonRuleCSS(css, rules);

    const result = [...remainingCSS, ...keptRules].join('\n\n');

    debugPurger(
      `CSS purging complete: ${purgedCount} rules purged, ${keptRules.length} rules kept`
    );
    return result;
  }

  /**
   * Extract CSS that isn't part of rules (imports, comments, etc.)
   */
  private extractNonRuleCSS(
    css: string,
    parsedRules: Array<{ startPos: number; endPos: number }>
  ): string[] {
    const nonRuleCSS: string[] = [];
    let lastPos = 0;

    for (const rule of parsedRules.sort((a, b) => a.startPos - b.startPos)) {
      if (rule.startPos > lastPos) {
        const beforeRule = css.substring(lastPos, rule.startPos).trim();
        if (beforeRule) {
          nonRuleCSS.push(beforeRule);
        }
      }
      lastPos = rule.endPos;
    }

    // Handle any remaining CSS after the last rule
    if (lastPos < css.length) {
      const afterRules = css.substring(lastPos).trim();
      if (afterRules) {
        nonRuleCSS.push(afterRules);
      }
    }

    return nonRuleCSS.filter(Boolean);
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
   * パージレポートをコンソールに出力 - Enhanced with structured logging
   */
  printReport(report: PurgeReport): void {
    // テスト環境またはサイレントモードでは出力しない
    if (process.env.NODE_ENV === 'test' || process.env.SMSSHCSS_SILENT === 'true') {
      return;
    }

    // Use the new structured logging system
    const reductionPercentage =
      report.purgedClasses > 0
        ? parseFloat(((report.purgedClasses / report.totalClasses) * 100).toFixed(1))
        : undefined;

    logReport.purge({
      totalClasses: report.totalClasses,
      usedClasses: report.usedClasses,
      purgedClasses: report.purgedClasses,
      buildTime: report.buildTime,
      reductionPercentage,
    });

    // Additional detailed output for debug mode
    if (debugPurger.enabled) {
      debugPurger(`Safelist: ${report.safelist.length} items`);

      // File analysis details
      const maxFilesToShow = 10;
      const filesToShow = report.fileAnalysis.slice(0, maxFilesToShow);

      debugPurger('\nFile Analysis:');
      filesToShow.forEach((file) => {
        debugPurger(`  ${file.file}: ${file.classesFound.length} classes (${file.size} bytes)`);
      });

      if (report.fileAnalysis.length > maxFilesToShow) {
        debugPurger(`  ... and ${report.fileAnalysis.length - maxFilesToShow} more files`);
      }

      // Purged classes details
      if (report.purgedClassNames.length > 0 && report.purgedClassNames.length <= 20) {
        debugPurger('\nPurged classes:');
        report.purgedClassNames.forEach((className) => {
          debugPurger(`  - ${className}`);
        });
      } else if (report.purgedClassNames.length > 20) {
        debugPurger(`\nPurged classes (showing first 20 of ${report.purgedClassNames.length}):`);
        report.purgedClassNames.slice(0, 20).forEach((className) => {
          debugPurger(`  - ${className}`);
        });
      }
    }
  }
}
