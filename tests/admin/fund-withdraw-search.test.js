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

test("fund withdraw search", async ({
  page,
  platform,
  platformToken,
  player,
  agent,
  backofficeApi,
  operatorApi
}) => {
  let depositAmount = 100
  await Promise.all([
    gotoFundWithdraw(page, platform.code),
    operatorApi.player.addManualBankCard(platformToken, player.token),
    backofficeApi.player.addBalance(player.code, {
      amount: depositAmount
    }),
    backofficeApi.player.updatePlayerAgent(player.code, agent.username)
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

  const ExpectedStatus = "Review"

  let TableRowSelector = `table#withdraw tbody tr`
  let status = await page
    .locator(`${TableRowSelector} [data-status]`)
    .getAttribute("data-status")
  expect(status).equals(ExpectedStatus)

  let agentUsername = await page
    .locator(`${TableRowSelector} td[data-column-id="agentName"]`)
    .textContent()
  expect(agentUsername).equals(agent.username)
})
