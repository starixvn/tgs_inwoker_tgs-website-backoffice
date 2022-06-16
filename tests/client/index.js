import { initFetcher } from "./fetcher.js"
import host from "./host.js"
import player from "./player/index.js"
import round from "./round/index.js"
import payment from "./payment/index.js"
import promotion from "./promotion/index.js"
import platform from "./platform/index.js"
import agent from "./agent/index.js"
import fund from "./fund/index.js"

export default {
  init: (options = {}) => {
    initFetcher(options.fetcher)
    host.init(options.host)
  },
  player,
  round,
  payment,
  promotion,
  platform,
  agent,
  fund
}
