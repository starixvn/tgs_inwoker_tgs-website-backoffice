import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import numeral from "numeral"
import faker from "@faker-js/faker"
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

test("approve player fund withdraw and paid", async ({
  page,
  platformCode,
  platformToken,
  player,
  backofficeApi,
  operatorApi
}) => {
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

  let Approve = "Approve"
  await reviewPaid(page, platformCode, formId, Approve)
})
