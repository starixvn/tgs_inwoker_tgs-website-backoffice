import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import { random } from "lodash-es"
import { openDialog } from "../page/dialog.js"
import { searchAgent } from "./agent-list-page.js"

const test = base.extend(Fixture)

test("deduct agent balance", async ({
  page,
  agent,
  platformCode,
  backofficeApi
}) => {
  let DepositAmount = 100
  await Promise.all([
    gotoAgentBalanceAdjustmentPage(page, platformCode),
    backofficeApi.agent.addBalance(agent.id, { amount: DepositAmount })
  ])

  await searchAgent(page, agent.username)

  let Selector = `#deduct-balance-dialog`
  await openDialog(page, Selector)

  let option = "Other"
  setTransactionType(page, option)

  let DeductAmount = random(10, DepositAmount)
  await page.fill(`${Selector} input[name="amount"]`, `${DeductAmount}`)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().endsWith(`/api/Agent/${agent.id}/adjust/reduce`) &&
        response.status() === 200
      )
    }),
    page.click(`${Selector} button[type="submit"]`)
  ])

  let agentRecord = await backofficeApi.agent.getAgent(agent.id)
  expect(agentRecord.balance).to.equals(DepositAmount - DeductAmount)
})

const setTransactionType = async (
  page,
  option = "",
  selectSelector = `select[name="transactionType"]`
) => {
  return page.selectOption(selectSelector, option)
}

const deductBalance = async (page, agent) => {
  console.log("TODO: get agent balance by api, check agent balance")
}

const gotoAgentBalanceAdjustmentPage = async (page, platformCode) => {
  await page.goto(`agentmanagement/balanceadjustment`, {
    waitUntil: "networkidle"
  })
  return await selectPlatformByCode(page, platformCode)
}
