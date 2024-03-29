"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceContent = exports.getTemplate = void 0;
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = __importDefault(require("path"));
var getTemplate = function (fileName) {
    return fs_extra_1.default.readFileSync(path_1.default.join(__dirname, "../templates/".concat(fileName, ".template"))).toString();
};
exports.getTemplate = getTemplate;
var replaceContent = function (reg, template, content) {
    var exp = new RegExp(reg, 'g');
    return template.replace(exp, content);
};
exports.replaceContent = replaceContent;
