import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { faker } from "@faker-js/faker"
import { openDialog } from "../page/dialog.js"
import {
  gotoFundWithdraw,
  searchByFormId,
  reviewPaid
} from "./fund-withdraw-page.js"
import numeral from "numeral"

const test = base.extend(Fixture)

test("fund withdraw > audit clear bucket", async ({
  page,
  autoClearWageringRequirementPlatform: platform,
  autoClearWageringRequirementPlatformDepositPayment: depositPayment,
  backofficeApi,
  brandCertApi,
  operatorApi,
  sboGameProviderApi
}) => {
  let AutoClearBucketAmount = platform.autoClearWageringRequirementBalance
  let platformToken = await brandCertApi.platformToken(platform.code)
  let player = await operatorApi.player.createAndLogin(platformToken)

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

  //Note. after approve, system will clear BucketAmount and add 1x DepositAmount wagering requirement
  await backofficeApi.fund.deposit.approve(depositFormId, {
    brandId: platform.id
  })

  //Note. wait for uncompleteWagering change to 0 by `backofficeApi.player.bucket.clear(player.code)`
  let WaitSecond = 1000
  let playerBucketList = []
  let playerBucket
  let MaxRetry = 20
  let retryCount = 0
  let wageringRequirement
  let uncompleteWagering
  while (
    !(
      Number.isFinite(wageringRequirement) &&
      Number.isFinite(uncompleteWagering) &&
      uncompleteWagering === 0
    ) &&
    retryCount++ < MaxRetry
  ) {
    playerBucketList = await backofficeApi.player.bucket.list(player.code)

    // console.log(`${retryCount}. playerBucketList`, playerBucketList)
    playerBucket = playerBucketList.find(
      (item) => item.wageringRequirement === BucketAmount
    )
    wageringRequirement = playerBucket?.wageringRequirement

    uncompleteWagering = playerBucketList.reduce(
      (uncompleteWagering, bucket) => {
        return uncompleteWagering + bucket.uncompleteWagering
      },
      0
    )

    if (playerBucket?.uncompleteWagering === 0 && uncompleteWagering > 0) {
      await backofficeApi.player.bucket.clear(player.code)
    }

    await page.waitForTimeout(WaitSecond)
  }

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

  let AutoClearBucketTableSelector = `${AuditReportDialogSelector} table#auto-clear-bucket`
  let autoClearBucketId = await page
    .locator(`${AutoClearBucketTableSelector} td[data-column-id="id"]`)
    .textContent()
  expect(autoClearBucketId).not.empty
})
