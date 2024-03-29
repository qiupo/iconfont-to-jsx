import Match from './match'
import { getConfig } from './getConfig'
import utils from './utils'
const create = async () => {
  const config = getConfig();
  const mat = new Match(config)
  const iconCtx = await utils.fetchXml(config.symbol_url)
  mat.generateComponent(iconCtx)
}

export default create
