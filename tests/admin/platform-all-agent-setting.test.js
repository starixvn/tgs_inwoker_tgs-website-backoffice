import base from "@playwright/test"
import { Fixture } from "./auth.js"
import clone from "clone-deep"
import { selectRandomPlatform } from "../page/content.js"
import { openDialog } from "../page/dialog.js"

const test = base.extend(Fixture)

test("update all agent settings", async ({ page }) => {
  let brandId = await gotoPlatformOperationSettingPage(page)

  let [allAgentSettingsReponse] = await Promise.all([
    page.waitForResponse((response) => {
      let expectedUrl = `/api/BrandAllAgent/${brandId}`
      return response.url().endsWith(expectedUrl) && response.status() === 200
    }),
    openDialog(page, "#all-agent-setting-dialog")
  ])

  let allAgentSetting = await toAllAgentSettings(allAgentSettingsReponse)
  //TODO: 1. open valid bet dialog to get settings and close
  //TODO: 2. open win loss dialog to get settings and close
  //TODO: 3. merge all responses??
})

const gotoPlatformOperationSettingPage = async (page) => {
  await page.goto("/platform/imsettings", { waitUntil: "networkidle" })
  let brandId = await selectRandomPlatform(page)
  return brandId
}

const toAllAgentSettings = async (allAgentResponse) => {
  let result = await allAgentResponse.json()
  let gameType = {}
  gameType = result.brandAllAgentGameTypes.reduce(
    (gameType, { allAgentGameType, ...setting }) => {
      Reflect.set(gameType, allAgentGameType, setting)
      return gameType
    },
    gameType
  )

  return {
    src: clone(result),
    mainSwitch: result.switch,
    gameType
  }
}
