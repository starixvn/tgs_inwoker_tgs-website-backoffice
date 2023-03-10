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
  operatorApi,
  sboGameProviderApi
}) => {
  let AutoClearBucketAmount = 10
  if (!platform.autoClearWageringRequirement) {
    console.warn(
      "TODO: set platform autoClearWageringRequirement & autoClearWageringRequirementBalance or use new platform?"
    )
    throw "set platform autoClearWageringRequirement & autoClearWageringRequirementBalance"
    /*
    TODO: not work
    await backofficeApi.platform.updatePlatform(platform.id, {
      ...platform,
      autoClearWageringRequirement: true,
      autoClearWageringRequirementBalance: AutoClearBucketAmount
    })
    */

    /*
    platform = await backofficeApi.platform.addPlatform({
      licenseeId: licensee.id,
      autoClearWageringRequirement: true,
      autoClearWageringRequirementBalance: AutoClearBucketAmount
    })
    */
  }

  let BucketAmount = 10000
  await Promise.all([
    gotoFundWithdraw(page, platform.code),
    operatorApi.player.addManualBankCard(platformToken, player.token),
    backofficeApi.player.addBalance(player.code, {
      bucketAmount: BucketAmount
    })
  ])

  const DepositAmount = 10
  let depositFormId = await backofficeApi.player.applyBankManualDepositForm({
    brandId: platform.id,
    playerCode: player.code,
    amount: DepositAmount
  })

  await backofficeApi.fund.deposit.approve(depositFormId, {
    brandId: platform.id
  })

  let betAmount = DepositAmount
  await Promise.all([
    sboGameProviderApi.placeBet({
      amount: betAmount,
      playerCode: player.code
    }),
    backofficeApi.player.addBalance(player.code, {
      amount: DepositAmount
    })
  ])

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

  let OpenOrderTableSelector = `${AuditReportDialogSelector} table#open-order`
  let openOrderBetAmountString = await page
    .locator(`${OpenOrderTableSelector} td[data-column-id="betAmount"]`)
    .textContent()
  let openOrderBetAmount = numeral(openOrderBetAmountString).value()
  expect(openOrderBetAmount).equals(betAmount)

  let AutoClearBucketTableSelector = `${AuditReportDialogSelector} table#auto-clear-bucket`
  let autoClearBucketId = await page
    .locator(`${AutoClearBucketTableSelector} td[data-column-id="id"]`)
    .textContent()
  expect(autoClearBucketId).not.empty
})
