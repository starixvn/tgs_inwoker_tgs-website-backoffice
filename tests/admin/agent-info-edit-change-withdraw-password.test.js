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
    page.waitForResponse((response) => {
      let isApi = response.url().includes(`/api/agent/pay-password`)
      if (isApi && !response.ok()) {
        throw Error("/api/agent/pay-password error")
      }

      return isApi
    }),
    page.click(
      `${dialogSelector} ${PayPasswordTabSelector} button[type="submit"]`
    )
  ])

  let ViewAgentDialogSelector = `#view-agent-dialog`
  await openDialog(page, ViewAgentDialogSelector)

  await Promise.all([
    page.waitForResponse((response) => {
      let isApi = response.url().includes(`/api/agent/${agent.id}/operations`)
      if (isApi && !response.ok()) {
        throw Error(`/api/agent/{agent.id}/operations error`)
      }

      return isApi
    }),
    page.click(`${ViewAgentDialogSelector} button[id="AgentOperationList"]`)
  ])

  const OperationListTabSelector = `[aria-labelledby="AgentOperationList"]`
  let type = await page
    .locator(
      `${ViewAgentDialogSelector} ${OperationListTabSelector} td[data-column-id="operation"] span`
    )
    .getAttribute("data-type")
  expect(type, "PayPassword")
})
