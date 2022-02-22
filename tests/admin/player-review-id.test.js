import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import { gotoPlayerListPage, searchPlayer } from "./player-list-page.js"

const test = base.extend(Fixture)

test("review player id", async ({
  page,
  platformCode,
  platformToken,
  player,
  operatorApi
}) => {
  await Promise.all([
    operatorApi.player.uploadIdentity(platformToken, player.token),
    gotoPlayerListPage(page, platformCode)
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
})
