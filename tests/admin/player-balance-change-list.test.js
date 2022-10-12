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

test("view player balance change", async ({
  page,
  platformCode,
  player,
  backofficeApi
}) => {
  let AddAmount = 10
  let playerRecord = await backofficeApi.player.getPlayer(player.code)
  let ExpectedBalance = playerRecord.balance + AddAmount
  await Promise.all([
    backofficeApi.player.addBalance(player.code, {
      amount: AddAmount
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

  let amountString = await page
    .locator(
      `${ViewPlayerDialogSelector} table#balanceChange tr[data-row-index="0"] td[data-column-id="amount"] span`
    )
    .textContent()
  let amount = numeral(amountString).value()
  expect(amount).to.equal(AddAmount)
})
