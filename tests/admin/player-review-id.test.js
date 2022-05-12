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

const test = base.extend(Fixture)

test("review player id", async ({
  page,
  platformCode,
  platformToken,
  player,
  operatorApi
}) => {
  await gotoPlatformListPage(page)
  await searchPlatform(page, platformCode)
  await updatePlatform(page, { enablePlayerIdentity: true })

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
    page.click(`${ReviewDialogSelector} button[data-type="approve"]`)
  ])
  let result = await reviewResponse.json()
  expect(result.valid).to.equal(true)

  await gotoPlatformListPage(page)
  await searchPlatform(page, platformCode)
  await updatePlatform(page, { enablePlayerIdentity: false })
})

const searchPlayer = async (page, player) => {
  let usernameSelector = `input[name="username"]`
  await page.fill(usernameSelector, player.username)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/playeridentity?`) &&
        response.status() === 200
      )
    }),
    page.click(`button[type="submit"]`)
  ])
}

export const gotoPlayerIdentityListPage = async (page, platformCode) => {
  await page.goto("/playermanagement/playeridentity", {
    waitUntil: "networkidle"
  })
  return await selectPlatformByCode(page, platformCode)
}
