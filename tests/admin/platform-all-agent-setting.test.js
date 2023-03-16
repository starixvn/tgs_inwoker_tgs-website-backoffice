import base from "@playwright/test"
import { Fixture } from "./auth.js"
import clone from "clone-deep"
import { selectRandomPlatform } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import { expect } from "chai"

const test = base.extend(Fixture)

test("update all agent settings", async ({ page }) => {
  let brandId = await gotoPlatformOperationSettingPage(page)

  let DialogSelector = "#all-agent-setting-dialog"
  let [allAgentSettingsReponse] = await Promise.all([
    page.waitForResponse((response) => {
      let expectedUrl = `/api/BrandAllAgent/${brandId}`
      return response.url().endsWith(expectedUrl) && response.status() === 200
    }),
    openDialog(page, DialogSelector)
  ])

  let allAgentSetting = await toAllAgentSettings(allAgentSettingsReponse)

  allAgentSetting.switch = !allAgentSetting.switch
  let MainSwitchSelector = `${DialogSelector} #main-switch input[type="checkbox"]`
  await Promise.all([
    page.waitForResponse((response) => {
      let expectedUrl = `/api/BrandAllAgent/${brandId}`
      return response.url().endsWith(expectedUrl) && response.status() === 200
    }),
    page.click(`${MainSwitchSelector} + div.bb-SwitchIcon`)
  ])

  let isChecked = await page.locator(MainSwitchSelector).isChecked()
  expect(isChecked).equals(allAgentSetting.switch)

  const GameType = "LiveDealer"
  let gameTypeSettings = Reflect.get(allAgentSetting, GameType)
  console.log("gameTypeSettings", gameTypeSettings)

  let expectedGameTypeSettings = {
    switch: !gameTypeSettings.switch,
    hasValidBet: !gameTypeSettings.hasValidBet
  }

  let GameTypeFormSelector = `${DialogSelector} form#${GameType}`
  let GameTypeSwitchSelector = `${GameTypeFormSelector} .bb-Switch input[type="checkbox"]`
  await page.click(`${GameTypeSwitchSelector} + div.bb-SwitchIcon`)

  let HasValidBetSelector = `${GameTypeFormSelector} input[name="hasValidBet"]`
  await page.click(`${HasValidBetSelector} + .bb-CheckboxIcon`)

  await Promise.all([
    page.waitForResponse((response) => {
      let expectedUrl = `/api/BrandAllAgent/${brandId}`
      return response.url().endsWith(expectedUrl) && response.status() === 200
    }),
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

const gotoPlatformOperationSettingPage = async (page) => {
  await page.goto("/platform/imsettings", { waitUntil: "networkidle" })
  let brandId = await selectRandomPlatform(page)
  return brandId
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
