import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import faker from "@faker-js/faker"
import { openDialog } from "../page/dialog.js"
import {
  gotoFundWithdraw,
  searchByFormId,
  reviewPaid
} from "./fund-withdraw-page.js"
import numeral from "numeral"

const test = base.extend(Fixture)
const { finance } = faker

test("fund withdraw > audit clear bucket", async ({
  page,
  licensee,
  platform,
  platformToken,
  player,
  backofficeApi,
  customBankManualPaymentMethodChannel,
  globalApi,
  operatorApi,
  sboGameProviderApi
}) => {
  let gpiPlatform = platform
  let AutoClearBucketAmount = 10
  let depositPayment
  let withdrawPayment
  if (!platform.autoClearWageringRequirement) {
    platform = await backofficeApi.platform.addPlatform({
      licenseeId: licensee.id,
      autoClearWageringRequirement: true,
      autoClearWageringRequirementBalance: AutoClearBucketAmount
    })

    platformToken = await globalApi.platformToken(platform.code)
    player = await operatorApi.player.createAndLogin(platformToken)

    depositPayment = await backofficeApi.platform.payment.findOrCreate({
      brandId: platform.id,
      transferType: backofficeApi.platform.payment.TransferType.Deposit,
      paymentMethodChannelId: customBankManualPaymentMethodChannel.id,
      extendedData: {
        name: finance.accountName(),
        bankAccount: finance.account()
      }
    })

    withdrawPayment = await backofficeApi.platform.payment.findOrCreate({
      brandId: platform.id,
      transferType: backofficeApi.platform.payment.TransferType.Withdrawal,
      paymentMethodChannelId: customBankManualPaymentMethodChannel.id
    })
  }

  let BucketAmount = 10000
  await Promise.all([
    gotoFundWithdraw(page, platform.code),
    operatorApi.player.addManualBankCard(platformToken, player.token),
    backofficeApi.player.addBalance(player.code, {
      bucketAmount: BucketAmount
    })
  ])

  const DepositAmount = AutoClearBucketAmount - 1
  let depositFormId = await backofficeApi.player.applyBankManualDepositForm({
    brandId: platform.id,
    playerCode: player.code,
    amount: DepositAmount,
    brandPaymentId: depositPayment?.id
  })

  //TODO: get bucket before

  await backofficeApi.fund.deposit.approve(depositFormId, {
    brandId: platform.id
  })

  //TODO: get bucket after

  let betAmount = DepositAmount
  let [{ externalRoundId, ...betResult }] = await Promise.all([
    sboGameProviderApi.placeBet({
      amount: betAmount,
      playerCode: player.code
    }),
    backofficeApi.player.addBalance(player.code, {
      amount: DepositAmount
    })
  ])

  await page.waitForTimeout(2000)

  let withdrawAmount = DepositAmount
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

  //TODO: test open order condition based on betResult instead of compare platform code
  if (gpiPlatform.code == platform.code) {
    let OpenOrderTableSelector = `${AuditReportDialogSelector} table#open-order`
    let openOrderBetAmountString = await page
      .locator(`${OpenOrderTableSelector} td[data-column-id="betAmount"]`)
      .textContent()
    let openOrderBetAmount = numeral(openOrderBetAmountString).value()
    expect(openOrderBetAmount).equals(betAmount)
  }

  /*
  let AutoClearBucketTableSelector = `${AuditReportDialogSelector} table#auto-clear-bucket`
  let autoClearBucketId = await page
    .locator(`${AutoClearBucketTableSelector} td[data-column-id="id"]`)
    .textContent()
  expect(autoClearBucketId).not.empty
  */
})
