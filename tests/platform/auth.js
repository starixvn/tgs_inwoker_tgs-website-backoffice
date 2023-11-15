import base from "@playwright/test"
import { loginUser, login } from "../auth.js"
import { host } from "../env.js"
import brandCertApi from "../../client/brandCertApi/index.js"
import operatorApi from "../../client/operatorApi/index.js"
import backofficeApi from "../client/index.js"

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
  platformCode: "GPI",
  platformUsername: PlatformUsername,
  host: host(),
  context: async ({ browser, host }, use) => {
    let context = await browser.newContext({
      storageState: AuthPath,
      baseURL: host
    })
    use(context)
  },
  backofficeApi: async ({ context, host }, use) => {
    backofficeApi.init({
      fetcher: context.request,
      host
    })
    use(backofficeApi)
  },
  operatorApi: async ({}, use) => {
    use(operatorApi)
  },
  page: async ({ context, host }, use) => {
    let page = await context.newPage()
    use(page)
  },
  platform: async ({ platformCode, backofficeApi }, use) => {
    let platform = await backofficeApi.platform.findPlatform(platformCode)
    use(platform)
  },
  platformUser: async ({ page, platformUsername }, use) => {
    let userInfo = await loginUser(page, platformUsername)
    use(userInfo)
  },
  platformToken: async ({ platformCode }, use) => {
    let platformToken = await brandCertApi.platformToken(platformCode)
    use(platformToken)
  },
  player: async ({ platformToken }, use) => {
    let player = await operatorApi.player.createAndLogin(platformToken)
    use(player)
  }
}
