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
import { head } from "lodash-es"

const test = base.extend(Fixture)

test("change agent withdraw password", async ({
  page,
  platform,
  agent,
  backofficeApi
}) => {
  await gotoAgentListPage(page, platform.code)
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

  let [response] = await Promise.all([
    page.waitForResponse(urlIncludes(`/api/agent/histories/${agent.id}`)),
    page.click(`${ViewAgentDialogSelector} button[id="AgentHistoryList"]`)
  ])

  let [type, historyListResult] = await Promise.all([
    page
      .locator(
        `${ViewAgentDialogSelector} [aria-labelledby="AgentHistoryList"] td[data-column-id="action"] span`
      )
      .getAttribute("data-type"),
    response.json()
  ])

  let history = head(historyListResult?.items)
  expect(type).equals(history.action)
  let modifier = await page
    .locator(
      `${ViewAgentDialogSelector} [aria-labelledby="AgentHistoryList"] td[data-column-id="modifier"]`
    )
    .textContent()
  expect(modifier).equals(history.modifier)

  let HistoryDialogSelector = `#agent-history-dialog`
  let [eventResponse] = await Promise.all([
    page.waitForResponse(urlIncludes(`/api/agent/history/${history.eventId}`)),
    openDialog(page, `${HistoryDialogSelector}`),
    `${ViewAgentDialogSelector} [aria-labelledby="AgentHistoryList"] #agent-history-dialog-disclosure`
  ])

  let evnet = await eventResponse.json()
  let changeSet = head(evnet.changeSets)

  let op = await page
    .locator(`${HistoryDialogSelector} td[data-column-id="op"] span`)
    .getAttribute("data-type")
  expect(op).equals(changeSet.op)
})
