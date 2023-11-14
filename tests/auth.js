import { expect } from "chai"
import { host } from "./env.js"

const Path = "./.playwright"

const AdminAuthPath = `${Path}/admin-auth.json`
export const AdminUserName = "admin.enabled"
const admin = async ({ browser }) =>
  login({
    username: AdminUserName,
    password: "TgsP@ssw0rd",
    browser,
    storageStatePath: AdminAuthPath
  })

//TODO: rm reseller?
const ResellerAuthPath = `${Path}/reseller-auth.json`
const ResellerUserName = "reseller.enabled"
const reseller = async ({ browser }) =>
  login({
    username: ResellerUserName,
    password: "TgsP@ssw0rd",
    browser,
    storageStatePath: ResellerAuthPath
  })

const PlatformAuthPath = `${Path}/platform-auth.json`
const PlatformUserName = "brand.enabled"
//TODO: rm platform?
const platform = async ({ browser }) =>
  login({
    username: PlatformUserName,
    password: "TgsP@ssw0rd",
    browser,
    storageStatePath: PlatformAuthPath
  })

export const loginUser = async (page, username, password = "TgsP@ssw0rd") => {
  await page.goto(`${host()}/login`, {
    waitUntil: "networkidle0"
    /*
    timeout: 0// -> disable timeout
    */
  })

  let userNameInputSelector = `form input[name='username']`
  await page.waitForSelector(userNameInputSelector)

  await page.click(userNameInputSelector)
  await page.type(userNameInputSelector, username)

  let passwordInputSelectot = `form input[name="password"]`
  await page.click(passwordInputSelectot)
  await page.type(passwordInputSelectot, password)

  let [loginRequest, loginResponse] = await Promise.all([
    page.waitForRequest((request) => {
      return request.url().endsWith("/api/auth") && request.method() === "POST"
    }),
    page.waitForResponse((response) => {
      return response.url().endsWith("/api/auth") && response.status() === 200
    }),
    page.click(`form button[type="submit"]`)
  ])

  let response = await loginResponse.json()
  expect(response.valid).to.be.true
  expect(response).to.have.property("userInfo")

  return response.userInfo
}

//TODO: rm
export const login = async ({
  browser,
  storageStatePath,
  username = "",
  password = "TgsP@ssw0rd"
}) => {
  let context = await browser.newContext()
  let page = await context.newPage()
  await page.goto(`${host()}/login`, {
    waitUntil: "networkidle0"
    /*
    timeout: 0// -> disable timeout
    */
  })

  let userNameInputSelector = `form input[name='username']`
  await page.waitForSelector(userNameInputSelector)

  await page.click(userNameInputSelector)
  await page.type(userNameInputSelector, username)

  let passwordInputSelectot = `form input[name="password"]`
  await page.click(passwordInputSelectot)
  await page.type(passwordInputSelectot, password)

  let [loginRequest, loginResponse] = await Promise.all([
    page.waitForRequest((request) => {
      return request.url().endsWith("/api/auth") && request.method() === "POST"
    }),
    page.waitForResponse((response) => {
      return response.url().endsWith("/api/auth") && response.status() === 200
    }),
    page.click(`form button[type="submit"]`)
  ])

  let response = await loginResponse.json()
  expect(response.valid).to.be.true
  expect(response).to.have.property("userInfo")

  await context.storageState({ path: storageStatePath })

  if (!page.isClosed()) {
    await page.close()
  }
}

//TODO: rm Reseller & Platform?
export const StorageState = {
  Admin: AdminAuthPath,
  Reseller: ResellerAuthPath,
  Platform: PlatformAuthPath
}

//TODO: rm Reseller & Platform? create on demand?
export const UserName = {
  Admin: AdminUserName,
  Reseller: ResellerUserName,
  Platform: PlatformUserName
}

export const PlatformCode = "TGS"

export default {
  admin,
  reseller,
  platform,
  StorageState,
  UserName,
  PlatformCode
}
