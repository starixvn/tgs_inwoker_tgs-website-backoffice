import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import numeral from "numeral"
import {
  gotoAgentListPage,
  searchAgent,
  openViewAgentDialog
} from "./agent-list-page.js"

const test = base.extend(Fixture)

test("view agent balance change list", async ({
  page,
  platformCode,
  agent,
  backofficeApi
}) => {
  let AddBalanceAmount = 100
  let ExpectedBalanceAmount = agent.balance + AddBalanceAmount
  await Promise.all([
    backofficeApi.agent.addBalance(agent.id, { amount: AddBalanceAmount }),
    gotoAgentListPage(page, platformCode)
  ])
  await searchAgent(page, agent.username)
  let dialogSelector = await openViewAgentDialog(page)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/agent/accountChanges?`) &&
        response.status() === 200
      )
    }),
    page.click(`${dialogSelector} #BalanceChange`)
  ])

  let amountLocator = page.locator(
    `${dialogSelector} [data-column-id="amount"]`
  )
  console.log("agent balance change > ", agent.username)
  let amountString = await amountLocator.first().textContent()
  let amount = new numeral(amountString).value()
  expect(amount).to.equals(ExpectedBalanceAmount)
})
