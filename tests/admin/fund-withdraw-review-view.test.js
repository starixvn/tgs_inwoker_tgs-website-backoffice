import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { openDialog } from "../page/dialog.js"
import {
  gotoFundWithdraw,
  searchByFormId,
  reviewPaid
} from "./fund-withdraw-page.js"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test("fund withdraw", async ({
  page,
  platform,
  platformToken,
  player,
  backofficeApi,
  operatorApi
}) => {
  let depositAmount = 100
  await Promise.all([
    gotoFundWithdraw(page, platform.code),
    operatorApi.player.addManualBankCard(platformToken, player.token),
    backofficeApi.player.addBalance(player.code, {
      amount: depositAmount
    })
  ])

  let withdrawAmount = depositAmount
  let formId = await operatorApi.withdraw.applyManualWithdraw(
    platformToken,
    player.token,
    {
      amount: withdrawAmount
    }
  )

  await searchByFormId(page, formId)

  let DialogSelector = `#view-withdraw-dialog`
  let [response] = await Promise.all([
    page.waitForResponse(urlIncludes(`/api/withdraw/${platform.id}/${formId}`)),
    openDialog(page, DialogSelector)
  ])

  let status = await page
    .locator(`${DialogSelector} [data-status]`)
    .getAttribute("data-status")

  expect(status).equals("Review")
})
