import { colorCounter } from '../type';
// 转换成 import 语句
import utils from './utils'
import { getTemplate, replaceContent } from './getTemplate'
import path from 'path'
import colors from 'colors'
import { IconfontConfigType, XmlData, XmlDataPath } from '../type';

const ATTRIBUTE_FILL_MAP = ['path'];

class Match {
  config: IconfontConfigType;
  constructor(config: IconfontConfigType) {
    this.config = config
  }

  generateComponent = (data: XmlData) => {
    const svgTemplates: string[] = [];
    const names: string[] = [];
    const saveDir = path.resolve(this.config.save_dir);
    const fileName = this.config.file_name || 'index';
    utils.rmdir(saveDir)
    utils.mkdir(saveDir);

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

    const nameType = names.map(item => `'${item}'`).join('|');
    let ctx = getTemplate('tsx')
    ctx = replaceContent('#template#', ctx, svgTemplates.join('\n\n'));
    ctx = replaceContent('#nametype#', ctx, nameType);
    ctx = replaceContent('#rpx#', ctx, this.config.use_rpx ? true : false);
    ctx = replaceContent('#rpxsize#', ctx, this.config.default_icon_size);
    ctx = replaceContent('#design_width#', ctx, this.config.design_width);
    ctx = replaceContent('#file_name#', ctx, fileName);

    const less = getTemplate('less');
    utils.mkFile(path.join(saveDir, fileName + '.less'), less);
    utils.mkFile(path.join(saveDir, fileName + '.tsx'), ctx);
    console.log(`\n${colors.green('√')} All icons have been putted into dir: ${colors.green(this.config.save_dir)}\n`);
  };

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

  addAttribute(domName: string, sub: XmlDataPath, counter: { colorIndex: any; }) {
    let template = '';

    if (sub && sub.$) {
      if (ATTRIBUTE_FILL_MAP.includes(domName)) {
        // Set default color same as in iconfont.cn
        // And create placeholder to inject color by user's behavior
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
