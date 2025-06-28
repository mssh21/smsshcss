import { ApplyConfig } from '../core/types';

/**
 * Apply Plugin Interface
 * 各ユーティリティタイプ用のプラグインインターフェース
 */
export interface ApplyPlugin {
  /** プラグイン名（識別用） */
  name: string;
  /** このプラグインが処理できるユーティリティクラスのパターン */
  patterns: RegExp[];
  /** ユーティリティクラスからCSSルールを抽出する関数 */
  extractCSS: (utilityClass: string, match: RegExpMatchArray) => string | null;
  /** 優先度（数値が大きいほど優先、デフォルト: 0） */
  priority?: number;
}

/**
 * Apply Plugin Registry
 * プラグインの登録と管理を行うレジストリ
 */
class ApplyPluginRegistry {
  private plugins: ApplyPlugin[] = [];

  /**
   * プラグインを登録
   */
  register(plugin: ApplyPlugin): void {
    // 既存プラグインの重複チェック
    const existingIndex = this.plugins.findIndex((p) => p.name === plugin.name);
    if (existingIndex >= 0) {
      this.plugins[existingIndex] = plugin;
    } else {
      this.plugins.push(plugin);
    }

    // 優先度順でソート
    this.plugins.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  /**
   * プラグインを登録解除
   */
  unregister(pluginName: string): void {
    this.plugins = this.plugins.filter((p) => p.name !== pluginName);
  }

  /**
   * ユーティリティクラスを処理
   */
  processUtility(utilityClass: string): string | null {
    for (const plugin of this.plugins) {
      for (const pattern of plugin.patterns) {
        const match = utilityClass.match(pattern);
        if (match) {
          const result = plugin.extractCSS(utilityClass, match);
          if (result) {
            return result;
          }
        }
      }
    }
    return null;
  }

  /**
   * 登録されているプラグイン一覧を取得
   */
  getRegisteredPlugins(): string[] {
    return this.plugins.map((p) => p.name);
  }
}

// グローバルレジストリインスタンス
export const applyPluginRegistry = new ApplyPluginRegistry();

/**
 * 改良されたApplyクラス生成関数
 * プラグインベースのアーキテクチャを使用
 */
export function generateApplyClasses(config?: ApplyConfig): string {
  if (!config) {
    return '';
  }

  const classes: string[] = [];

  for (const [className, utilities] of Object.entries(config)) {
    // ユーティリティクラスを分解
    const utilityClasses = utilities
      .trim()
      .split(/\s+/)
      .filter((cls) => cls.length > 0);

    if (utilityClasses.length === 0) {
      continue;
    }

    // 各ユーティリティクラスのCSSルールを収集
    const cssRules: string[] = [];

    for (const utilityClass of utilityClasses) {
      // プラグインレジストリを使用してCSSルールを抽出
      const cssRule = applyPluginRegistry.processUtility(utilityClass);
      if (cssRule) {
        cssRules.push(cssRule);
      } else {
        // デバッグ用: 処理できなかったクラスをログに出力
        console.warn(`[Apply] Unhandled utility class: ${utilityClass}`);
      }
    }

    if (cssRules.length > 0) {
      // applyクラスを生成
      const generatedClass = `.${className} {
${cssRules.map((rule) => `  ${rule}`).join('\n')}
}`;
      classes.push(generatedClass);
    }
  }

  return classes.join('\n\n');
}

/**
 * プラグイン作成のヘルパー関数
 */
export function createApplyPlugin(config: ApplyPlugin): ApplyPlugin {
  return {
    priority: 0,
    ...config,
  };
}

/**
 * 複数のパターンを持つプラグインを作成するヘルパー
 */
export function createMultiPatternPlugin(
  name: string,
  patterns: Array<{
    pattern: RegExp;
    handler: (utilityClass: string, match: RegExpMatchArray) => string | null;
  }>,
  priority?: number
): ApplyPlugin {
  return createApplyPlugin({
    name,
    patterns: patterns.map((p) => p.pattern),
    extractCSS: (utilityClass: string, match: RegExpMatchArray) => {
      // マッチしたパターンを特定してハンドラーを実行
      for (const { pattern, handler } of patterns) {
        const patternMatch = utilityClass.match(pattern);
        if (patternMatch && JSON.stringify(patternMatch) === JSON.stringify(match)) {
          return handler(utilityClass, match);
        }
      }
      return null;
    },
    priority,
  });
}
