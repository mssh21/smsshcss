#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

const program = new Command();

program
  .name('smsshcss')
  .description('SmsshCSS CLI tools')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize a SmsshCSS configuration file')
  .option('--full', 'Generate a full configuration file with all options')
  .option('--minimal', 'Generate a minimal configuration file')
  .action(async (options: { full?: boolean; minimal?: boolean }) => {
    const configPath = path.resolve(process.cwd(), 'smsshcss.config.js');
    
    // 設定ファイルが既に存在するか確認
    if (fs.existsSync(configPath)) {
      console.log(chalk.yellow('設定ファイルが既に存在します: smsshcss.config.js'));
      return;
    }
    
    // テンプレートファイルのパスを取得
    const templateName = options.minimal ? 'minimal.js' : 'smsshcss.config.js';
    const templatePath = path.resolve(__dirname, './templates', templateName);
    
    try {
      // テンプレートパッケージにテンプレートが存在するか確認
      let templateExists = await fs.pathExists(templatePath);
      
      if (!templateExists) {
        console.log(chalk.red(`テンプレートが見つかりません: ${templatePath}`));
        return;
      }
      
      // テンプレートファイルを現在のディレクトリにコピー
      await fs.copy(templatePath, configPath);
      console.log(chalk.green('設定ファイルを作成しました: smsshcss.config.js'));
      
      // 次のステップを表示
      console.log('\nNext steps:');
      console.log('  1. PostCSSプラグインを設定してください:');
      console.log(chalk.cyan('     npm install --save-dev postcss @smsshcss/postcss'));
      console.log(chalk.cyan('     # or'));
      console.log(chalk.cyan('     yarn add -D postcss @smsshcss/postcss'));
      console.log('  2. postcss.config.js を作成してください:');
      console.log(chalk.cyan('     module.exports = {'));
      console.log(chalk.cyan('       plugins: ['));
      console.log(chalk.cyan('         require(\'@smsshcss/postcss\')(),'));
      console.log(chalk.cyan('         // その他のプラグイン'));
      console.log(chalk.cyan('       ]'));
      console.log(chalk.cyan('     };'));
      
    } catch (error) {
      console.error(chalk.red('設定ファイルの作成中にエラーが発生しました:'), error);
    }
  });

// ミニマル設定ファイル用のコマンド
program
  .command('minimal')
  .description('Initialize a minimal SmsshCSS configuration file')
  .action(() => {
    program.commands.find((cmd: Command) => cmd.name() === 'init')?.executeSubCommand(['--minimal']);
  });

// ヘルプを追加
program.on('--help', () => {
  console.log('');
  console.log('Examples:');
  console.log('  $ smsshcss init            # 標準設定ファイルを生成');
  console.log('  $ smsshcss init --minimal  # 最小構成の設定ファイルを生成');
});

program.parse(process.argv);