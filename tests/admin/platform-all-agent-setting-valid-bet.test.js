import base from "@playwright/test"
import { Fixture } from "./auth.js"
import clone from "clone-deep"
import { selectPlatformByCode, selectRandomPlatform } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import { expect } from "chai"
import { urlIncludes } from "../page/response.js"
import { faker } from "@faker-js/faker"
import { head } from "lodash-es"

const test = base.extend(Fixture)

test("update all agent settings > valid bet", async ({
  page,
  allAgentPlatform,
  backofficeApi
}) => {
  const GameType = "LiveDealer"
  await Promise.all([
    backofficeApi.platform.allAgent.setValidBet({
      brandId: allAgentPlatform.id,
      allAgentGameType: GameType,
      conditions: []
    }),
    gotoPlatformOperationSettingPage(page, allAgentPlatform.code)
  ])

  let DialogSelector = "#all-agent-setting-dialog"
  await Promise.all([
    page.waitForResponse(
      urlIncludes(`/api/BrandAllAgent/${allAgentPlatform.id}`)
    ),
    openDialog(page, DialogSelector)
  ])

  let ValidBetDialogSelector = `#valid-bet-setting-dialog`
  await openDialog(page, ValidBetDialogSelector)

  await page
    .locator(`${ValidBetDialogSelector} button#add-profit-sharing-setting`)
    .click()

  let value = faker.number.int({ min: 1, max: 10 })
  await page
    .locator(
      `${ValidBetDialogSelector} input[name="conditions.0.activeNumber"]`
    )
    .fill(`${value}`)

  await page
    .locator(`${ValidBetDialogSelector} input[name="conditions.0.netProfit"]`)
    .fill(`${value}`)

  await page
    .locator(
      `${ValidBetDialogSelector} input[name="conditions.0.rebatePercentage"]`
    )
    .fill(`${value}`)

  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/BrandAllAgent/validBet`)),
    page.locator(`${ValidBetDialogSelector} button[type="submit"]`).click()
  ])

  let validBetSettingList = await backofficeApi.platform.allAgent.getValidBet({
    brandId: allAgentPlatform.id,
    allAgentGameType: GameType
  })

  let setting = head(validBetSettingList)
  expect(setting.activeNumber).equals(value)
  expect(setting.netProfit).equals(value)
  expect(setting.rebatePercentage).equals(value)
})

const gotoPlatformOperationSettingPage = async (page, platformCode) => {
  await page.goto("/platform/imsettings", { waitUntil: "networkidle" })
  await selectPlatformByCode(page, platformCode)
}
