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

const test = base.extend(Fixture)
const { finance } = faker

console.log("TODO: audit clear bucket")
test.skip("fund withdraw > audit clear bucket", async ({
  page,
  platform,
  platformToken,
  player,
  backofficeApi,
  operatorApi,
  sboGameProviderApi,
  promotionSetting
}) => {
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

  let { externalRoundId, ...result } = await sboGameProviderApi.placeBet({
    amount: DepositAmount,
    playerCode: player.code
  })

  await backofficeApi.player.addBalance(player.code, {
    amount: DepositAmount
  })

  let balance = await operatorApi.wallet(platformToken, player.token)
  let withdrawAmount = DepositAmount
  let WithdrawFormId = await operatorApi.withdraw.applyManualWithdraw(
    platformToken,
    player.token,
    {
      amount: withdrawAmount
    }
  )

  console.log("player", player)
  // await searchByFormId(page, formId)
})
