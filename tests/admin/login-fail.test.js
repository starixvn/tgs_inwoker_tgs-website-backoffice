import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import faker from "@faker-js/faker"

const test = base.extend(Fixture)

const { internet } = faker

test("login fail", async ({ page, adminUsername }) => {
  await page.goto(`/login`, { waitUntil: "networkidle" })

  let userNameInputSelector = `form input[name='username']`
  await page.waitForSelector(userNameInputSelector)

  await page.click(userNameInputSelector)
  await page.type(userNameInputSelector, adminUsername)

  let passwordInputSelectot = `form input[name="password"]`
  await page.click(passwordInputSelectot)
  await page.type(passwordInputSelectot, `${internet.password()}123`)

  let [loginResponse] = await Promise.all([
    page.waitForResponse((response) => {
      return response.url().endsWith("/api/auth") && response.status() === 200
    }),
    page.click(`form button[type="submit"]`)
  ])

  let result = await loginResponse.json()

  let alertDialogSelector = `[role="alertdialog"]`
  let isAlertDialogVisible = await page.isVisible(alertDialogSelector)
  expect(isAlertDialogVisible).to.be.true
})
