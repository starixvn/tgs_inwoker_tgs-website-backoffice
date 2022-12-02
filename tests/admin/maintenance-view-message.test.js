import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { fillDatePicker } from "../fill.js"
import { selectRandomPlatform } from "../page/content.js"
import { optionValues } from "../page/select.js"
import { openDialog } from "../page/dialog.js"
import faker from "@faker-js/faker"

const test = base.extend(Fixture)
const { finance, lorem } = faker
test("platform maintenance edit message", async ({
  page,
  platform,
  backofficeApi
}) => {
  await gotoMaintenancePage(page)

  let [maintenance] = await Promise.all([
    backofficeApi.platform.maintenance.findByPlatformCode(platform.code),
    searchBy(page, platform.code)
  ])

  let expectedMessage = faker.lorem.word()
  await backofficeApi.platform.maintenance.updateMessage(
    maintenance.brandMaintenanceId,
    expectedMessage
  )

  await viewMessage(page, expectedMessage)
})

const viewMessage = async (page, expectedMessage) => {
  let dialogSelector = `#view-maintenance-message-dialog`
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes("api/BrandMaintenance/") &&
        response.status() === 200
      )
    }),
    openDialog(page, dialogSelector)
  ])

  let message = await page.textContent(`${dialogSelector} #content`)
  expect(message).includes(expectedMessage)
}

const searchBy = async (page, expectedPlatformCode) => {
  await page.fill(`input[name="brandCode"]`, expectedPlatformCode)
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/BrandMaintenance`) &&
        response.status() === 200
      )
    }),
    page.click(`button[type="submit"]`)
  ])

  let firstRowLocator = page.locator(`#maintenance tbody tr`).first()
  let platformId = await firstRowLocator.getAttribute("data-row-id")
  expect(platformId).equals(expectedPlatformCode)
}

const gotoMaintenancePage = async (page) => {
  await page.goto(`/merchant/maintenance`, { waitUntil: "networkidle" })
}
