import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import numeral from "numeral"

const test = base.extend(Fixture)

test("view platform order report", async ({
  page,
  platform,
  player,
  backofficeApi
}) => {
  let [expectedRound] = await Promise.all([
    backofficeApi.game.round.add(platform.id, { playerCode: player.code }),
    page.goto("/report/orderreport", { waitUntil: "networkidle" })
  ])
  await selectPlatformByCode(page, platform.code)

  await searchPlayer(page, player)

  await viewGameRoundDialog({ page, player, expectedRound })
})

const searchPlayer = async (page, player) => {
  await page.fill(`input[name="username"]`, player.username)
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/RoundReport?`) &&
        response.status() === 200
      )
    }),
    page.click(`button[type="submit"]`)
  ])
}

const viewGameRoundDialog = async ({ page, player, expectedRound }) => {
  let GameRoundDialog = `#game-round-dialog`
  await openDialog(page, GameRoundDialog)

  let betAmountLocator = page.locator(`${GameRoundDialog} #bet-amount`)
  let betAmountString = await betAmountLocator.textContent()
  expect(numeral(betAmountString).value()).to.equals(expectedRound.betAmount)
}
