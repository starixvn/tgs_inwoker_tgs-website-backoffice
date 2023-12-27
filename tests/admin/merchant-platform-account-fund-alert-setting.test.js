import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { faker } from "@faker-js/faker"
import { openDialog } from "../page/dialog.js"
import { selectPlatformByCode } from "../page/content.js"
import numeral from "numeral"

const test = base.extend(Fixture)

test("platform account fund > add", async ({
  page,
  platform,
  backofficeApi
}) => {
  await gotoPlatformAccountFundPage(page, platform.code)

  let DialogSelector = `#alert-setting-dialog`
  await openDialog(page, DialogSelector)

  let LowRisk = faker.number.int({ min: 60, max: 70 })
  await page
    .locator(`${DialogSelector} input[name="lowRisk"]`)
    .fill(`${LowRisk}`)

  let ModerateRisk = faker.number.int({ min: LowRisk, max: 90 })
  await page
    .locator(`${DialogSelector} input[name="moderateRisk"]`)
    .fill(`${ModerateRisk}`)

  let HighRisk = faker.number.int({ min: ModerateRisk, max: 95 })
  await page
    .locator(`${DialogSelector} input[name="highRisk"]`)
    .fill(`${HighRisk}`)

  await page.locator(`${DialogSelector} button[id="autoAlert"]`).click()

  let lowRiskAlert = faker.lorem.paragraph()
  await page
    .locator(`${DialogSelector} textarea[name="lowNotification.emailContent"]`)
    .fill(lowRiskAlert)

  let moderateRiskAlert = faker.lorem.paragraph()
  await page
    .locator(
      `${DialogSelector} textarea[name="moderateNotification.emailContent"]`
    )
    .fill(moderateRiskAlert)

  let highRiskAlert = faker.lorem.paragraph()
  await page
    .locator(`${DialogSelector} textarea[name="highNotification.emailContent"]`)
    .fill(highRiskAlert)

  await Promise.all([
    page.waitForResponse((response) => {
      let url = response.url()
      let isApi = url.includes(`/api/brandgamecreditsuspsetting/${platform.id}`)
      if (isApi && !response.ok()) {
        throw Error("credit api error")
      }

      return isApi
    }),
    page.click(`${DialogSelector} button[type="submit"]`)
  ])

  let alertSetting = await backofficeApi.platform.accountFund.getAlertSetting(
    platform.id
  )

  expect(alertSetting.lowRisk).equals(LowRisk)
  expect(alertSetting.moderateRisk).equals(ModerateRisk)
  expect(alertSetting.highRisk).equals(HighRisk)

  expect(alertSetting.lowNotification.emailContent).equals(lowRiskAlert)
  expect(alertSetting.moderateNotification.emailContent).equals(
    moderateRiskAlert
  )
  expect(alertSetting.highNotification.emailContent).equals(highRiskAlert)
})

const gotoPlatformAccountFundPage = async (page, platformCode) => {
  await page.goto("/merchant/platformaccountfund", { waitUntil: "networkidle" })
  await selectPlatformByCode(page, platformCode)
}
