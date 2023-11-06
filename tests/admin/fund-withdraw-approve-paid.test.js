import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import numeral from "numeral"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import { selectByValue } from "../page/multi-select.js"
import { gotoFundWithdraw, reviewPaid } from "./fund-withdraw-page.js"

const test = base.extend(Fixture)

test("approve withdraw paid", async ({
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
  await backofficeApi.fund.withdraw.approve(formId, { brandId: platform.id })

  let Approve = "Approve"
  await reviewPaid(page, platformCode, formId, Approve)

  let Paid = "Paid"
  await selectByValue(page, `#status-select`, Paid)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/withdraw/${platform.id}?`) &&
        response.status() === 200
      )
    }),
    page.click(`button[type="submit"]`)
  ])

  let TableSelector = `#withdraw`
  let statusLocator = page.locator(
    `${TableSelector} [data-column-id="status"] span`
  )
  let status = await statusLocator.getAttribute("data-status")
  expect(status).to.equals(Paid)
})
