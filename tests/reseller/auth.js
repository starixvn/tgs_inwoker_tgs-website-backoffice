import base from "@playwright/test"
import { loginUser } from "../auth.js"

const Path = "./.playwright"
const AuthPath = `${Path}/reseller-auth.json`

export const Fixture = {
  resellerUsername: "reseller.enabled",
  resellerUser: async ({ page, resellerUsername }, use) => {
    let userInfo = await loginUser(page, resellerUsername)
    use(userInfo)
  }
}
