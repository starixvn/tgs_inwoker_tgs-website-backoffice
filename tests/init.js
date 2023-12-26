import { chromium } from "playwright"
import { loginAdminUser } from "./admin/auth.js"
import { loginResellerUser, ResellerUsername } from "./reseller/auth.js"
import { loginPlatformUser, PlatformUsername } from "./platform/auth.js"
import backofficeApi from "./client/index.js"
import { host } from "./env.js"

export default async () => {
  let browser = await chromium.launch()

  await loginAdminUser(browser, { afterLogin: initUsers })

  await loginResellerUser(browser)
  await loginPlatformUser(browser)

  await browser.close()
}

const initUsers = async ({ context }) => {
  backofficeApi.init({
    fetcher: context.request,
    host: host()
  })

  await backofficeApi.user.reseller.findOrCreate({
    username: ResellerUsername
  })

  await backofficeApi.user.platformUser.findOrCreate({
    username: PlatformUsername
  })
}
