import { colorCounter } from '../type';
import utils from './utils'
import path from 'path'
import colors from 'colors'
import { IconfontConfigType, XmlData, XmlDataPath } from '../type';

// 定义用于填充属性的映射表
const ATTRIBUTE_FILL_MAP = ['path'];

/**
 * 用于匹配和生成组件的类
 */
class Match {
  config: IconfontConfigType;

  /**
   * 构造函数
   * @param config 配置对象，类型为IconfontConfigType
   */
  constructor(config: IconfontConfigType) {
    this.config = config;
  }

  /**
   * 根据XML数据生成组件
   * @param data XML数据，其中包含svg符号信息
   */
  generateComponent = (data: XmlData) => {
    const svgTemplates: string[] = [];
    const names: string[] = [];
    const saveDir = path.resolve(this.config.save_dir);
    const fileName = this.config.file_name || 'index';
    // 清理目录并创建目录
    utils.rmdir(saveDir);
    utils.mkdir(saveDir);

    // 遍历svg符号，生成模板和名称列表
    data.svg.symbol.forEach((item) => {
      const iconId = item.$.id;
      const iconIdAfterTrim = this.config.trim_icon_prefix
        ? iconId.replace(
          new RegExp(`^${this.config.trim_icon_prefix}(.+?)$`),
          (_, value) => value.replace(/^[-_.=+#@!~*]+(.+?)$/, '$1')
        )
        : iconId;
      names.push(iconIdAfterTrim);
      svgTemplates.push(
        `{/*${iconIdAfterTrim}*/}\n{name === '${iconIdAfterTrim}'?<div style={{backgroundImage: \`url(\${quot}data:image/svg+xml,${this.generateCase(item)}\${quot})\`,` +
        ' width: `${svgSize}px`, height: `${svgSize}px`}} className="icon" />:null}'
      );
      console.log(`${colors.green('√')} Generated icon "${colors.yellow(iconId)}"`);
    });

    // 准备名称类型字符串，用于模板替换
    const nameType = names.map(item => `'${item}'`).join('|');
    let ctx = utils.getTemplate('tsx')
    ctx = utils.replaceContent('#template#', ctx, svgTemplates.join('\n\n'));
    ctx = utils.replaceContent('#nametype#', ctx, nameType);
    ctx = utils.replaceContent('#rpx#', ctx, this.config.use_rpx ? true : false);
    ctx = utils.replaceContent('#rpxsize#', ctx, this.config.default_icon_size);
    ctx = utils.replaceContent('#design_width#', ctx, this.config.design_width);
    ctx = utils.replaceContent('#file_name#', ctx, fileName);

    // 生成less和tsx文件
    const less = utils.getTemplate('less');
    utils.mkFile(path.join(saveDir, fileName + '.less'), less);
    utils.mkFile(path.join(saveDir, fileName + '.tsx'), ctx);
    console.log(`\n${colors.green('√')} All icons have been putted into dir: ${colors.green(this.config.save_dir)}\n`);
  };

  /**
   * 根据XML数据生成SVG案例
   * @param data XML数据的一个符号项
   * @returns 编码后的SVG模板字符串
   */
  generateCase(data: XmlData['svg']['symbol'][number]) {
    let template = `%3Csvg%20viewBox%3D%27${encodeURIComponent(data.$.viewBox)}%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27\${svgSize}px%27%20height%3D%27\${svgSize}px%27%3E`;

    let keys = Object.keys(data) as Array<keyof XmlData['svg']['symbol'][number]>;
    for (const domName of keys) {
      if (domName === '$') {
        continue;
      }

      const colorCounter: colorCounter = {
        colorIndex: 0,
      };

      if (Array.isArray(data[domName])) {
        data[domName].forEach((sub) => {
          template += `%3C${domName}${this.addAttribute(domName, sub, colorCounter)}%2F%3E`;
        });
      } else if ((data[domName] as any).$) {
        template += `%3C${domName}${this.addAttribute(domName, data[domName] as unknown as XmlDataPath, colorCounter)}%2F%3E`;
      }
    }

    template += `%3C%2Fsvg%3E`;

    return template
  };

  /**
   * 为DOM元素添加属性
   * @param domName DOM元素名称
   * @param sub DOM元素的子项或属性
   * @param counter 颜色计数器，用于管理颜色索引
   * @returns 编码后的属性字符串
   */
  addAttribute(domName: string, sub: XmlDataPath, counter: { colorIndex: any; }) {
    let template = '';

    if (sub && sub.$) {
      if (ATTRIBUTE_FILL_MAP.includes(domName)) {
        // 设置默认颜色，与iconfont.cn保持一致，并为用户行为注入颜色创建占位符
        sub.$.fill = sub.$.fill || '%23333333';
      }
      let keys = Object.keys(sub.$) as Array<keyof XmlData['svg']['symbol'][number]['path'][number]['$']>;

      for (const attributeName of keys) {
        if (attributeName === 'fill') {
          let keyword = 'svgColor'
          let color = encodeURIComponent(sub.$[attributeName] || '%23333333')
          template += `%20${attributeName}=%27\${(isStr?${keyword}: ${keyword}?.[${counter.colorIndex}])||'${color}'}%27`;
          counter.colorIndex += 1;
        } else {
          let temp = ` ${attributeName}='${sub.$[attributeName]}'`;
          template += encodeURIComponent(temp)
            .replace(/'/g, '%27')
            .replace(/"/g, '%22');
        }
      }
    }

    return template;
  };
}

export default Match;