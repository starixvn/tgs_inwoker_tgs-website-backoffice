import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { faker } from "@faker-js/faker"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test("login fail", async ({ page, adminUsername }) => {
  await page.goto(`/login`, { waitUntil: "networkidle" })

  let userNameInputSelector = `form input[name='username']`
  await page.waitForSelector(userNameInputSelector)

  await page.click(userNameInputSelector)
  await page.type(userNameInputSelector, adminUsername)

  let passwordInputSelectot = `form input[name="password"]`
  await page.click(passwordInputSelectot)
  await page.type(passwordInputSelectot, `${faker.internet.password()}123`)

  let [loginResponse] = await Promise.all([
    page.waitForResponse(urlIncludes("/api/auth")),
    page.click(`form button[type="submit"]`)
  ])

  let result = await loginResponse.json()

  let alertDialogSelector = `[role="alertdialog"]`
  let isAlertDialogVisible = await page.isVisible(alertDialogSelector)
  expect(isAlertDialogVisible).to.be.true
})
