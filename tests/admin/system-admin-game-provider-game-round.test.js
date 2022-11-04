import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import { selectByLabel, selectByValue } from "../page/select.js"
import numeral from "numeral"

const test = base.extend(Fixture)

test("system admin > game provider round", async ({
  page,
  player,
  backofficeApi,
  sboGameProviderApi
}) => {
  let walletAmount = 100
  await Promise.all([
    backofficeApi.player.addBalance(player.code, {
      amount: walletAmount
    }),
    page.goto("/systemadmin/gameproviderround", { waitUntil: "networkidle" })
  ])

  let betAmount = 10
  let betResult = await sboGameProviderApi.placeLoseBet({
    amount: betAmount,
    playerCode: player.code
  })

  await searchRound(page, player)

  await viewGameRoundDialog({ page, player, betAmount, betResult })
})

const searchRound = async (page, player) => {
  await page.fill(`input[name="playerCode"]`, player.code)

  //TODO: use api to get game provider id and select option by value(id)?
  let gameProviderLabel = "SBOBET"
  await selectByLabel(page, `select[name="gameProviderId"]`, gameProviderLabel)

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

const viewGameRoundDialog = async ({ page, player, betAmount, betResult }) => {
  let GameRoundDialog = `#game-round-dialog`
  await openDialog(page, GameRoundDialog)

  let betAmountLocator = page.locator(`${GameRoundDialog} #bet-amount`)
  let betAmountString = await betAmountLocator.textContent()
  expect(numeral(betAmountString).value()).to.equals(betAmount)
}
