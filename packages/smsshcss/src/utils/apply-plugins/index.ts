import { applyPluginRegistry } from '../apply-system';
import { spacingPlugin } from './spacing-plugin';
import { sizePlugin } from './size-plugin';
import { colorPlugin } from './color-plugin';
import { flexboxPlugin } from './flexbox-plugin';
import { displayPlugin } from './display-plugin';
import { gridPlugin } from './grid-plugin';
import { fontSizePlugin } from './font-size-plugin';
import { orderPlugin } from './order-plugin';
import { zIndexPlugin } from './z-index-plugin';
import { positioningPlugin } from './positioning-plugin';
import { overflowPlugin } from './overflow-plugin';

/**
 * 全Applyプラグインの自動登録
 * このファイルをインポートするだけで全プラグインが利用可能になる
 */
export function registerAllApplyPlugins(): void {
  // スペーシング関連 (優先度: 10)
  applyPluginRegistry.register(spacingPlugin);

  // サイズ関連 (優先度: 9)
  applyPluginRegistry.register(sizePlugin);

  // カラー関連 (優先度: 8)
  applyPluginRegistry.register(colorPlugin);

  // Flexbox関連 (優先度: 8)
  applyPluginRegistry.register(flexboxPlugin);

  // Grid関連 (優先度: 7)
  applyPluginRegistry.register(gridPlugin);

  // Display関連 (優先度: 7)
  applyPluginRegistry.register(displayPlugin);

  // FontSize関連 (優先度: 6)
  applyPluginRegistry.register(fontSizePlugin);

  // Order関連 (優先度: 6)
  applyPluginRegistry.register(orderPlugin);

  // Z-Index関連 (優先度: 6)
  applyPluginRegistry.register(zIndexPlugin);

  // Positioning関連 (優先度: 6)
  applyPluginRegistry.register(positioningPlugin);

  // Overflow関連 (優先度: 6)
  applyPluginRegistry.register(overflowPlugin);
}

// 自動登録の実行
registerAllApplyPlugins();

// プラグインの再エクスポート
export { spacingPlugin } from './spacing-plugin';
export { sizePlugin } from './size-plugin';
export { colorPlugin } from './color-plugin';
export { flexboxPlugin } from './flexbox-plugin';
export { displayPlugin } from './display-plugin';
export { gridPlugin } from './grid-plugin';
export { fontSizePlugin } from './font-size-plugin';
export { orderPlugin } from './order-plugin';
export { zIndexPlugin } from './z-index-plugin';
export { positioningPlugin } from './positioning-plugin';
export { overflowPlugin } from './overflow-plugin';

// システムの再エクスポート
export { applyPluginRegistry, generateApplyClasses, createApplyPlugin } from '../apply-system';
