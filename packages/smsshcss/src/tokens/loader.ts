/**
 * トークンローダー
 * 設定からすべてのトークンを解決する
 */
import { SmsshcssConfig } from '../config';
import { resolveColors } from './colors';
import { resolveFontWeight } from './fontWeight';
import { resolveLineHeight } from './lineHeight';
import { resolveFontSize } from './fontSize';
import { resolveSpacing } from './spacing';
import { resolveBorderRadius } from './borderRadius';
import { resolveShadow } from './shadow';

/**
 * トークンの状態を保持するクラス
 */
export class TokenLoader {
  private config: SmsshcssConfig;
  private _colors: ReturnType<typeof resolveColors>;
  private _fontWeight: ReturnType<typeof resolveFontWeight>;
  private _lineHeight: ReturnType<typeof resolveLineHeight>;
  private _fontSize: ReturnType<typeof resolveFontSize>;
  private _spacing: ReturnType<typeof resolveSpacing>;
  private _borderRadius: ReturnType<typeof resolveBorderRadius>;
  private _shadow: ReturnType<typeof resolveShadow>;

  constructor(config: SmsshcssConfig) {
    this.config = config;
    this._colors = resolveColors(config);
    this._fontWeight = resolveFontWeight(config);
    this._lineHeight = resolveLineHeight(config);
    this._fontSize = resolveFontSize(config);
    this._spacing = resolveSpacing(config);
    this._borderRadius = resolveBorderRadius(config);
    this._shadow = resolveShadow(config);
  }

  /**
   * 色のトークンを取得
   */
  get colors() {
    return this._colors;
  }

  /**
   * フォントウェイトのトークンを取得
   */
  get fontWeight() {
    return this._fontWeight;
  }

  /**
   * 行の高さのトークンを取得
   */
  get lineHeight() {
    return this._lineHeight;
  }

  /**
   * フォントサイズのトークンを取得
   */
  get fontSize() {
    return this._fontSize;
  }

  /**
   * スペーシングのトークンを取得
   */
  get spacing() {
    return this._spacing;
  }

  /**
   * ボーダー半径のトークンを取得
   */
  get borderRadius() {
    return this._borderRadius;
  }

  /**
   * シャドウのトークンを取得
   */
  get shadow() {
    return this._shadow;
  }

  /**
   * 設定を更新し、全てのトークンを再解決する
   */
  updateConfig(config: SmsshcssConfig) {
    this.config = config;
    this._colors = resolveColors(config);
    this._fontWeight = resolveFontWeight(config);
    this._lineHeight = resolveLineHeight(config);
    this._fontSize = resolveFontSize(config);
    this._spacing = resolveSpacing(config);
    this._borderRadius = resolveBorderRadius(config);
    this._shadow = resolveShadow(config);
  }
} 