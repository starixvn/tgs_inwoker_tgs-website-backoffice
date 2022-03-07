import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import numeral from "numeral"
import {
  ViewPlayerDialogSelector,
  gotoPlayerListPage,
  searchPlayer
} from "./player-list-page.js"

const test = base.extend(Fixture)

test("view player betting list and betting detail", async ({
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
    gotoPlayerListPage(page, platformCode)
  ])

  let ExpectedBetAmount = 10
  let [winResult] = await Promise.all([
    sboGameProviderApi.placeWinBet({
      amount: ExpectedBetAmount,
      playerCode: player.code
    }),
    searchPlayer(page, player)
  ])

  await openDialog(page, ViewPlayerDialogSelector)

  let BettingTabSelector = `${ViewPlayerDialogSelector} button#betting`
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/RoundReport?`) &&
        response.status() === 200
      )
    }),
    page.click(BettingTabSelector)
  ])

  let BetAmountSelector = `${ViewPlayerDialogSelector} td[data-column-id="betAmount"]`
  let betAmountString = await page.textContent(BetAmountSelector)
  let betAmount = numeral(betAmountString).value()
  expect(betAmount).to.equal(ExpectedBetAmount)

  /*
  TODO: FIX local env
  let BettingDialogSelector = `#betting-detail-dialog`
  await openDialog(page, BettingDialogSelector)

  let DetailBetAmountSelector = `${BettingDialogSelector} #bet-amount`
  let detailBetAmountString = await page.textContent(DetailBetAmountSelector)
  let detailBetAmount = numeral(detailBetAmountString).value()
  expect(detailBetAmount).to.equal(ExpectedBetAmount)
  */
})
