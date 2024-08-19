import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import numeral from "numeral"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import { searchByFormId } from "./fund-deposit-page.js"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test("fund deposit search", async ({
  page,
  operatorApi,
  backofficeApi,
  platform,
  platformToken,
  player,
  agent
}) => {
  const ExpectedDepositAmount = 10
  let [brandId, playerBalance, updatePlayerAgentResult] = await Promise.all([
    gotoFundDepositPage(page, platform.code),
    operatorApi.wallet(platformToken, player.token),
    backofficeApi.player.updatePlayerAgent(player.code, agent.username)
  ])

  let formId = await backofficeApi.player.applyBankManualDepositForm({
    brandId: platform.id,
    playerCode: player.code,
    amount: ExpectedDepositAmount
  })

  await searchByFormId(page, formId)

  const ExpectedStatus = "WaitingPayment"

  let TableRowSelector = `table#deposit tbody tr`

  let status = await page
    .locator(`${TableRowSelector} [data-status]`)
    .getAttribute("data-status")
  expect(status).equals(ExpectedStatus)

  let agentUsername = await page
    .locator(`${TableRowSelector} td[data-column-id="agentName"]`)
    .textContent()
  expect(agentUsername).equals(agent.username)
})

const gotoFundDepositPage = async (page, platformCode) => {
  await page.goto(`/fundmanagement/deposit`, { waitUntil: "networkidle" })
  await selectPlatformByCode(page, platformCode)
}
