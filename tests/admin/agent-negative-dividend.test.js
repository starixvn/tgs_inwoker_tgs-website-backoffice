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

test("toggle agent negative dividend", async ({
  page,
  platform,
  agent,
  backofficeApi
}) => {
  await gotoAgentListPage(page, platform.code)
  await searchAgent(page, agent.username)

  agent = await backofficeApi.agent.getAgent(agent.id)
  let agentRecord = await toggleAgentNegativeDividend(
    backofficeApi,
    page,
    agent
  )
  await toggleAgentNegativeDividend(backofficeApi, page, agentRecord)
})

const toggleAgentNegativeDividend = async (backofficeApi, page, agent) => {
  let ExpectedNegativeDividend = !agent.negativeAgentDividendCarryForward

  let DialogSelector = "#negative-dividend-dialog"
  await openDialog(page, DialogSelector)
  await page.locator(`${DialogSelector} div.bb-SwitchIcon`).click()

  await Promise.all([
    page.waitForResponse(
      urlIncludes(`api/agent/negative-agent-dividend-carry-forward/${agent.id}`)
    ),
    page.locator(`${DialogSelector} button[type="submit"]`).click()
  ])

  let record = await backofficeApi.agent.getAgent(agent.id)
  expect(record.negativeAgentDividendCarryForward).equals(
    ExpectedNegativeDividend
  )
  return record
}
