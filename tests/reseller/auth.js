import base from "@playwright/test"
import { loginUser, login } from "../auth.js"
import { host } from "../env.js"

const Path = "./.playwright"
const AuthPath = `${Path}/reseller-auth.json`
const ResellerUsername = "reseller.enabled"

export const loginResellerUser = async (browser) =>
  login({
    username: ResellerUsername,
    password: "TgsP@ssw0rd",
    browser,
    storageStatePath: AuthPath
  })

export const Fixture = {
  resellerUsername: ResellerUsername,
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
  resellerUser: async ({ page, resellerUsername }, use) => {
    let userInfo = await loginUser(page, resellerUsername)
    use(userInfo)
  }
}
