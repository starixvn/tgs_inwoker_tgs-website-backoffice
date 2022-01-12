import { initFetcher } from "./fetcher.js"
import host from "./host.js"
import player from "./player/index.js"

export default {
  init: (options = {}) => {
    initFetcher(options.fetcher)
    host.init(options.host)
  },
  player
}
