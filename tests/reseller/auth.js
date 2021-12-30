import base from "@playwright/test"
import { loginUser } from "../auth.js"

export const Fixture = {
  resellerUsername: "reseller.enabled",
  resellerUser: async ({ page, resellerUsername }, use) => {
    let userInfo = await loginUser(page, resellerUsername)
    use(userInfo)
  }
}
