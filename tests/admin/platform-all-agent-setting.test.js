import base from "@playwright/test"
import { Fixture } from "./auth.js"
import clone from "clone-deep"
import { selectPlatformByCode, selectRandomPlatform } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import { expect } from "chai"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test("update all agent settings", async ({ page, allAgentPlatform }) => {
  await gotoPlatformOperationSettingPage(page, allAgentPlatform.code)

  let DialogSelector = "#all-agent-setting-dialog"
  let [allAgentSettingsReponse] = await Promise.all([
    page.waitForResponse(
      urlIncludes(`/api/BrandAllAgent/${allAgentPlatform.id}`)
    ),
    openDialog(page, DialogSelector)
  ])

  let allAgentSetting = await toAllAgentSettings(allAgentSettingsReponse)

  allAgentSetting.switch = !allAgentSetting.switch
  let MainSwitchSelector = `${DialogSelector} #main-switch input[type="checkbox"]`
  await Promise.all([
    page.waitForResponse(
      urlIncludes(`/api/BrandAllAgent/${allAgentPlatform.id}`)
    ),
    page.click(`${MainSwitchSelector} + div.bb-SwitchIcon`)
  ])

  let isChecked = await page.locator(MainSwitchSelector).isChecked()
  expect(isChecked).equals(allAgentSetting.switch)

  const GameType = "LiveDealer"
  let gameTypeSettings = Reflect.get(allAgentSetting, GameType)

  let expectedGameTypeSettings = {
    switch: !gameTypeSettings.switch,
    hasValidBet: !gameTypeSettings.hasValidBet
  }

  let GameTypeFormSelector = `${DialogSelector} form#${GameType}`
  let GameTypeSwitchSelector = `${GameTypeFormSelector} .bb-Switch input[type="checkbox"]`
  await page.locator(`${GameTypeSwitchSelector} + div.bb-SwitchIcon`).click()

  let HasValidBetSelector = `${GameTypeFormSelector} input[name="hasValidBet"]`
  await page.locator(`${HasValidBetSelector} + .bb-CheckboxIcon`).click()

  await Promise.all([
    page.waitForResponse(
      urlIncludes(`/api/BrandAllAgent/${allAgentPlatform.id}`)
    ),
    page.click(`${GameTypeFormSelector} button[type="submit"]`)
  ])

  let isGameTypeSwitchChecked = await page
    .locator(GameTypeSwitchSelector)
    .isChecked()
  expect(isGameTypeSwitchChecked).equals(expectedGameTypeSettings.switch)

  let hasValidBet = await page.locator(HasValidBetSelector).isChecked()
  expect(hasValidBet).equals(expectedGameTypeSettings.hasValidBet)

  console.log("TODO: test valid bet rebate setting")
})

const gotoPlatformOperationSettingPage = async (page, platformCode) => {
  await page.goto("/platform/imsettings", { waitUntil: "networkidle" })
  await selectPlatformByCode(page, platformCode)
}

const toAllAgentSettings = async (allAgentResponse) => {
  let result = await allAgentResponse.json()
  let record = {}
  record = result.brandAllAgentGameTypes.reduce(
    (gameType, { allAgentGameType, ...setting }) => {
      Reflect.set(gameType, allAgentGameType, setting)
      return gameType
    },
    record
  )

  return {
    switch: result.switch,
    ...record
  }
}
