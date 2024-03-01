import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import {
  gotoPlatformListPage,
  searchPlatform,
  updatePlatform
} from "./platform-list-page.js"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test("search player id form list", async ({
  page,
  reviewPlayerIdPlatform,
  operatorApi,
  brandCertApi
}) => {
  let platform = reviewPlayerIdPlatform
  let platformCode = platform.code
  let platformToken = await brandCertApi.platformToken(platform.code)

  let player = await operatorApi.player.createAndLogin(platformToken)

  let [playerIdentity] = await Promise.all([
    operatorApi.player.updateIdentity(platformToken, player.token),
    gotoPlayerIdentityListPage(page, platformCode)
  ])

  await searchPlayer(page, player)

  let readName = await page
    .locator(`tr td[data-column-id="realName"]`)
    .textContent()
  expect(readName).equals(playerIdentity.realname)

  let id = await page.locator(`tr td[data-column-id="idNumber"]`).textContent()
  expect(id).equals(playerIdentity.id)

  let attachmentUrl = await page
    .locator(`tr td[data-column-id="attachment"] a`)
    .getAttribute("href")
  expect(attachmentUrl).not.empty
})

const searchPlayer = async (page, player) => {
  let usernameSelector = `input[name="username"]`
  await page.fill(usernameSelector, player.username)

  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/playeridentity?`)),
    page.click(`button[type="submit"]`)
  ])
}

export const gotoPlayerIdentityListPage = async (page, platformCode) => {
  await page.goto("/playermanagement/playeridentity", {
    waitUntil: "networkidle"
  })
  return await selectPlatformByCode(page, platformCode)
}
