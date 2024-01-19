import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { fillDatePicker } from "../fill.js"
import { selectRandomPlatform } from "../page/content.js"
import { optionValues } from "../page/select.js"
import { openDialog } from "../page/dialog.js"
import { random } from "lodash-es"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test("platform maintenance edit platform maintenance time", async ({
  page,
  platform
}) => {
  await gotoMaintenancePage(page)

  await searchBy(page, platform.code)
  await updatePlatformMaintenanceTime(page, platform)
})

const updatePlatformMaintenanceTime = async (page, platform) => {
  let dialogSelector = "#platform-maintenance-time-dialog"
  await openDialog(page, dialogSelector)
  await selectRandomRange(page)
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().endsWith(`/time/${platform.id}`) &&
        response.status() === 200
      )
    }),
    page.click(`${dialogSelector} button[type="submit"]`)
  ])
}

const searchBy = async (page, expectedPlatformCode) => {
  await page.fill(`input[name="brandCode"]`, expectedPlatformCode)
  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/BrandMaintenance`)),
    page.click(`button[type="submit"]`)
  ])

  let firstRowLocator = page.locator(`#maintenance tbody tr`).first()
  let platformId = await firstRowLocator.getAttribute("data-row-id")
  expect(platformId).equals(expectedPlatformCode)
}

const selectRandomRange = async (
  page,
  startSelector = `select[name="beginTime"]`,
  endSelector = `select[name="endTime"]`
) => {
  let options = await optionValues(page, startSelector)
  let startMaxIndex = Math.floor(options.length / 2)
  let startIndex = random(0, startMaxIndex)
  let startValue = options[startIndex]
  await page.selectOption(startSelector, startValue)

  let endMinIndex = startMaxIndex + 1
  let endMaxIndex = options.length - 1
  let endIndex = random(endMinIndex, endMaxIndex)
  let endValue = options[endIndex]
  await page.selectOption(endSelector, endValue)

  return [startValue, endValue]
}

const gotoMaintenancePage = async (page) => {
  await page.goto(`/merchant/maintenance`, { waitUntil: "networkidle" })
}
