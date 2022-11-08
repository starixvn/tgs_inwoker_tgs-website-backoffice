import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { fillDatePicker } from "../fill.js"
import { selectRandomPlatform } from "../page/content.js"
import { optionValues } from "../page/select.js"
import { openDialog } from "../page/dialog.js"
import faker from "@faker-js/faker"
import { random } from "lodash-es"

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

  let expectedMessage = await updateMessage(page)

  let message = await backofficeApi.platform.maintenance.getMessage(
    maintenance.brandMaintenanceId
  )

  expect(message).to.equals(expectedMessage)
})

const updateMessage = async (page, message = lorem.word()) => {
  let dialogSelector = `#edit-maintenance-message-dialog`
  await openDialog(page, dialogSelector)

  await page.fill(`${dialogSelector} [name="content"]`, message)
  await page.click(`${dialogSelector} button[type="submit"]`)

  return message
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
