import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { faker } from "@faker-js/faker"
import { selectPlatformByCode } from "../page/content.js"
import {
  gotoAgentListPage,
  searchAgent,
  openEditAgentDialog,
  openViewAgentDialog
} from "./agent-list-page.js"
import { openDialog } from "../page/dialog.js"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test("change agent withdraw password", async ({
  page,
  platformCode,
  agent,
  backofficeApi
}) => {
  await gotoAgentListPage(page, platformCode)
  await searchAgent(page, agent.username)

  let dialogSelector = await openEditAgentDialog(page)
  await page.click(`${dialogSelector} button[id="AgentWithdrawPassword"]`)

  const PayPasswordTabSelector = `[aria-labelledby="AgentWithdrawPassword"]`

  let payPassword = "123456"
  await page.fill(
    `${dialogSelector} ${PayPasswordTabSelector} input[name="payPassword"]`,
    payPassword
  )
  await page.fill(
    `${dialogSelector} ${PayPasswordTabSelector} input[name="confirmPassword"]`,
    payPassword
  )

  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/agent/pay-password`)),
    page.click(
      `${dialogSelector} ${PayPasswordTabSelector} button[type="submit"]`
    )
  ])

  let ViewAgentDialogSelector = `#view-agent-dialog`
  await openDialog(page, ViewAgentDialogSelector)

  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/agent/histories/${agent.id}`)),
    page.click(`${ViewAgentDialogSelector} button[id="AgentHistoryList"]`)
  ])

  console.warn("TODO: click detail and check type = ?")
  /*
  const OperationListTabSelector = `[aria-labelledby="AgentHistoryList"]`
  let type = await page
    .locator(
      `${ViewAgentDialogSelector} ${OperationListTabSelector} td[data-column-id="operation"] span`
    )
    .getAttribute("data-type")
  expect(type, "PayPassword")
  */
})
