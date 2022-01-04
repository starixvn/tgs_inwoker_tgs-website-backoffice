import base from "@playwright/test"
import { loginUser, login } from "../auth.js"
import { host } from "../env.js"
import globalApi from "../../client/globalApi/index.js"
import operatorApi from "../../client/operatorApi/index.js"
import backofficeApi from "../client/index.js"

const Path = "./.playwright"
const AuthPath = `${Path}/admin-auth.json`
const AdminUsername = "admin.enabled"

export const loginAdminUser = async (browser) =>
  login({
    username: AdminUsername,
    password: "TgsP@ssw0rd",
    browser,
    storageStatePath: AuthPath
  })

export const Fixture = {
  adminUsername: AdminUsername,
  platformCode: "GPI",
  platformToken: async ({ platformCode }, use) => {
    let platformToken = await globalApi.platformToken(platformCode)
    use(platformToken)
  },
  player: async ({ platformToken }, use) => {
    let player = await operatorApi.player.createAndLogin(platformToken)
    use(player)
  },
  context: async ({ browser }, use) => {
    let context = await browser.newContext({ storageState: AuthPath })
    use(context)
  },
  backofficeApi: async ({ context }, use) => {
    backofficeApi.init({
      fetcher: context.request,
      host: host()
    })
    use(backofficeApi)
  },
  page: async ({ context }, use) => {
    let page = await context.newPage()
    await page.goto(host(), {
      waitUntil: "networkidle0"
    })

    use(page)
  },
  adminUser: async ({ page, adminUsername }, use) => {
    let adminUserInfo = await loginUser(page, adminUsername)
    use(adminUserInfo)
  }
}
