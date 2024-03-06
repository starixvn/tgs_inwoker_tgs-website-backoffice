import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { openDialog } from "../page/dialog.js"
import {
  gotoFundWithdraw,
  searchByFormId,
  reviewPaid
} from "./fund-withdraw-page.js"
import numeral from "numeral"

const test = base.extend(Fixture)

test("fund withdraw > open order", async ({
  page,
  licensee,
  platform,
  platformToken,
  player,
  backofficeApi,
  customBankManualPaymentMethodChannel,
  operatorApi,
  sboGameProviderApi
}) => {
  let gpiPlatform = platform

  const DepositAmount = 10
  await Promise.all([
    gotoFundWithdraw(page, platform.code),
    operatorApi.player.addManualBankCard(platformToken, player.token),
    backofficeApi.player.addBalance(player.code, {
      amount: DepositAmount
    })
  ])

  let betAmount = DepositAmount
  let [{ externalRoundId, ...betResult }] = await Promise.all([
    sboGameProviderApi.placeBet({
      amount: betAmount,
      playerCode: player.code
    }),
    backofficeApi.player.addBalance(player.code, {
      amount: DepositAmount
    }),
    backofficeApi.player.bucket.clear(player.code)
  ])

  let withdrawAmount = 10
  let WithdrawFormId = await operatorApi.withdraw.applyManualWithdraw(
    platformToken,
    player.token,
    {
      amount: withdrawAmount
    }
  )

  await searchByFormId(page, WithdrawFormId)
  let VerifyDialogSelector = `#verify-withdraw-dialog`
  await openDialog(page, VerifyDialogSelector)

  let AuditReportDialogSelector = `#audit-auto-clear-bucket-dialog`
  await openDialog(page, AuditReportDialogSelector)

  let OpenOrderTableSelector = `${AuditReportDialogSelector} table#open-order`
  let openOrderBetAmountString = await page
    .locator(`${OpenOrderTableSelector} td[data-column-id="betAmount"]`)
    .textContent()
  let openOrderBetAmount = numeral(openOrderBetAmountString).value()
  expect(openOrderBetAmount).equals(betAmount)
})
