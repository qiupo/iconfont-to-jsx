#!/usr/bin/env node
import fs from 'fs-extra';
import path from 'path';
import colors from 'colors';
import minimist from 'minimist';
// 复制操作
function copyFile() {
  // 解析命令行参数
  const args = minimist<{ output: string }>(process.argv.slice(2));
  let outputFilePath = 'iconfont.json';
  // 如果命令行中指定了配置文件路径，则使用指定的路径
  if (args.output && typeof args.output === 'string') {
    outputFilePath = args.output;
  }
  const sourceFilePath = path.resolve(__dirname, 'components/iconfont.json');
  const targetFilePath = path.resolve(process.cwd(), outputFilePath);
  fs.copyFileSync(sourceFilePath, targetFilePath);
  console.warn(colors.green(`√ 文件 "${targetFilePath}" 生成成功`));

}

copyFile();
