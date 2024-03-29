"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
var iconfont_json_1 = __importDefault(require("./iconfont.json"));
var minimist_1 = __importDefault(require("minimist"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = __importDefault(require("path"));
var colors_1 = __importDefault(require("colors"));
var cacheConfig;
var getConfig = function () {
    if (cacheConfig) {
        return cacheConfig;
    }
    var args = (0, minimist_1.default)(process.argv.slice(2));
    var configFilePath = 'iconfont.json';
    if (args.config && typeof args.config === 'string') {
        configFilePath = args.config;
    }
    var targetFile = path_1.default.resolve(configFilePath);
    if (!fs_extra_1.default.existsSync(targetFile)) {
        console.warn(colors_1.default.red("\u6587\u4EF6 \"".concat(configFilePath, "\" \u4E0D\u5B58\u5728\uFF0C\u8BF7\u8FD0\u884C npx iconfont-init \u751F\u6210\u914D\u7F6E\u6587\u4EF6")));
        process.exit(1);
    }
    var config = require(targetFile);
    if (!config.symbol_url || !/^(https?:)?\/\//.test(config.symbol_url)) {
        console.warn(colors_1.default.red('需要提供 symbol_url'));
        process.exit(1);
    }
    if (config.symbol_url.indexOf('//') === 0) {
        config.symbol_url = 'http:' + config.symbol_url;
    }
    config.save_dir = config.save_dir || iconfont_json_1.default.save_dir;
    config.default_icon_size = config.default_icon_size || iconfont_json_1.default.default_icon_size;
    config.design_width = config.design_width || iconfont_json_1.default.design_width;
    cacheConfig = config;
    return config;
};
exports.getConfig = getConfig;
