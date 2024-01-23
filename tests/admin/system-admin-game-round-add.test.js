import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { openDialog } from "../page/dialog.js"
import { selectByLabel, selectFirstValidOption } from "../page/select.js"
import numeral from "numeral"
import { fillDatePicker } from "../fill.js"
import { startOfDay, endOfTomorrow, format } from "date-fns"
import { faker } from "@faker-js/faker"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test("add game round", async ({ page, platform, player, backofficeApi }) => {
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

  let externalRoundId = faker.string.uuid()
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

  let betAmount = 1
  await page.fill(
    `${AddDialogSelector} input[name="betAmount"]`,
    `${betAmount}`
  )

  let validBetAmount = 1
  await page.fill(
    `${AddDialogSelector} input[name="validBetAmount"]`,
    `${validBetAmount}`
  )

  let settleAmount = 1
  await page.fill(
    `${AddDialogSelector} input[name="settleAmount"]`,
    `${settleAmount}`
  )

  let commission = 1
  await page.fill(
    `${AddDialogSelector} input[name="commission"]`,
    `${commission}`
  )

  let turnover = 1
  await page.fill(`${AddDialogSelector} input[name="turnover"]`, `${turnover}`)

  await selectFirstValidOption(
    page,
    `${AddDialogSelector} select[name="clientRoundStatus"]`
  )

  let companyWinLoss = 1
  await page.fill(
    `${AddDialogSelector} input[name="companyWinLoss"]`,
    `${companyWinLoss}`
  )

  let remark = faker.lorem.word()
  await page.fill(`${AddDialogSelector} textarea[name="remark"]`, `${remark}`)

  await page.click(`${AddDialogSelector} button[data-type="confirm"]`)

  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/RoundReport/system/addround`)),
    page.click(`#confirm-dialog button[type="submit"]`)
  ])

  let round = await backofficeApi.game.round.findByExternalRoundId({
    brandId: platform.id,
    externalRoundId
  })

  expect(round.betAmount).to.equals(betAmount)
  expect(round.validBetAmount).to.equals(validBetAmount)
  expect(round.settleAmount).to.equals(settleAmount)
  //TODO: get data by detail api?
  // expect(round.commission).to.equals(commission)
  expect(round.turnover).to.equals(turnover)
  //TODO: get data by detail api?
  // expect(round.companyWinLoss).to.equals(companyWinLoss)
})
