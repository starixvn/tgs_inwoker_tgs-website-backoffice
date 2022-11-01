import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { random } from "lodash-es"

const test = base.extend(Fixture)

test("download & upload game localization", async ({ page, backofficeApi }) => {
  await gotoSystemAdminGameProviderPage(page)

  await openRandomGameProviderGameListDialog(page)

  let [download] = await Promise.all([
    page.waitForEvent("download"),
    page.click(`#game-localization-menu`),
    page.click(`#export-game-localization`)
  ])

  let path = await download.path()
  expect(path).to.be.not.empty

  //TODO: download and transform to buffer > file upload with buffer
})

const gotoSystemAdminGameProviderPage = async (page) => {
  await page.goto("/systemadmin/gameproviders", { waitUntil: "networkidle" })
  await page.waitForSelector("#game-provider tbody")
}

const getGameProviderCodes = async (page) => {
  return await page.locator(`[data-column-id="code"]`).allTextContents()
}

const openRandomGameProviderGameListDialog = async (page) => {
  let gameProviderCodes = await getGameProviderCodes(page)
  let index = random(gameProviderCodes.length - 1)

  let gameProviderCode = gameProviderCodes[index]
  await showGameListDialog(page, gameProviderCode)
}

const showGameListDialog = async (page, gameProviderCode) =>
  await Promise.all([
    await page.click(
      `#game-list-dialog-disclosure[data-game-provider-code="${gameProviderCode}"]`
    ),
    page.waitForLoadState("networkidle"),
    page.waitForSelector(`#game-list-dialog #game-list tbody`)
  ])
