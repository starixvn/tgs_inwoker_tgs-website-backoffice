import base from "@playwright/test"
import { loginUser, login } from "../auth.js"
import { host } from "../env.js"
import globalApi from "../../client/globalApi/index.js"
import operatorApi from "../../client/operatorApi/index.js"

const Path = "./.playwright"
const AuthPath = `${Path}/platform-auth.json`
const PlatformUsername = "brand.enabled"

export const loginPlatformUser = async (browser) =>
  login({
    username: PlatformUsername,
    password: "TgsP@ssw0rd",
    browser,
    storageStatePath: AuthPath
  })

export const Fixture = {
  platformCode: "TGS",
  platformUsername: PlatformUsername,
  context: async ({ browser }, use) => {
    let context = await browser.newContext({ storageState: AuthPath })
    use(context)
  },
  page: async ({ context }, use) => {
    let page = await context.newPage()
    await page.goto(host(), {
      waitUntil: "networkidle0"
    })

    use(page)
  },
  platformUser: async ({ page, platformUsername }, use) => {
    let userInfo = await loginUser(page, platformUsername)
    use(userInfo)
  },
  platformToken: async ({ platformCode }, use) => {
    let platformToken = await globalApi.platformToken(platformCode)
    use(platformToken)
  },
  player: async ({ platformToken }, use) => {
    let player = await operatorApi.player.createAndLogin(platformToken)
    use(player)
  }
}
