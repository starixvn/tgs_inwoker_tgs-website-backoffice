import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import numeral from "numeral"
import faker from "faker"
import { selectPlatformByCode } from "../page/content.js"
import { selectByLabel } from "../page/select.js"
import { openDialog } from "../page/dialog.js"
import {
  gotoFundWithdraw,
  approveWithdraw,
  reviewPaid
} from "./fund-withdraw-page.js"

const test = base.extend(Fixture)
const { finance } = faker

test.skip("TODO: approve player fund withdraw and reject paid", async () => {
  let depositAmount = 100
  let [brandId] = await Promise.all([
    gotoFundWithdraw(page, platformCode),
    operatorApi.player.addManualBankCard(platformToken, player.token),
    backofficeApi.player.addBalance(player.code, {
      amount: depositAmount
    })
  ])

  let withdrawAmount = depositAmount
  let formId = await approveWithdraw(
    page,
    operatorApi,
    brandId,
    platformToken,
    player,
    withdrawAmount
  )

  let Reject = "Reject"
  await reviewPaid(page, platformCode, formId, Reject)
  console.warn("add rejected status filter and check status")
})
