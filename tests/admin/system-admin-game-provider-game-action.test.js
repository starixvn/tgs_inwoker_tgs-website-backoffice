import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import { selectByLabel, selectByValue } from "../page/select.js"
import numeral from "numeral"
import { urlIncludes } from "../page/response.js"

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

  await viewGameActionDialog({ page, player, betAmount, betResult })
})

const searchRound = async (page, player) => {
  await page.fill(`input[name="playerCode"]`, player.code)

  //TODO: use api to get game provider id and select option by value(id)?
  let gameProviderLabel = "SBOBET"
  await selectByLabel(page, `select[name="gameProviderId"]`, gameProviderLabel)

  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/RoundReport/system?`)),
    page.click(`button[type="submit"]`)
  ])

  let FirstRowSelector = `table tbody tr[data-row-index="0"] `

  let playerCode = await page.textContent(
    `${FirstRowSelector} td[data-column-id="playerCode"]`
  )
  expect(playerCode).equals(player.code)
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
