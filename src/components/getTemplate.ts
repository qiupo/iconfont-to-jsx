import fs from 'fs-extra';
import path from 'path';

export const getTemplate = (fileName: string) => {
  return fs.readFileSync(path.join(__dirname, `../../templates/${fileName}.template`)).toString();
};
export const replaceContent = (reg: string | RegExp, template: string, content: any) => {
  const exp = new RegExp(reg, 'g');
  return template.replace(exp, content);
};
