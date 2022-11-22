import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { openDialog } from "../page/dialog.js"
import { selectByLabel, selectFirstValidOption } from "../page/select.js"
import numeral from "numeral"
import { fillDatePicker } from "../fill.js"
import { startOfDay, endOfTomorrow, format } from "date-fns"
import faker from "@faker-js/faker"
import { nanoid } from "nanoid"

const test = base.extend(Fixture)

test("add game round", async ({
  page,
  player,
  backofficeApi,
  sboGameProviderApi
}) => {
  await page.goto("/systemadmin/gameproviderround", {
    waitUntil: "networkidle"
  })

  let AddDialogSelector = `#add-game-provider-round-dialog`
  await openDialog(page, AddDialogSelector)

  await page.fill(`${AddDialogSelector} input[name="playerCode"]`, player.code)

  //TODO: wait sub game provider api?
  await selectFirstValidOption(
    page,
    `${AddDialogSelector} select[name="gameProviderId"]`
  )

  await selectFirstValidOption(
    page,
    `${AddDialogSelector} select[name="subGameProviderCode"]`
  )

  await selectFirstValidOption(
    page,
    `${AddDialogSelector} select[name="subGameProviderCode"]`
  )

  await selectFirstValidOption(
    page,
    `${AddDialogSelector} select[name="gameId"]`
  )

  let externalRoundId = faker.datatype.uuid()
  page.fill(
    `${AddDialogSelector} input[name="externalRoundId"]`,
    externalRoundId
  )

  let externalCreatedOn = format(new Date(), "yyyy/MM/dd")
  await fillDatePicker({
    page,
    selector: `${AddDialogSelector} #externalCreatedOn input[type="text"]`,
    value: externalCreatedOn
  })

  let externalClosedOn = format(new Date(), "yyyy/MM/dd")
  await fillDatePicker({
    page,
    selector: `${AddDialogSelector} #externalClosedOn input[type="text"]`,
    value: externalClosedOn
  })

  let betAmount = 0
  await page.fill(
    `${AddDialogSelector} input[name="betAmount"]`,
    `${betAmount}`
  )

  let validBetAmount = 0
  await page.fill(
    `${AddDialogSelector} input[name="validBetAmount"]`,
    `${validBetAmount}`
  )

  let settleAmount = 0
  await page.fill(
    `${AddDialogSelector} input[name="settleAmount"]`,
    `${settleAmount}`
  )

  let commission = 0
  await page.fill(
    `${AddDialogSelector} input[name="commission"]`,
    `${commission}`
  )

  let turnover = 0
  await page.fill(`${AddDialogSelector} input[name="turnover"]`, `${turnover}`)

  await selectFirstValidOption(
    page,
    `${AddDialogSelector} select[name="clientRoundStatus"]`
  )

  let companyWinLoss = 0
  await page.fill(
    `${AddDialogSelector} input[name="companyWinLoss"]`,
    `${companyWinLoss}`
  )

  let remark = faker.lorem.word()
  await page.fill(`${AddDialogSelector} textarea[name="remark"]`, `${remark}`)

  await page.click(`${AddDialogSelector} button[data-type="confirm"]`)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/RoundReport/system/addround`) &&
        response.status() === 200
      )
    }),
    page.click(`#confirm-dialog button[type="submit"]`)
  ])

  console.log("TODO: get round by api and check expected values")
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
