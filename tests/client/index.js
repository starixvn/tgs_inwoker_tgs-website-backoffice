import { initFetcher } from "./fetcher.js"
import host from "./host.js"
import player from "./player/index.js"
import game from "./game/index.js"
//TODO: move round > game
import round from "./round/index.js"

import payment from "./payment/index.js"
import promotion from "./promotion/index.js"
import platform from "./platform/index.js"
import licensee from "./licensee/index.js"
import agent from "./agent/index.js"
import fund from "./fund/index.js"
import gameProvider from "./gameProvider/index.js"
import system from "./system/index.js"
import user from "./user/index.js"
import * as reseller from "./reseller/index.js"

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
  licensee,
  reseller,
  agent,
  fund,
  gameProvider,
  game,
  system,
  user
}
