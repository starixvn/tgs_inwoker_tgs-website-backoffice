import base from "@playwright/test"
import { loginUser } from "../auth.js"
import globalApi from "../../client/globalApi/index.js"
import operatorApi from "../../client/operatorApi/index.js"

export const Fixture = {
  adminUsername: "admin.enabled",
  adminUser: async ({ page, adminUsername }, use) => {
    let adminUserInfo = await loginUser(page, adminUsername)
    use(adminUserInfo)
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
