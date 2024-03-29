#!/usr/bin/env node
import fs from 'fs-extra';
import path from 'path';
import colors from 'colors';
// 复制操作
function copyFile() {
  const sourceFilePath = path.resolve(__dirname, 'components/iconfont.json');
  const targetFilePath = path.resolve(process.cwd(), 'iconfont.json');
  fs.copyFileSync(sourceFilePath, targetFilePath);
  console.warn(colors.green(`√ 文件 "${targetFilePath}" 生成成功`));

}

copyFile();
