import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { faker } from "@faker-js/faker"
import { openDialog } from "../page/dialog.js"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test("update system admin currency", async ({ page, backofficeApi }) => {
  await page.goto("/systemadmin/currency", { waitUntil: "networkidle" })

  let code = "IDR_1000"
  await page.locator(`input[name="code"]`).fill(code)
  await Promise.all([
    page.waitForResponse(urlIncludes(`api/currency`)),
    page.locator(`button[type="submit"]`).click()
  ])

  let DialogSelector = `#edit-currency-dialog`
  await openDialog(page, DialogSelector)

  let name = faker.lorem.word()

  let NameLocator = page.locator(`${DialogSelector} input[name="name"]`)
  await NameLocator.click()
  await page.keyboard.press("Control+A")
  await page.keyboard.press("Backspace")
  await NameLocator.fill(name)

  await Promise.all([
    page.waitForResponse(urlIncludes(`api/currency/${code}`)),
    page.locator(`${DialogSelector} button[type="submit"]`).click()
  ])

  let updated = await backofficeApi.system.admin.currency.find(code)
  expect(updated.name).equals(name)
})
