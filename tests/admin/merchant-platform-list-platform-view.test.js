import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { faker } from "@faker-js/faker"
import { openDialog } from "../page/dialog.js"
import { selectLicenseeById } from "../page/content.js"
import { selectFirstValidOption } from "../page/select.js"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test("view platform", async ({ page, licensee, platform }) => {
  await gotoPlatformListPage(page, licensee.id)

  await page.locator(`input[name="keyword"]`).fill(platform.code)
  await Promise.all([
    page.waitForResponse(urlIncludes("/api/brand")),
    page.locator(`button[type="submit"]`).click()
  ])

  let DialogSelector = "#view-platform-dialog"
  await openDialog(page, DialogSelector)

  let code = await page
    .locator(`${DialogSelector} span[data-type="code"]`)
    .textContent()
  expect(code).equals(platform.code)
})

const gotoPlatformListPage = async (page, licenseeId) => {
  await page.goto("/merchant/brands", { waitUntil: "networkidle" })
  await selectLicenseeById(page, licenseeId)
}
