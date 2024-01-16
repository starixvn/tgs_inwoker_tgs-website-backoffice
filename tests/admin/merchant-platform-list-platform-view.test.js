import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { faker } from "@faker-js/faker"
import { openDialog } from "../page/dialog.js"
import { selectLicenseeById } from "../page/content.js"
import { selectFirstValidOption } from "../page/select.js"

const test = base.extend(Fixture)

test("view platform", async ({ page, licensee, backofficeApi }) => {
  let [platform] = await Promise.all([
    backofficeApi.platform.addPlatform({ licenseeId: licensee.id }),
    gotoPlatformListPage(page, licensee.id)
  ])

  await page.locator(`input[name="keyword"]`).fill(platform.code)
  await Promise.all([
    page.waitForResponse((response) => {
      let url = response.url()
      const ApiUrl = "/api/brand"
      let isApi = url.includes(ApiUrl)
      if (isApi && !response.ok()) {
        throw Error(`${ApiUrl} failed`)
      }

      return isApi
    }),
    page.locator(`button[type="submit"]`).click()
  ])

  let DialogSelector = "#view-platform-dialog"
  await openDialog(page, DialogSelector)

  console.log("TODO: view platform")
})

const gotoPlatformListPage = async (page, licenseeId) => {
  await page.goto("/merchant/brands", { waitUntil: "networkidle" })
  await selectLicenseeById(page, licenseeId)
}
