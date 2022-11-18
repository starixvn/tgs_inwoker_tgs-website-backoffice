import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import { random } from "lodash-es"
import { openDialog } from "../page/dialog.js"
import { searchAgent } from "./agent-list-page.js"

const test = base.extend(Fixture)

test("add agent balance", async ({
  page,
  agent,
  platformCode,
  backofficeApi
}) => {
  await gotoAgentBalanceAdjustmentPage(page, platformCode)

  await searchAgent(page, agent.username)

  let Selector = `#add-balance-dialog`
  await openDialog(page, Selector)

  let option = "Other"
  setTransactionType(page, option)

  let amount = random(100, 1000)
  await page.fill(`${Selector} input[name="amount"]`, `${amount}`)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().endsWith(`/api/Agent/${agent.id}/adjust/increase`) &&
        response.status() === 200
      )
    }),
    page.click(`${Selector} button[type="submit"]`)
  ])

  let agentRecord = await backofficeApi.agent.getAgent(agent.id)
  expect(agentRecord.balance).to.equals(amount)
})

const TransactionTypeSelector = `select[name="transactionType"]`
const setTransactionType = async (
  page,
  option = "",
  selectSelector = TransactionTypeSelector
) => {
  return page.selectOption(selectSelector, option)
}

const gotoAgentBalanceAdjustmentPage = async (page, platformCode) => {
  await page.goto(`agentmanagement/balanceadjustment`, {
    waitUntil: "networkidle"
  })
  return await selectPlatformByCode(page, platformCode)
}
