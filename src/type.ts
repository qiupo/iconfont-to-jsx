/**
 * 定义Iconfont配置的接口
 * 该接口用于描述Iconfont图标的配置信息，包括图标的基本信息和处理参数。
 */
export interface IconfontConfigType {
    /**
     * iconfont图标的符号地址
     */
    symbol_url: string,
    /**
     * 指定下载的图标将保存在本地的哪个目录下。
     */
    save_dir: string,
    /**
     * 指定保存图标文件时的文件名。
     */
    file_name: string,
    /**
     * 控制图标大小是否使用rpx作为单位。
     */
    use_rpx: boolean,
    /**
     * 去除图标的前缀
     * 
     * 指定需要去除的图标名称的前缀。
     */
    trim_icon_prefix: string,
    /**
     * 默认的图标大小
     * 
     * 指定图标在未指定大小时的默认大小。
     */
    default_icon_size: number,
    /**
     * 指定设计稿的宽度，用于计算图标的真实大小。
     */
    design_width: number
}

/**
 * 定义XML数据中路径对象的类型
 * 用于描述XML文件中path元素的结构。
 */
export type XmlDataPath = {
    $: {
        d: string; // 路径的描述字符串
        fill?: string; // 填充颜色（可选）
    };
}

/**
 * 定义XML数据的类型
 * 用于描述包含多个图标的SVG XML文件的结构。
 */
export type XmlData = {
    svg: {
        symbol: Array<{
            $: {
                viewBox: string; // 视图框的值
                id: string; // 图标的ID
            };
            path: Array<XmlDataPath>; // 图标路径数据数组
        }
        >;
    },
}

/**
 * 定义颜色计数器的类型
 * 用于记录图标的颜色使用情况，包括颜色的索引和具体的颜色值。
 */
export type colorCounter = {
    colorIndex: number; // 颜色的索引
    color?: string; // 颜色的值（可选）
}