import base from "@playwright/test"
import { loginUser, login } from "../auth.js"
import { host } from "../env.js"
import globalApi from "../../client/globalApi/index.js"
import operatorApi from "../../client/operatorApi/index.js"
import sboGameProviderApi from "../../client/gameProviderApi/sbo/index.js"
import backofficeApi from "../client/index.js"
import reportApi from "../../client/reportApi/index.js"
import reportAggregateApi from "../../client/reportAggregateApi/index.js"

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
  resellerCode: "TGS",
  host: host(),
  platformToken: async ({ platformCode }, use) => {
    let platformToken = await globalApi.platformToken(platformCode)
    use(platformToken)
  },
  player: async ({ platformToken }, use) => {
    let player = await operatorApi.player.createAndLogin(platformToken)
    use(player)
  },
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
  sboGameProviderApi: ({}, use) => {
    use(sboGameProviderApi)
  },
  reportApi: ({}, use) => {
    use(reportApi)
  },
  reportAggregateApi: ({}, use) => {
    use(reportAggregateApi)
  },
  page: async ({ context }, use) => {
    let page = await context.newPage()
    use(page)
  },
  adminUser: async ({ page, adminUsername }, use) => {
    let adminUserInfo = await loginUser(page, adminUsername)
    use(adminUserInfo)
  }
}
