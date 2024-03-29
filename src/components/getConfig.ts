import defaultConfig from './iconfont.json';
import minimist from 'minimist';
import fs from 'fs-extra';
import path from 'path';
import colors from 'colors';
import { IconfontConfigType } from '../type';
let cacheConfig: IconfontConfigType;
/**
 * 获取iconfont配置文件信息。
 * 该函数首先检查缓存中是否已有配置，如果有则直接返回缓存的配置。
 * 如果没有，它将从命令行参数中读取配置文件路径（如果提供），或者使用默认路径 'iconfont.json'。
 * 如果指定的配置文件不存在，则会警告用户并退出进程。
 * 配置文件必须包含合法的 `symbol_url`，且该URL必须是HTTP或HTTPS协议的。
 * 如果 `symbol_url` 是以 `//` 开头，会自动将其转换为 `http:` 协议。
 * 该函数还会填充一些默认配置项（如果用户配置中未指定）。
 * @returns {IconfontConfigType} 返回解析并填充默认值后的配置对象。
 */
export const getConfig = (): IconfontConfigType => {
  if (cacheConfig) {
    return cacheConfig;
  }

  // 解析命令行参数
  const args = minimist(process.argv.slice(2));
  let configFilePath = 'iconfont.json';

  // 如果命令行中指定了配置文件路径，则使用指定的路径
  if (args.config && typeof args.config === 'string') {
    configFilePath = args.config;
  }

  // 计算配置文件的绝对路径
  const targetFile = path.resolve(configFilePath);

  // 检查配置文件是否存在
  if (!fs.existsSync(targetFile)) {
    console.warn(colors.red(`文件 "${configFilePath}" 不存在，请运行 npx iconfont2Tsx-init/yarn run iconfont2Tsx-init 生成配置文件`));
    process.exit(1);
  }

  // 加载配置文件
  const config: IconfontConfigType = require(targetFile);

  // 检查配置文件中的symbol_url是否合法
  if (!config.symbol_url || !/^(https?:)?\/\//.test(config.symbol_url)) {
    console.warn(colors.red('需要提供 symbol_url'));
    process.exit(1);
  }

  // 如果symbol_url以//开头，自动转换为http:协议
  if (config.symbol_url.indexOf('//') === 0) {
    config.symbol_url = 'http:' + config.symbol_url;
  }

  // 填充默认配置项（如果用户未指定）
  config.save_dir = config.save_dir || defaultConfig.save_dir;
  config.default_icon_size = config.default_icon_size || defaultConfig.default_icon_size;
  config.design_width = config.design_width || defaultConfig.design_width;

  // 缓存配置对象
  cacheConfig = config;

  return config;
};