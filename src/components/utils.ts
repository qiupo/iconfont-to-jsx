import fs from 'fs-extra';
import path from 'path';
import axios from 'axios';
import { parseString } from 'xml2js';
import { XmlData } from '../type';

/**
 * 获取给定路径的状态信息
 * @param path 文件或目录的路径
 * @returns 返回文件或目录的状态信息对象
 */
const getState = (path: fs.PathLike) => {
  return fs.statSync(path)
}

/**
 * 检查给定路径是否存在目录
 * @param path 文件或目录的路径
 * @returns 如果路径存在且为目录，则返回true，否则返回false
 */
const exitDir = (path: fs.PathLike) => {
  return fs.existsSync(path)
}

/**
 * 在给定路径创建目录，如果目录的上级目录不存在则一并创建
 * @param path 目录的路径
 * @returns 无返回值
 */
const mkdir = (path: fs.PathLike) => {
  return fs.mkdirSync(path, { recursive: true })
}

/**
 * 删除给定路径的目录及其内容
 * @param path 目录的路径
 * @returns 无返回值
 */
const rmdir = (path: any) => {
  fs.removeSync(path)
}
/**
 * 在给定路径创建一个文件，并写入内容
 * @param pathDir 文件的路径
 * @param content 要写入的内容，可以是字符串或ArrayBufferView
 * @returns 无返回值
 */
const mkFile = (pathDir: string, content: string | NodeJS.ArrayBufferView) => {
  fs.writeFileSync(pathDir, content)
}
/**
 * 读取给定路径的文件内容
 * @param path 文件的路径或文件描述符
 * @returns 返回文件的内容，按utf-8编码读取
 */
const readFile = (path: fs.PathLike) => {
  return fs.readFileSync(path, { encoding: 'utf-8' })
}
/**
 * 复制文件或目录从源路径到目标路径
 * @param from 源路径
 * @param to 目标路径
 * @returns 无返回值
 */
const copy = (from: any, to: any) => {
  fs.copySync(from, to)
}

/**
 * 将十六进制颜色代码转换为rgb格式
 * @param hex 十六进制颜色代码，如"#ffffff"
 * @returns 返回rgb格式的颜色字符串，如"rgb(255,255,255)"
 */
const replaceHexToRgb = (hex: string) => {
  const rgb: number[] = [];

  //去除前缀 # 号
  let hexRep = hex.substr(1);

  if (hexRep.length === 3) {
    // 处理 '#abc' 成 '#aabbcc'
    hexRep = hexRep.replace(/(.)/g, '$1$1');
  }

  hex.replace(/../g, (color: string) => {
    // 按16进制将字符串转换为数字
    rgb.push(parseInt(color, 0x10));
    return color;
  });

  return 'rgb(' + rgb.join(',') + ')';
};

/**
 * 从指定URL获取XML数据，并解析为JavaScript对象
 * @param symbol_url XML数据的URL地址
 * @returns 返回一个Promise，解析成功时返回XML数据转换后的JavaScript对象
 */
const fetchXml = async (symbol_url: string): Promise<XmlData> => {
  console.log('Fetching iconfont data...');
  try {
    const { data }: { data: XmlData } = await axios.get(symbol_url);
    const matches = String(data).match(/'<svg>(.+?)<\/svg>'/);

    if (matches) {
      return new Promise((resolve, reject) => {
        parseString(`<svg>${matches[1]}</svg>`, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    }

    throw new Error('symbol url 地址错误');
  } catch (e) {
    throw new Error(`对不起请求iconfont.js文件错误，请检查链接地址：${symbol_url}\n${e}`)
  }
};

/**
 * 读取指定的模板文件内容。
 * @param fileName 模板文件的名称，不包括扩展名。
 * @returns 返回模板文件的内容，为字符串格式。
 */
const getTemplate = (fileName: string) => {
  return fs.readFileSync(path.join(__dirname, `../../templates/${fileName}.template`)).toString();
};

/**
 * 将模板字符串中的指定内容替换为新内容。
 * @param reg 需要替换的内容的正则表达式或字符串。
 * @param template 模板字符串。
 * @param content 要替换为的新内容。
 * @returns 返回替换后的内容。
 */
const replaceContent = (reg: string | RegExp, template: string, content: any) => {
  const exp = new RegExp(reg, 'g'); // 将传入的字符串或正则表达式转换为全局正则表达式
  return template.replace(exp, content); // 执行替换操作并返回结果
};

/**
 * 使用给定的参数替换模板中的特定占位符。
 * @param {Object} param0 包含所有必要参数的对象
 * @param {string} param0.ctx 上下文内容，用于替换模板中的占位符
 * @param {string[]} param0.componentName 组件名
 * @param {string[]} param0.template 模板数组，占位符将被替换为相应参数的值
 * @param {string} param0.nameType 名称类型，用于替换模板中的占位符
 * @param {boolean} param0.rpx 是否使用rpx单位
 * @param {number} param0.rpxSize rpx单位的大小
 * @param {number} param0.designWidth 设计图的宽度
 * @param {string} param0.fileName 文件名，用于替换模板中的占位符
 * @returns 替换占位符后的结果字符串
 */
const replaceAll = ({ componentName, ctx, template, nameType, rpx, rpxSize, designWidth, fileName }: { ctx: string, componentName?: string, template: string, nameType?: string, rpx: boolean, rpxSize: number, designWidth: number, fileName: string }) => {
  // 使用给定的上下文和模板数组替换模板中的组件名
  let res = replaceContent('#componentName#', ctx, componentName);
  // 使用给定的上下文和模板数组替换模板中的第一个占位符
  res = replaceContent('#template#', res, template);
  // 替换模板中的名称类型占位符
  res = replaceContent('#nametype#', res, nameType);
  // 根据是否使用rpx单位，替换模板中的rpx占位符为布尔值
  res = replaceContent('#rpx#', res, rpx);
  // 替换模板中的rpx大小占位符
  res = replaceContent('#rpxsize#', res, rpxSize);
  // 替换模板中的设计图宽度占位符
  res = replaceContent('#design_width#', res, designWidth);
  // 替换模板中的文件名占位符
  res = replaceContent('#file_name#', res, fileName);
  return res;
}

/**
 * 将给定字符串转换成驼峰命名法（PascalCase）。
 * @param str 需要转换的字符串。
 * @returns 转换成驼峰命名法的字符串。
 */
const toPascalCase = (str: string) => {
  // 使用正则表达式按非字母数字、非-和_的字符分割字符串，并对每部分进行处理
  return str
    .split(/[^a-zA-Z0-9]+(.)/g)
    .map((word: string) => {
      // 对每个单词或'-'、'_'后紧接的字符，将首字母转换为大写
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(''); // 将处理后的单词连接成一个字符串
}

/**
 * 将驼峰命名转换为短横线命名
 * @param str 需要转换的字符串
 * @returns 转换后的字符串
 */
const camelToKebab = (str: string) => {
  // 使用正则表达式匹配并替换驼峰命名中的大写字母，将其转换为短横线命名格式，并转为小写
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export default {
  replaceHexToRgb,
  getState,
  exitDir,
  mkdir,
  rmdir,
  mkFile,
  readFile,
  copy,
  fetchXml,
  getTemplate,
  replaceContent,
  toPascalCase,
  camelToKebab,
  replaceAll
}