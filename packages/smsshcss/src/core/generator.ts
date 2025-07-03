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
import { generateOverflowClasses } from '../utils/overflow';
import { generateFontSizeClasses, extractCustomFontSizeClasses } from '../utils/font-size';
import { validateConfig, formatValidationResult } from './config-validator';
import { CSSPurger } from './purger';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { generateApplyClasses } from '../utils';
import { debugGenerator, logWarning } from '../utils/debug';
import { promisify } from 'util';
import '../utils/apply-plugins';

const readFile = promisify(fs.readFile);

/**
 * CSS Generator Options
 */
export interface GeneratorOptions {
  /** Development mode (detailed logs and validation) */
  development?: boolean;
  /** Disable validation */
  skipValidation?: boolean;
  /** Suppress warnings */
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

    // Validate configuration if in development mode or explicitly specified
    if (!this.options.skipValidation) {
      this.validateConfiguration();
    }

    this.resetCSS = '';
    this.baseCSS = '';

    // Initialize purger if purge is explicitly enabled, or if purge settings exist and enabled is not false
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
   * Initialize CSS files asynchronously
   */
  private async initializeCSSFiles(): Promise<void> {
    const [resetCSS, baseCSS] = await Promise.all([this.loadResetCSS(), this.loadBaseCSS()]);

    this.resetCSS = resetCSS;
    this.baseCSS = baseCSS;
  }

  /**
   * Check configuration validity and output warnings or errors if there are issues
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

  private async loadResetCSS(): Promise<string> {
    // Try multiple path patterns
    const possiblePaths = this.getCSSFilePaths('reset.css');
    const errors: string[] = [];

    for (const filePath of possiblePaths) {
      try {
        if (fs.existsSync(filePath)) {
          const content = await readFile(filePath, 'utf-8');
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

  private async loadBaseCSS(): Promise<string> {
    // Try multiple path patterns
    const possiblePaths = this.getCSSFilePaths('base.css');
    const errors: string[] = [];

    for (const filePath of possiblePaths) {
      try {
        if (fs.existsSync(filePath)) {
          const content = await readFile(filePath, 'utf-8');
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
    // Directly specify absolute path from project root directory
    const absolutePathToStyles = path.join(process.cwd(), 'packages', 'smsshcss', 'src', 'styles');
    return [path.join(absolutePathToStyles, filename)];
  }

  public async generate(): Promise<GeneratedCSS> {
    // Initialize CSS files (if not already initialized)
    if (!this.resetCSS && !this.baseCSS) {
      await this.initializeCSSFiles();
    }

    console.log('[smsshcss] DEBUG: Starting CSS generation...');

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
      generateOverflowClasses(),
      generateFontSizeClasses(),
    ].join('\n\n');

    console.log('[smsshcss] DEBUG: Utilities CSS length:', utilities.length);
    console.log('[smsshcss] DEBUG: Utilities contains .flex:', utilities.includes('.flex'));
    console.log('[smsshcss] DEBUG: Utilities contains .h-screen:', utilities.includes('.h-screen'));

    let base = this.config.includeBaseCSS ? this.baseCSS : '';
    let reset = this.config.includeResetCSS ? this.resetCSS : '';

    // Dynamically extract and add custom classes
    const customClasses = await this.extractCustomClassesFromFiles(this.config.content);
    if (customClasses.length > 0) {
      utilities = `${utilities}\n\n/* Custom Value Classes */\n${customClasses.join('\n')}`;
    }

    // Generate apply classes
    const apply = generateApplyClasses(this.config.apply);
    console.log('[Generator] apply variable value:', JSON.stringify(apply));
    console.log('[Generator] apply variable length:', apply.length);

    // Execute purge processing
    if (this.purger) {
      console.log('[Generator] Before purge - apply length:', apply.length);
      console.log('[Generator] Before purge - apply value:', JSON.stringify(apply));

      const fileAnalysis = await this.purger.analyzeSourceFiles();

      // Purge each CSS section
      utilities = this.purger.purgeCSS(utilities);
      base = this.purger.purgeCSS(base);
      reset = this.purger.purgeCSS(reset);
      // Apply classes are explicitly defined classes in the configuration, so exclude from purge processing
      // apply = this.purger.purgeCSS(apply);

      console.log('[Generator] After purge - apply length:', apply.length);
      console.log('[Generator] After purge - apply value:', JSON.stringify(apply));

      // Generate and display report
      const report = this.purger.generateReport(fileAnalysis);
      this.purger.printReport(report);
    }

    const css = [
      '/* SmsshCSS Generated Styles */',
      reset,
      base,
      utilities,
      customClasses.length > 0 ? customClasses.join('\n') : undefined,
      apply ? `\n${apply}\n` : undefined,
    ]
      .filter(Boolean)
      .join('\n\n');

    console.log('[Generator] Final CSS array before join:', [
      '/* SmsshCSS Generated Styles */',
      reset ? 'reset' : 'no reset',
      base ? 'base' : 'no base',
      utilities ? 'utilities' : 'no utilities',
      customClasses.length > 0 ? 'customClasses' : 'no customClasses',
      apply ? 'apply' : 'no apply',
    ]);
    console.log('[Generator] apply variable truthy check:', !!apply);
    console.log('[Generator] apply variable type:', typeof apply);
    console.log('[Generator] apply variable === "":', apply === '');
    console.log('[smsshcss] DEBUG: Returning CSS (first 2000 chars):', css.substring(0, 2000));
    return {
      css,
      reset,
      base,
      utilities,
      custom: customClasses.join('\n'),
      apply,
    };
  }

  // Asynchronously extract custom classes from files
  private async extractCustomClassesFromFiles(content: string[]): Promise<string[]> {
    const allCustomClasses: string[] = [];
    const seenClasses = new Set<string>();
    const fileCache = new Map<string, string>(); // File content cache

    try {
      // Process file patterns together
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

      // Process files in parallel
      const filePromises = Array.from(allFiles).map(async (file) => {
        try {
          const filePath = path.resolve(process.cwd(), file);

          // Get from cache or read
          let fileContent: string;
          if (fileCache.has(filePath)) {
            fileContent = fileCache.get(filePath)!;
          } else {
            fileContent = await readFile(filePath, 'utf-8');
            fileCache.set(filePath, fileContent);
          }

          // Extract various custom classes (no Promise.resolve needed since these are synchronous functions)
          const [
            spacingClasses,
            widthClasses,
            heightClasses,
            gridClasses,
            flexClasses,
            zIndexClasses,
            orderClasses,
            colorClasses,
            fontSizeClasses,
          ] = [
            extractCustomSpacingClasses(fileContent),
            extractCustomWidthClasses(fileContent),
            extractCustomHeightClasses(fileContent),
            extractCustomGridClasses(fileContent),
            extractCustomFlexClasses(fileContent),
            extractCustomZIndexClasses(fileContent),
            extractCustomOrderClasses(fileContent),
            extractCustomColorClasses(fileContent),
            extractCustomFontSizeClasses(fileContent),
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
            ...fontSizeClasses,
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

      // Remove duplicates and merge results
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
    const { css } = await this.generate();
    return css;
  }

  /**
   * Generate purge report only (no CSS generation)
   */
  public async generatePurgeReport(): Promise<PurgeReport | null> {
    if (!this.purger) {
      return null;
    }

    // Initialize CSS files (if not already initialized)
    if (!this.resetCSS && !this.baseCSS) {
      await this.initializeCSSFiles();
    }

    // Set purger's startTime
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
      generateFontSizeClasses(),
    ].join('\n\n');

    // Generate apply classes
    const apply = generateApplyClasses(this.config.apply);

    // Combine all CSS and pass to purger
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
}
