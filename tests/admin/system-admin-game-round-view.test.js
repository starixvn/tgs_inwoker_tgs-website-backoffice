import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import { selectByLabel, selectByValue } from "../page/select.js"
import numeral from "numeral"

const test = base.extend(Fixture)

test("view game round", async ({ page, platform, player, backofficeApi }) => {
  let gameProvider = await backofficeApi.gameProvider.random()
  let [expectedRound] = await Promise.all([
    backofficeApi.game.round.add(platform.id, {
      playerCode: player.code,
      gameProviderId: gameProvider.id
    }),
    page.goto("/systemadmin/gameproviderround", { waitUntil: "networkidle" })
  ])

  await searchRound(page, player, gameProvider)

  await viewGameRoundDialog({ page, player, expectedRound })
})

const searchRound = async (page, player, gameProvider) => {
  await page.fill(`input[name="playerCode"]`, player.code)

  await selectByValue(page, `select[name="gameProviderId"]`, gameProvider.id)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/RoundReport/system?`) &&
        response.status() === 200
      )
    }),
    page.click(`button[type="submit"]`)
  ])

  let FirstRowSelector = `table tbody tr[data-row-index="0"] `

  let playerCode = await page.textContent(
    `${FirstRowSelector} td[data-column-id="playerCode"]`
  )
  expect(playerCode).equals(player.code)
}

const viewGameRoundDialog = async ({ page, player, expectedRound }) => {
  let GameRoundDialog = `#game-round-dialog`
  await openDialog(page, GameRoundDialog)

  let betAmountLocator = page.locator(`${GameRoundDialog} #bet-amount`)
  let betAmountString = await betAmountLocator.textContent()
  expect(numeral(betAmountString).value()).to.equals(expectedRound.betAmount)
}
