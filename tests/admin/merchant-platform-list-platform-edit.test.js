import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { faker } from "@faker-js/faker"
import { openDialog } from "../page/dialog.js"
import { selectLicenseeById } from "../page/content.js"
import { selectFirstValidOption } from "../page/select.js"

const test = base.extend(Fixture)

test("edit platform", async ({ page, licensee, backofficeApi }) => {
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

  let DialogSelector = "#edit-platform-dialog"
  await openDialog(page, DialogSelector)

  const Name = faker.commerce.productName()
  await page.locator(`${DialogSelector} input[name="name"]`).fill(Name)

  const Email = faker.internet.email()
  await page
    .locator(`${DialogSelector} input[name="operationalEmail"]`)
    .fill(Email)

  const DailySettlementIntervalType = "Weekly"
  await page
    .locator(`${DialogSelector} select[name="settlementIntervalType"]`)
    .selectOption(DailySettlementIntervalType)

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
    page.locator(`${DialogSelector} button[type="submit"]`).click()
  ])

  let record = await backofficeApi.platform.findPlatform(platform.code)

  expect(record.name).equals(Name)
  expect(record.settlementIntervalType).equals(DailySettlementIntervalType)
})

const gotoPlatformListPage = async (page, licenseeId) => {
  await page.goto("/merchant/brands", { waitUntil: "networkidle" })
  await selectLicenseeById(page, licenseeId)
}
