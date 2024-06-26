import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { faker } from "@faker-js/faker"
import { openDialog } from "../page/dialog.js"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test("update system admin lang", async ({ page, backofficeApi }) => {
  await page.goto("/systemadmin/language", { waitUntil: "networkidle" })

  let cultureCode = "zh-TW"
  await page.locator(`input[name="cultureCode"]`).fill(cultureCode)

  await Promise.all([
    page.waitForResponse(urlIncludes(`api/language`)),
    page.locator(`button[type="submit"]`).click()
  ])

  let DialogSelector = `#edit-lang-dialog`
  await openDialog(page, DialogSelector)

  let name = faker.lorem.word()

  let NameLocator = page.locator(`${DialogSelector} input[name="name"]`)
  await NameLocator.click()
  await page.keyboard.press("Control+A")
  await page.keyboard.press("Backspace")
  await NameLocator.fill(name)

  await Promise.all([
    page.waitForResponse(urlIncludes(`api/language/${cultureCode}`)),
    page.locator(`${DialogSelector} button[type="submit"]`).click()
  ])

  let updated = await backofficeApi.system.admin.lang.find(cultureCode)
  expect(updated.name).equals(name)
})
