export interface IconfontConfigType {
    /**
     * iconfont symbol地址
     */
    symbol_url: string,
    /**
     * 保存目录
     */
    save_dir: string,
    /**
     * 文件名
     */
    file_name: string,
    /**
     * 是否使用rpx
     */
    use_rpx: boolean,
    /**
     * 去除图标前缀
     */
    trim_icon_prefix: string,
    /**
     * 默认图标大小
     */
    default_icon_size: number,
    /**
     * 设计稿宽度
     */
    design_width: number
}
export type XmlDataPath = {
    $: {
        d: string;
        fill?: string;
    };
}
export type XmlData = {
    svg: {
        symbol: Array<{
            $: {
                viewBox: string;
                id: string;
            };
            path: Array<XmlDataPath>;
        }
        >;
    },
}

export type colorCounter = {
    colorIndex: number;
    color?: string;
}