import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { faker } from "@faker-js/faker"
import { openDialog } from "../page/dialog.js"
import { selectLicenseeById } from "../page/content.js"
import { selectFirstValidOption } from "../page/select.js"

const test = base.extend(Fixture)

test("add platform", async ({ page, licensee, backofficeApi }) => {
  await gotoPlatformListPage(page, licensee.id)

  let DialogSelector = `#add-platform-dialog`
  await openDialog(page, DialogSelector)

  const Code = `${faker.string.alpha(1)}${faker.string.alphanumeric(
    5
  )}`.toUpperCase()

  await page.locator(`${DialogSelector} input[name="code"]`).fill(Code)
  await page.locator(`${DialogSelector} input[name="name"]`).fill(Code)

  const Email = faker.internet.email()
  await page
    .locator(`${DialogSelector} input[name="operationalEmail"]`)
    .fill(Email)

  const ProfitSharingType = "OneLayer"
  await page
    .locator(`${DialogSelector} select[name="agentDividendType"]`)
    .selectOption(ProfitSharingType)

  const DailySettlementIntervalType = "Daily"
  await page
    .locator(`${DialogSelector} select[name="settlementIntervalType"]`)
    .selectOption(DailySettlementIntervalType)

  await page
    .locator(
      `${DialogSelector} input[name="languages.0.checked"] + .bb-CheckboxIcon`
    )
    .click()

  await page
    .locator(
      `${DialogSelector} input[name="currencies.0.checked"] + .bb-CheckboxIcon`
    )
    .click()

  await page
    .locator(
      `${DialogSelector} input[name="currencies.0.betLimits.0.checked"] + .bb-CheckboxIcon`
    )
    .click()

  await page
    .locator(
      `${DialogSelector}  input[name="gameProviders.0.checked"] + .bb-CheckboxIcon`
    )
    .click()

  let GameProviderConfigDialogSelector = `#game-provider-config-dialog`
  let GameProviderConfigFirstOptionSelector = `${GameProviderConfigDialogSelector} select[name="id"]`
  await selectFirstValidOption(page, GameProviderConfigFirstOptionSelector)

  await page
    .locator(`${GameProviderConfigDialogSelector} button[type="submit"]`)
    .click()

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

  let platform = await backofficeApi.platform.findPlatform(Code)

  expect(platform.code).equals(Code)
  expect(platform.name).equals(Code)
  expect(platform.agentDividendType).equals(ProfitSharingType)
  expect(platform.settlementIntervalType).equals(DailySettlementIntervalType)
})

const gotoPlatformListPage = async (page, licenseeId) => {
  await page.goto("/merchant/brands", { waitUntil: "networkidle" })
  await selectLicenseeById(page, licenseeId)
}
