import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import numeral from "numeral"
import {
  gotoPlayerListPage,
  searchPlayer,
  ViewPlayerDialogSelector
} from "./player-list-page.js"

const test = base.extend(Fixture)

test("view player balance change: Adjust", async ({
  page,
  platformCode,
  player,
  backofficeApi
}) => {
  let ExpectedAmount = 10
  await Promise.all([
    backofficeApi.player.addBalance(player.code, {
      amount: ExpectedAmount
    }),
    gotoPlayerListPage(page, platformCode)
  ])

  await searchPlayer(page, player)
  await openDialog(page, ViewPlayerDialogSelector)

  let BalanceChangeTabSelector = `${ViewPlayerDialogSelector} button#BalanceChange`
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/player/accountChanges?`) &&
        response.status() === 200
      )
    }),
    page.click(BalanceChangeTabSelector)
  ])

  let AmountSelector = `${ViewPlayerDialogSelector} td[data-column-id="amount"]`
  let amountString = await page.textContent(AmountSelector)
  let amount = numeral(amountString).value()
  expect(amount).to.equal(ExpectedAmount)
})
