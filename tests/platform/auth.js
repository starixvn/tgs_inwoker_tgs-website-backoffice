import base from "@playwright/test"
import { loginUser } from "../auth.js"
import globalApi from "../../client/globalApi/index.js"
import operatorApi from "../../client/operatorApi/index.js"

export const Fixture = {
  platformUsername: "brand.enabled",
  platformUser: async ({ page, platformUsername }, use) => {
    let userInfo = await loginUser(page, platformUsername)
    use(userInfo)
  },
  platformCode: "GPI",
  platformToken: async ({ platformCode }, use) => {
    let platformToken = await globalApi.platformToken(platformCode)
    use(platformToken)
  },
  player: async ({ platformToken }, use) => {
    let player = await operatorApi.player.createAndLogin(platformToken)
    use(player)
  }
}
