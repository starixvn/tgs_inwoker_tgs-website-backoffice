import { chromium } from "playwright"
import { loginAdminUser } from "./admin/auth.js"
import { loginResellerUser } from "./reseller/auth.js"
import { loginPlatformUser } from "./platform/auth.js"

export default async () => {
  let browser = await chromium.launch()

  await loginAdminUser(browser)

  console.warn("TODO: create reseller user if not exist")
  await loginResellerUser(browser)

  console.warn("TODO: create platform user if not exist")
  await loginPlatformUser(browser)

  await browser.close()
}
