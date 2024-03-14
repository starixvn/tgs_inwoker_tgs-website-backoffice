import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import numeral from "numeral"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import { selectByValue } from "../page/multi-select.js"
import {
  gotoFundWithdraw,
  searchByFormId,
  reviewPaid
} from "./fund-withdraw-page.js"
import { urlIncludes } from "../page/response.js"
import { faker } from "@faker-js/faker"

const test = base.extend(Fixture)

test("reject withdraw form", async ({
  page,
  platform,
  platformCode,
  platformToken,
  player,
  operatorApi,
  backofficeApi
}) => {
  let depositAmount = 100
  await Promise.all([
    gotoFundWithdraw(page, platformCode),
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
  let DialogSelector = `#verify-withdraw-dialog`
  await openDialog(page, DialogSelector)

  let csRemark = faker.lorem.word()
  await page.locator(`${DialogSelector} textarea[name="remark"]`).fill(csRemark)

  let playerRemark = faker.lorem.word()
  await page
    .locator(`${DialogSelector} textarea[name="playerRemark"]`)
    .fill(playerRemark)

  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/withdraw/${formId}`)),
    page.locator(`${DialogSelector} button[data-type="reject"]`).click()
  ])

  let ExpectedStatus = "Rejected"
  let withdrawForm = await backofficeApi.fund.withdraw.form(platform.id, formId)

  expect(withdrawForm.status).equals(ExpectedStatus)
  expect(withdrawForm.remark).equals(csRemark)
  expect(withdrawForm.playerRemark).equals(playerRemark)
})
