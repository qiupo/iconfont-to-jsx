"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 转换成 import 语句
var utils_1 = __importDefault(require("./utils"));
var getTemplate_1 = require("./getTemplate");
var path_1 = __importDefault(require("path"));
var colors_1 = __importDefault(require("colors"));
var ATTRIBUTE_FILL_MAP = ['path'];
var Match = /** @class */ (function () {
    function Match(config) {
        var _this = this;
        this.generateComponent = function (data) {
            var svgTemplates = [];
            var names = [];
            var saveDir = path_1.default.resolve(_this.config.save_dir);
            var fileName = _this.config.file_name || 'index';
            utils_1.default.rmdir(saveDir);
            utils_1.default.mkdir(saveDir);
            data.svg.symbol.forEach(function (item) {
                var iconId = item.$.id;
                var iconIdAfterTrim = _this.config.trim_icon_prefix
                    ? iconId.replace(new RegExp("^".concat(_this.config.trim_icon_prefix, "(.+?)$")), function (_, value) { return value.replace(/^[-_.=+#@!~*]+(.+?)$/, '$1'); })
                    : iconId;
                names.push(iconIdAfterTrim);
                svgTemplates.push("{/*".concat(iconIdAfterTrim, "*/}\n{name === '").concat(iconIdAfterTrim, "'?<div style={{backgroundImage: `url(${quot}data:image/svg+xml,").concat(_this.generateCase(item), "${quot})`,") +
                    ' width: `${svgSize}px`, height: `${svgSize}px`}} className="icon" />:null}');
                console.log("".concat(colors_1.default.green('√'), " Generated icon \"").concat(colors_1.default.yellow(iconId), "\""));
            });
            var nameType = names.map(function (item) { return "'".concat(item, "'"); }).join('|');
            var ctx = (0, getTemplate_1.getTemplate)('tsx');
            ctx = (0, getTemplate_1.replaceContent)('#template#', ctx, svgTemplates.join('\n\n'));
            ctx = (0, getTemplate_1.replaceContent)('#nametype#', ctx, nameType);
            ctx = (0, getTemplate_1.replaceContent)('#rpx#', ctx, _this.config.use_rpx ? true : false);
            ctx = (0, getTemplate_1.replaceContent)('#rpxsize#', ctx, _this.config.default_icon_size);
            ctx = (0, getTemplate_1.replaceContent)('#design_width#', ctx, _this.config.design_width);
            ctx = (0, getTemplate_1.replaceContent)('#file_name#', ctx, fileName);
            var less = (0, getTemplate_1.getTemplate)('less');
            utils_1.default.mkFile(path_1.default.join(saveDir, fileName + '.less'), less);
            utils_1.default.mkFile(path_1.default.join(saveDir, fileName + '.tsx'), ctx);
            console.log("\n".concat(colors_1.default.green('√'), " All icons have been putted into dir: ").concat(colors_1.default.green(_this.config.save_dir), "\n"));
        };
        this.config = config;
    }
    Match.prototype.generateCase = function (data) {
        var _this = this;
        var template = "%3Csvg%20viewBox%3D%27".concat(encodeURIComponent(data.$.viewBox), "%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27${svgSize}px%27%20height%3D%27${svgSize}px%27%3E");
        var keys = Object.keys(data);
        var _loop_1 = function (domName) {
            if (domName === '$') {
                return "continue";
            }
            var colorCounter = {
                colorIndex: 0,
            };
            if (Array.isArray(data[domName])) {
                data[domName].forEach(function (sub) {
                    template += "%3C".concat(domName).concat(_this.addAttribute(domName, sub, colorCounter), "%2F%3E");
                });
            }
            else if (data[domName].$) {
                template += "%3C".concat(domName).concat(this_1.addAttribute(domName, data[domName], colorCounter), "%2F%3E");
            }
        };
        var this_1 = this;
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var domName = keys_1[_i];
            _loop_1(domName);
        }
        template += "%3C%2Fsvg%3E";
        return template;
    };
    ;
    Match.prototype.addAttribute = function (domName, sub, counter) {
        var template = '';
        if (sub && sub.$) {
            if (ATTRIBUTE_FILL_MAP.includes(domName)) {
                // Set default color same as in iconfont.cn
                // And create placeholder to inject color by user's behavior
                sub.$.fill = sub.$.fill || '%23333333';
            }
            var keys = Object.keys(sub.$);
            for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
                var attributeName = keys_2[_i];
                if (attributeName === 'fill') {
                    var keyword = 'svgColor';
                    var color = encodeURIComponent(sub.$[attributeName] || '%23333333');
                    template += "%20".concat(attributeName, "=%27${(isStr?").concat(keyword, ": ").concat(keyword, "?.[").concat(counter.colorIndex, "])||'").concat(color, "'}%27");
                    counter.colorIndex += 1;
                }
                else {
                    var temp = " ".concat(attributeName, "='").concat(sub.$[attributeName], "'");
                    template += encodeURIComponent(temp)
                        .replace(/'/g, '%27')
                        .replace(/"/g, '%22');
                }
            }
        }
        return template;
    };
    ;
    return Match;
}());
exports.default = Match;
