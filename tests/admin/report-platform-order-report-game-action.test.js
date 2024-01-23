import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import numeral from "numeral"
import { urlIncludes } from "../page/response.js"

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

  await viewGameActionDialog({ page, player, betAmount, betResult })
})

const searchPlayer = async (page, player) => {
  await page.fill(`input[name="username"]`, player.username)
  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/RoundReport?`)),
    page.click(`button[type="submit"]`)
  ])
}

const viewGameActionDialog = async ({ page, player, betAmount, betResult }) => {
  let GameActionDialogSelector = `#game-action-dialog`
  await openDialog(page, GameActionDialogSelector)

  let TableSelector = `#game-action`
  let txLocator = page.locator(
    `${GameActionDialogSelector} ${TableSelector} td[data-column-id="externalTransactionId"]`
  )
  let txCount = await txLocator.count()
  expect(txCount).to.be.above(0)

  let afterBalanceLocator = page
    .locator(
      `${GameActionDialogSelector} ${TableSelector} td[data-column-id="afterBalance"]`
    )
    .first()
  let afterBalanceString = await afterBalanceLocator.textContent()
  let afterBalance = numeral(afterBalanceString).value()
  expect(afterBalance).to.equal(betResult.balance)
}
