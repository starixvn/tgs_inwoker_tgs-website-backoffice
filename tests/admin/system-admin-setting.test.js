import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { faker } from "@faker-js/faker"
import { openDialog } from "../page/dialog.js"
import { urlIncludes } from "../page/response.js"
import { selectByValue } from "../page/select.js"

const test = base.extend(Fixture)

test("system admin setting", async ({
  page,
  backofficeApi,
  systemAdminSetting: setting
}) => {
  await page.goto("/systemadmin/settings", { waitUntil: "networkidle" })

  await search({ page, setting })

  setting = await edit({ page, backofficeApi, key: setting.key })

  await view({ page })
})

const search = async ({ page, setting }) => {
  await page.locator(`input[name="key"]`).fill(setting.key)

  await Promise.all([
    page.waitForResponse(urlIncludes(`api/setting?`)),
    page.locator(`button[type="submit"]`).click()
  ])
}

const edit = async ({ page, backofficeApi, key }) => {
  let DialogSelector = `#edit-setting-dialog`
  await openDialog(page, DialogSelector)

  let value = {
    a: faker.lorem.word()
  }
  let jsonString = JSON.stringify(value)
  await page.click(`${DialogSelector} .monaco-editor .monaco-mouse-cursor-text`)
  await page.keyboard.press("Control+A")
  await page.keyboard.press("Backspace")
  await page.keyboard.type(jsonString)

  /*
  const halfSecond = 500
  await page.waitForTimeout(halfSecond)
  */

  let submitButton = page.locator(`${DialogSelector} button[type="submit"]`)
  await submitButton.focus()

  await Promise.all([
    page.waitForResponse(urlIncludes(`api/setting/`)),
    submitButton.click()
  ])

  let updated = await backofficeApi.system.admin.setting.get(key)
  expect(updated).to.deep.equal(value)

  return {
    key,
    value
  }
}

const view = async ({ page }) => {
  let DialogSelector = `#view-setting-dialog`
  await openDialog(page, DialogSelector)

  await page.locator(`${DialogSelector} .bb-DialogClose`)
}
