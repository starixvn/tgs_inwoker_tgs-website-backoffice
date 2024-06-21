import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { faker } from "@faker-js/faker"
import { openDialog } from "../page/dialog.js"
import { urlIncludes } from "../page/response.js"
import { selectByValue } from "../page/select.js"

const test = base.extend(Fixture)

test("system admin setting view & update", async ({
  page,
  backofficeApi,
  systemAdminSetting: setting
}) => {
  await page.goto("/systemadmin/settings", { waitUntil: "networkidle" })

  await search({ page, setting })

  setting = await edit({ page, backofficeApi, setting })
  await view({ page, backofficeApi, setting })
})

const search = async ({ page, setting }) => {
  await page.locator(`input[name="key"]`).fill(setting.key)

  await Promise.all([
    page.waitForResponse(urlIncludes(`api/setting?`)),
    page.locator(`button[type="submit"]`).click()
  ])
}

const edit = async ({ page, backofficeApi, setting }) => {
  console.warn("TODO: edit system admin setting")

  //TODO: return updated setting
  return setting
}

const view = async ({ page, setting }) => {
  console.warn("TODO: view system admin setting")
}
