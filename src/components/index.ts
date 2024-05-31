import Match from './match'
import { getConfig } from './getConfig'
import utils from './utils'

/**
 * 创建并初始化一个Match实例，并基于配置和获取的图标上下文生成组件。
 * 该函数没有参数。
 * @returns {Promise<void>} 该函数返回一个Promise，没有具体的返回值。
 */
const create = async () => {
  // 获取配置信息
  const config = getConfig();
  // 根据配置创建Match实例
  const mat = new Match(config)
  // 从指定URL获取图标上下文
  const iconCtx = await utils.fetchXml(config.symbol_url)
  // 使用图标上下文生成组件
  mat.generateComponent(iconCtx)
}

export default create