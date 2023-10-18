import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { openDialog } from "../page/dialog.js"
import {
  gotoFundWithdraw,
  searchByFormId,
  reviewPaid
} from "./fund-withdraw-page.js"

const test = base.extend(Fixture)

test("fund withdraw download", async ({
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
  let [download] = await Promise.all([
    page.waitForEvent("download"),
    page.click(`#export-report`)
  ])

  let path = await download.path()
  expect(path).to.be.not.empty
})
