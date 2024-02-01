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

test("review player id", async ({
  page,
  licensee,
  backofficeApi,
  operatorApi,
  brandCertApi
}) => {
  let platform = await backofficeApi.platform.addPlatform({
    licenseeId: licensee.id,
    enablePlayerIdentity: true
  })
  let platformCode = platform.code
  let platformToken = await brandCertApi.platformToken(platform.code)

  let player = await operatorApi.player.createAndLogin(platformToken)
  let [playerIdentity] = await Promise.all([
    operatorApi.player.updateIdentity(platformToken, player.token),
    gotoPlayerIdentityListPage(page, platformCode)
  ])

  await searchPlayer(page, player)
  let ReviewDialogSelector = "#review-player-id-dialog"

  let [identidyResponse] = await Promise.all([
    page.waitForResponse((response) => {
      return (
        response
          .url()
          .includes(`/api/playeridentity/${player.code}/identity`) &&
        response.status() === 200
      )
    }),
    openDialog(page, ReviewDialogSelector)
  ])
  let identidyResult = await identidyResponse.json()

  let realNameLocator = page.locator(
    `${ReviewDialogSelector} input[name="realName"]`
  )
  let realName = await realNameLocator.inputValue()
  expect(realName).to.equals(playerIdentity.realname)

  let idLocator = page.locator(`${ReviewDialogSelector} input[name="idNumber"]`)
  let id = await idLocator.inputValue()
  expect(id).to.equals(playerIdentity.id)

  let [reviewResponse] = await Promise.all([
    page.waitForResponse((response) => {
      return (
        response
          .url()
          .includes(`/api/playeridentity/${identidyResult.formId}`) &&
        response.status() === 200
      )
    }),
    page.click(`${ReviewDialogSelector} button[data-type="reject"]`)
  ])
  let result = await reviewResponse.json()
  expect(result.valid).to.equal(true)
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
