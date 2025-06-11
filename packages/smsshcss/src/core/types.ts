// 共通のサイズ設定インターフェース
export interface SizeConfig {
  none: string;
  '2xs': string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
  '6xl': string;
  '7xl': string;
  '8xl': string;
  '9xl': string;
  '10xl': string;
  '11xl': string;
  '12xl': string;
  full: string;
  auto: string;
  fit: string;
  min: string;
  max: string;
  screen: string;
  dvh: string;
  dvw: string;
  cqw: string;
  cqi: string;
  cqmin: string;
  cqmax: string;
  [key: string]: string | undefined;
}

// SpacingConfigをSizeConfigのエイリアスとして定義（後方互換性のため）
export interface SpacingConfig extends SizeConfig {}

// WidthConfigをSizeConfigのエイリアスとして定義（後方互換性のため）
export interface WidthConfig extends SizeConfig {}

// HeightConfig用のインターフェース
export interface HeightConfig extends SizeConfig {
  svh?: string; // スモールビューポートハイト
  lvh?: string; // ラージビューポートハイト
  dh?: string; // 動的ハイト（将来の仕様）
}

export interface PurgeConfig {
  enabled?: boolean;
  content: string[];
  safelist?: (string | RegExp)[];
  blocklist?: (string | RegExp)[];
  keyframes?: boolean;
  fontFace?: boolean;
  variables?: boolean;
  extractors?: Array<{
    extensions: string[];
    extractor: (content: string) => string[];
  }>;
}

export interface PurgeReport {
  totalClasses: number;
  usedClasses: number;
  purgedClasses: number;
  purgedClassNames: string[];
  safelist: string[];
  buildTime: number;
  fileAnalysis: Array<{
    file: string;
    classesFound: string[];
    size: number;
  }>;
}

// Grid Template Columns
export interface GridColumnsConfig {
  'grid-cols-1'?: string;
  'grid-cols-2'?: string;
  'grid-cols-3'?: string;
  'grid-cols-4'?: string;
  'grid-cols-5'?: string;
  'grid-cols-6'?: string;
  'grid-cols-7'?: string;
  'grid-cols-8'?: string;
  'grid-cols-9'?: string;
  'grid-cols-10'?: string;
  'grid-cols-11'?: string;
  'grid-cols-12'?: string;
  'grid-cols-none'?: string;
  'grid-cols-subgrid'?: string;
}

// Grid Template Rows
export interface GridRowsConfig {
  'grid-rows-1'?: string;
  'grid-rows-2'?: string;
  'grid-rows-3'?: string;
  'grid-rows-4'?: string;
  'grid-rows-5'?: string;
  'grid-rows-6'?: string;
  'grid-rows-7'?: string;
  'grid-rows-8'?: string;
  'grid-rows-9'?: string;
  'grid-rows-10'?: string;
  'grid-rows-11'?: string;
  'grid-rows-12'?: string;
  'grid-rows-none'?: string;
  'grid-rows-subgrid'?: string;
}

// Grid Column Span
export interface ColumnSpanConfig {
  'col-span-1'?: string;
  'col-span-2'?: string;
  'col-span-3'?: string;
  'col-span-4'?: string;
  'col-span-5'?: string;
  'col-span-6'?: string;
  'col-span-7'?: string;
  'col-span-8'?: string;
  'col-span-9'?: string;
  'col-span-10'?: string;
  'col-span-11'?: string;
  'col-span-12'?: string;
  'col-span-full'?: string;
}

// Grid Row Span
export interface RowSpanConfig {
  'row-span-1'?: string;
  'row-span-2'?: string;
  'row-span-3'?: string;
  'row-span-4'?: string;
  'row-span-5'?: string;
  'row-span-6'?: string;
  'row-span-7'?: string;
  'row-span-8'?: string;
  'row-span-9'?: string;
  'row-span-10'?: string;
  'row-span-11'?: string;
  'row-span-12'?: string;
  'row-span-full'?: string;
}

// Grid Column Start/End
export interface ColumnPositionConfig {
  'col-start-1'?: string;
  'col-start-2'?: string;
  'col-start-3'?: string;
  'col-start-4'?: string;
  'col-start-5'?: string;
  'col-start-6'?: string;
  'col-start-7'?: string;
  'col-start-8'?: string;
  'col-start-9'?: string;
  'col-start-10'?: string;
  'col-start-11'?: string;
  'col-start-12'?: string;
  'col-start-auto'?: string;
  'col-end-1'?: string;
  'col-end-2'?: string;
  'col-end-3'?: string;
  'col-end-4'?: string;
  'col-end-5'?: string;
  'col-end-6'?: string;
  'col-end-7'?: string;
  'col-end-8'?: string;
  'col-end-9'?: string;
  'col-end-10'?: string;
  'col-end-11'?: string;
  'col-end-12'?: string;
  'col-end-auto'?: string;
}

// Grid Row Start/End
export interface RowPositionConfig {
  'row-start-1'?: string;
  'row-start-2'?: string;
  'row-start-3'?: string;
  'row-start-4'?: string;
  'row-start-5'?: string;
  'row-start-6'?: string;
  'row-start-7'?: string;
  'row-start-8'?: string;
  'row-start-9'?: string;
  'row-start-10'?: string;
  'row-start-11'?: string;
  'row-start-12'?: string;
  'row-start-auto'?: string;
  'row-end-1'?: string;
  'row-end-2'?: string;
  'row-end-3'?: string;
  'row-end-4'?: string;
  'row-end-5'?: string;
  'row-end-6'?: string;
  'row-end-7'?: string;
  'row-end-8'?: string;
  'row-end-9'?: string;
  'row-end-10'?: string;
  'row-end-11'?: string;
  'row-end-12'?: string;
  'row-end-auto'?: string;
}

// Grid Auto Flow
export interface GridFlowConfig {
  'grid-flow-row'?: string;
  'grid-flow-col'?: string;
  'grid-flow-dense'?: string;
  'grid-flow-row-dense'?: string;
  'grid-flow-col-dense'?: string;
}

// 後方互換性のためのGridConfig
export type GridConfig = GridColumnsConfig &
  GridRowsConfig &
  ColumnSpanConfig &
  RowSpanConfig &
  ColumnPositionConfig &
  RowPositionConfig &
  GridFlowConfig;

export interface SmsshCSSConfig {
  content: string[];
  safelist?: string[];
  includeResetCSS?: boolean;
  includeBaseCSS?: boolean;
  purge?: PurgeConfig;
  apply?: ApplyConfig;
}

export interface GeneratedCSS {
  utilities: string;
  components: string;
  base: string;
  reset: string;
}

export type SpacingDirection = 't' | 'r' | 'b' | 'l' | 'x' | 'y' | '';
export type SpacingProperty = 'margin' | 'padding' | 'gap';

export type WidthDirection = 'min' | 'max' | '';
export type WidthProperty = 'width' | 'min-width' | 'max-width';

export type DisplayConfig = {
  [key: string]: string;
};

export type FlexboxConfig = {
  // Flex Direction
  'flex-row'?: string;
  'flex-row-reverse'?: string;
  'flex-col'?: string;
  'flex-col-reverse'?: string;

  // Flex Wrap
  'flex-wrap'?: string;
  'flex-wrap-reverse'?: string;
  'flex-nowrap'?: string;

  // Justify Content
  'justify-start'?: string;
  'justify-end'?: string;
  'justify-center'?: string;
  'justify-between'?: string;
  'justify-around'?: string;
  'justify-evenly'?: string;

  // Align Items
  'items-start'?: string;
  'items-end'?: string;
  'items-center'?: string;
  'items-baseline'?: string;
  'items-stretch'?: string;

  // Align Content
  'content-start'?: string;
  'content-end'?: string;
  'content-center'?: string;
  'content-between'?: string;
  'content-around'?: string;
  'content-evenly'?: string;

  // Align Self
  'self-auto'?: string;
  'self-start'?: string;
  'self-end'?: string;
  'self-center'?: string;
  'self-stretch'?: string;

  // Flex
  'flex-1'?: string;
  'flex-auto'?: string;
  'flex-initial'?: string;
  'flex-none'?: string;

  // Flex Grow
  grow?: string;
  'grow-0'?: string;

  // Flex Shrink
  shrink?: string;
  'shrink-0'?: string;

  // Flex Basis (extends SizeConfig)
  basis?: SizeConfig;
  [key: string]: string | SizeConfig | undefined;
};

export type PositioningConfig = {
  [key: string]: string;
};

export type OverflowConfig = {
  [key: string]: string;
};

export type OrderConfig = {
  [key: string]: string;
};

export type ZIndexConfig = {
  [key: string]: string;
};

// コンポーネントクラスの設定
export interface ApplyConfig {
  [className: string]: string; // クラス名: 適用するユーティリティクラス
}

// 任意値の型安全性を向上させる新しい型定義
export type ArbitraryValue = string;

export interface ArbitraryValueValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue: string;
  warnings: string[];
}

export interface ArbitraryValueConfig {
  // CSS関数の許可リスト
  allowedFunctions: string[];
  // 許可される単位
  allowedUnits: string[];
  // セキュリティチェックを有効にするか
  enableSecurityCheck: boolean;
  // 最大値の長さ制限
  maxLength: number;
  // デバッグモード
  debug: boolean;
}

export const defaultArbitraryValueConfig: ArbitraryValueConfig = {
  allowedFunctions: ['calc', 'min', 'max', 'clamp', 'var', 'rgb', 'rgba', 'hsl', 'hsla'],
  allowedUnits: [
    'px',
    'rem',
    'em',
    '%',
    'vh',
    'vw',
    'dvh',
    'dvw',
    'vmin',
    'vmax',
    'ch',
    'ex',
    'cm',
    'mm',
    'in',
    'pt',
    'pc',
  ],
  enableSecurityCheck: true,
  maxLength: 200,
  debug: false,
};

// 型安全なプロパティマッピング
export interface TypeSafePropertyMapping {
  [key: string]: {
    cssProperty: string;
    validator: (value: string) => ArbitraryValueValidationResult;
    transform?: (value: string) => string;
  };
}

// エラーの種類を型安全にする
export type ValidationErrorType =
  | 'INVALID_CSS_FUNCTION'
  | 'INVALID_UNIT'
  | 'SECURITY_VIOLATION'
  | 'VALUE_TOO_LONG'
  | 'MALFORMED_VALUE'
  | 'UNSUPPORTED_PROPERTY';

export interface TypedValidationError {
  type: ValidationErrorType;
  message: string;
  value: string;
  property?: string;
  suggestion?: string;
}
