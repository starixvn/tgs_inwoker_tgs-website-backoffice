import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"

const test = base.extend(Fixture)

test("should display user name", async ({ page, adminUsername }) => {
  await page.waitForSelector("#app-header #username")
  let username = await page.$eval(
    "#app-header #username",
    ({ textContent }) => textContent
  )

  expect(username).to.equal(adminUsername)
})
