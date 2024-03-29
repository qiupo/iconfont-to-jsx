# iconfont2Tsx

把 iconfont 图标批量转换成多 tsx react 组件。不依赖字体，支持多色彩。

# 特性

1、纯组件 <br> 2、不依赖字体文件 <br> 3、支持 px 和 rpx 两种格式 <br> 4、原样渲染多色彩图标 <br> 5、图标颜色可定制

# Step 1

安装插件

```bash
# Yarn
yarn add iconfont-to-jsx --dev

# Npm
npm install iconfont-to-jsx --save-dev
```

# Step 2

生成配置文件

```bash
npx iconfont2Tsx-init

# 可传入配置文件输出路径
# npx iconfont2Tsx-init --output iconfont.json
```

此时项目根目录会生成一个`iconfont.json`的文件，内容如下：

```json
{
  "symbol_url": "请参考README.md，复制 http://iconfont.cn 官网提供的JS链接",
  "save_dir": "./src/Iconfont",
  "file_name": "index",
  "use_rpx": false,
  "trim_icon_prefix": "",
  "default_icon_size": 16,
  "design_width": 750
}
```

### 配置参数说明：

#### symbol_url

请直接复制[iconfont](http://iconfont.cn)官网提供的项目链接。请务必看清是`.js`后缀而不是`.css`后缀

#### save_dir

根据 iconfont 图标生成的组件存放的位置。每次生成组件之前，该文件夹都会被清空。

#### use_rpx

使用微信提供的[尺寸单位 rpx](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxss.html#%E5%B0%BA%E5%AF%B8%E5%8D%95%E4%BD%8D)还是普通的像素单位`px`。默认值为 false，即使用`px`。

#### trim_icon_prefix

如果你的图标有通用的前缀，而你在使用的时候又不想重复去写，那么可以通过配置这个选项把前缀统一去掉。

#### default_icon_size

我们将为每个生成的图标组件加入默认的字体大小，当然，你也可以通过传入 props 的方式改变这个 size 值。

##### design_width

默认为 750px，你可以通过配置这个选项来改变这个值。

# Step 3

生成组件

```bash
# 可传入配置文件路径
# npx iconfont2Tsx-generate --config iconfont.json

npx iconfont2Tsx-generate
```

生成后查看您设置的保存目录中是否含有所有的图标

# 使用

在 page 中使用图标。

```jsx
// 原色彩
<Iconfont name="alipay" />

// 单色：红色
<Iconfont name="alipay" color="red" />

// 多色：红色+橘色
<Iconfont name="alipay" color={["red", "orange"]} size="300" />

// 不同格式的颜色写法
**暂不支持 rgba 写法，因为需要encodeURIComponent转码**
<Iconfont name="alipay" color={["#333", "red"]} />

```

# 更新图标

当您在 iconfont.cn 中的图标有变更时，只需更改配置`symbol_url`，然后再次执行`Step 3`即可生成最新的图标组件。欢迎使用，并给我一些反馈和建议.
