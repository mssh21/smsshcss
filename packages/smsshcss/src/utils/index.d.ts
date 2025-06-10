export declare function getResetCss(): string;
export declare function getBaseCss(): string;
export declare function createUtilityClass(name: string, value: string): string;
export declare function createUtilityClasses(classes: Record<string, string>): string;
export declare function mergeUtilityClasses(...classes: string[]): string;
export declare function applyResetCss(css: string): string;
export declare function applyBaseCss(css: string): string;

// Utility class generators
export declare function generateDisplayClasses(config?: Record<string, string>): string;
export declare function generateAllSpacingClasses(config?: Record<string, string>): string;
export declare function generateFlexboxClasses(config?: Record<string, string>): string;
export declare function generatePositioningClasses(config?: Record<string, string>): string;
export declare function generateOverflowClasses(config?: Record<string, string>): string;
export declare function generateOrderClasses(config?: Record<string, string>): string;
export declare function generateGridClasses(config?: Record<string, string>): string;
export declare function generateAllGridClasses(
  config?:
    | Record<string, string>
    | {
        columns?: Record<string, string>;
        rows?: Record<string, string>;
        columnSpan?: Record<string, string>;
        rowSpan?: Record<string, string>;
        columnStart?: Record<string, string>;
        columnEnd?: Record<string, string>;
        rowStart?: Record<string, string>;
        rowEnd?: Record<string, string>;
        autoFlow?: Record<string, string>;
      }
): string;
export declare function generateAllWidthClasses(config?: Record<string, string>): string;
export declare function generateAllHeightClasses(config?: Record<string, string>): string;

// Custom class extractors
export declare function extractCustomSpacingClasses(content: string): string[];
export declare function extractCustomFlexClasses(content: string): string[];
export declare function extractCustomPositioningClasses(content: string): string[];
export declare function extractCustomOrderClasses(content: string): string[];
export declare function extractCustomGridClasses(content: string): string[];
export declare function extractCustomWidthClasses(content: string): string[];
export declare function extractCustomHeightClasses(content: string): string[];
