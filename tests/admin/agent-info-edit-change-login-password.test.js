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

test("change agent login password", async ({
  page,
  platformCode,
  agent,
  backofficeApi
}) => {
  await gotoAgentListPage(page, platformCode)
  await searchAgent(page, agent.username)

  let dialogSelector = await openEditAgentDialog(page)
  await page.click(`${dialogSelector} button[id="AgentPassword"]`)

  const LoginPasswordTabSelector = `[aria-labelledby="AgentPassword"]`

  let loginPassword = "TgsP@ssw0rd"
  await page.fill(
    `${dialogSelector} ${LoginPasswordTabSelector} input[name="password"]`,
    loginPassword
  )
  await page.fill(
    `${dialogSelector} ${LoginPasswordTabSelector} input[name="confirmPassword"]`,
    loginPassword
  )

  await Promise.all([
    page.waitForResponse((response) => {
      let isApi = response.url().includes(`/api/agent/${agent.id}`)
      if (isApi && !response.ok()) {
        throw Error("/api/agent/${agent.id} error")
      }

      return isApi
    }),
    page.click(
      `${dialogSelector} ${LoginPasswordTabSelector} button[type="submit"]`
    )
  ])

  let ViewAgentDialogSelector = `#view-agent-dialog`
  await openDialog(page, ViewAgentDialogSelector)

  await Promise.all([
    page.waitForResponse((response) => {
      let isApi = response.url().includes(`/api/agent/histories/${agent.id}`)
      if (isApi && !response.ok()) {
        throw Error(`/api/agent/histories/{agent.id} error`)
      }

      return isApi
    }),
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
  expect(type, "Password")
  */
})
