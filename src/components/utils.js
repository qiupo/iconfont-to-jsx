"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = __importDefault(require("fs-extra"));
var axios_1 = __importDefault(require("axios"));
var xml2js_1 = require("xml2js");
/**
 * 获取给定路径的状态信息
 * @param path 文件或目录的路径
 * @returns 返回文件或目录的状态信息对象
 */
var getState = function (path) {
    return fs_extra_1.default.statSync(path);
};
/**
 * 检查给定路径是否存在目录
 * @param path 文件或目录的路径
 * @returns 如果路径存在且为目录，则返回true，否则返回false
 */
var exitDir = function (path) {
    return fs_extra_1.default.existsSync(path);
};
/**
 * 在给定路径创建目录，如果目录的上级目录不存在则一并创建
 * @param path 目录的路径
 * @returns 无返回值
 */
var mkdir = function (path) {
    return fs_extra_1.default.mkdirSync(path, { recursive: true });
};
/**
 * 删除给定路径的目录及其内容
 * @param path 目录的路径
 * @returns 无返回值
 */
var rmdir = function (path) {
    fs_extra_1.default.removeSync(path);
};
/**
 * 在给定路径创建一个文件，并写入内容
 * @param path 文件的路径
 * @param content 要写入的内容，可以是字符串或ArrayBufferView
 * @returns 无返回值
 */
var mkFile = function (path, content) {
    fs_extra_1.default.writeFileSync(path, content);
};
/**
 * 读取给定路径的文件内容
 * @param path 文件的路径或文件描述符
 * @returns 返回文件的内容，按utf-8编码读取
 */
var readFile = function (path) {
    return fs_extra_1.default.readFileSync(path, { encoding: 'utf-8' });
};
/**
 * 复制文件或目录从源路径到目标路径
 * @param from 源路径
 * @param to 目标路径
 * @returns 无返回值
 */
var copy = function (from, to) {
    fs_extra_1.default.copySync(from, to);
};
/**
 * 将十六进制颜色代码转换为rgb格式
 * @param hex 十六进制颜色代码，如"#ffffff"
 * @returns 返回rgb格式的颜色字符串，如"rgb(255,255,255)"
 */
var replaceHexToRgb = function (hex) {
    var rgb = [];
    //去除前缀 # 号
    var hexRep = hex.substr(1);
    if (hexRep.length === 3) {
        // 处理 '#abc' 成 '#aabbcc'
        hexRep = hexRep.replace(/(.)/g, '$1$1');
    }
    hex.replace(/../g, function (color) {
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
var fetchXml = function (symbol_url) { return __awaiter(void 0, void 0, void 0, function () {
    var data, matches_1, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('Fetching iconfont data...');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.get(symbol_url)];
            case 2:
                data = (_a.sent()).data;
                matches_1 = String(data).match(/'<svg>(.+?)<\/svg>'/);
                if (matches_1) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            (0, xml2js_1.parseString)("<svg>".concat(matches_1[1], "</svg>"), function (err, result) {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve(result);
                                }
                            });
                        })];
                }
                throw new Error('symbol url 地址错误');
            case 3:
                e_1 = _a.sent();
                throw new Error("\u5BF9\u4E0D\u8D77\u8BF7\u6C42iconfont.js\u6587\u4EF6\u9519\u8BEF\uFF0C\u8BF7\u68C0\u67E5\u94FE\u63A5\u5730\u5740\uFF1A".concat(symbol_url, "\n").concat(e_1));
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.default = {
    replaceHexToRgb: replaceHexToRgb,
    getState: getState,
    exitDir: exitDir,
    mkdir: mkdir,
    rmdir: rmdir,
    mkFile: mkFile,
    readFile: readFile,
    copy: copy,
    fetchXml: fetchXml
};
