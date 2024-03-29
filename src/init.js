#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = __importDefault(require("path"));
var colors_1 = __importDefault(require("colors"));
// 复制操作
function copyFile() {
    var sourceFilePath = path_1.default.resolve(__dirname, 'components/iconfont.json');
    var targetFilePath = path_1.default.resolve(process.cwd(), 'iconfont.json');
    fs_extra_1.default.copyFileSync(sourceFilePath, targetFilePath);
    console.warn(colors_1.default.green("\u221A \u6587\u4EF6 \"".concat(targetFilePath, "\" \u751F\u6210\u6210\u529F")));
}
copyFile();
