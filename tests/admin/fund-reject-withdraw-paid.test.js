import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import numeral from "numeral"
import faker from "faker"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import { selectByValue } from "../page/multi-select.js"
import {
  gotoFundWithdraw,
  approveWithdraw,
  reviewPaid
} from "./fund-withdraw-page.js"

const test = base.extend(Fixture)
const { finance } = faker

test("reject withdraw paid", async ({
  page,
  platformCode,
  platformToken,
  player,
  operatorApi,
  backofficeApi
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

  let Reject = "Reject"
  await reviewPaid(page, platformCode, formId, Reject)

  let Rejected = "Rejected"
  await selectByValue(page, `#status-select`, Rejected)
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/withdraw/${brandId}?`) &&
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
  expect(status).to.equals(Rejected)
})
