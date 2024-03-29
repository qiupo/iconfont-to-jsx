import defaultConfig from './iconfont.json';
import minimist from 'minimist';
import fs from 'fs-extra';
import path from 'path';
import colors from 'colors';
import { IconfontConfigType } from '../type';
let cacheConfig: IconfontConfigType;

export const getConfig = () => {
  if (cacheConfig) {
    return cacheConfig;
  }

  const args = minimist(process.argv.slice(2));
  let configFilePath = 'iconfont.json';

  if (args.config && typeof args.config === 'string') {
    configFilePath = args.config;
  }

  const targetFile = path.resolve(configFilePath);

  if (!fs.existsSync(targetFile)) {
    console.warn(colors.red(`文件 "${configFilePath}" 不存在，请运行 npx iconfont-init 生成配置文件`));
    process.exit(1);
  }

  const config: IconfontConfigType = require(targetFile);

  if (!config.symbol_url || !/^(https?:)?\/\//.test(config.symbol_url)) {
    console.warn(colors.red('需要提供 symbol_url'));
    process.exit(1);
  }

  if (config.symbol_url.indexOf('//') === 0) {
    config.symbol_url = 'http:' + config.symbol_url;
  }

  config.save_dir = config.save_dir || defaultConfig.save_dir;
  config.default_icon_size = config.default_icon_size || defaultConfig.default_icon_size;
  config.design_width = config.design_width || defaultConfig.design_width;

  cacheConfig = config;

  return config;
};