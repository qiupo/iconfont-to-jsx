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
 * @param path 文件的路径
 * @param content 要写入的内容，可以是字符串或ArrayBufferView
 * @returns 无返回值
 */
const mkFile = (path: fs.PathOrFileDescriptor, content: string | NodeJS.ArrayBufferView) => {
  fs.writeFileSync(path, content)
}
/**
 * 读取给定路径的文件内容
 * @param path 文件的路径或文件描述符
 * @returns 返回文件的内容，按utf-8编码读取
 */
const readFile = (path: fs.PathOrFileDescriptor) => {
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
  replaceContent
}