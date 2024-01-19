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
import { urlIncludes } from "../page/response.js"

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

  let dialogSelector = await openViewAgentDialog(page, agent)

  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/agent/accountChanges?`)),
    page.click(`${dialogSelector} #BalanceChange`)
  ])

  let amountString = await page
    .locator(
      `${dialogSelector} table#balanceChange tr[data-row-index="0"] [data-column-id="amount"] span`
    )
    .textContent()
  let amount = new numeral(amountString).value()
  expect(amount).to.equals(
    AddBalanceAmount,
    `amount in string ${amountString}, expected amount ${AddBalanceAmount}, agent username ${agent.username}`
  )
})
