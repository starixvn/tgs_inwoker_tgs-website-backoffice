import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import numeral from "numeral"

const test = base.extend(Fixture)

test("view platform order report", async ({
  page,
  platformCode,
  player,
  backofficeApi,
  sboGameProviderApi
}) => {
  let walletAmount = 100
  await Promise.all([
    backofficeApi.player.addBalance(player.code, {
      amount: walletAmount
    }),
    page.goto("/report/orderreport", { waitUntil: "networkidle" })
  ])
  let brandId = await selectPlatformByCode(page, platformCode)

  let betAmount = 10
  let betResult = await sboGameProviderApi.placeLoseBet({
    amount: betAmount,
    playerCode: player.code
  })

  await searchPlayer(page, player)

  await viewGameRoundDialog({ page, player, betAmount, betResult })
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

const viewGameRoundDialog = async ({ page, player, betAmount, betResult }) => {
  let GameRoundDialog = `#game-round-dialog`
  await openDialog(page, GameRoundDialog)

  let betAmountLocator = page.locator(`${GameRoundDialog} #bet-amount`)
  let betAmountString = await betAmountLocator.textContent()
  expect(numeral(betAmountString).value()).to.equals(betAmount)
}
