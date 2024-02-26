import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { last } from "lodash-es"
import { selectPlatformByCode } from "../page/content.js"
import { gotoPlatformListPage, addPlatform } from "./platform-list-page.js"
import {
  AgentDividendType,
  addAgent,
  gotoAgentListPage,
  searchAgent
} from "./agent-list-page.js"
import { openDialog } from "../page/dialog.js"
import {
  gotoPlatformSettingPage,
  openProfitSharingSettingDialog,
  setPlatformProfitSharingSetting
} from "./platform-setting-page.js"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test("add multiple layer agents", async ({
  page,
  agentMultipleLayerPlatform,
  backofficeApi
}) => {
  await gotoAgentListPage(page, agentMultipleLayerPlatform.code)

  let agents = await addAgent(page, AgentDividendType.MultipleLayer)
  await configProfitSharing(page)

  await gotoPlatformSettingPage(page, agentMultipleLayerPlatform.code)
  let expectedProfitSharingSettings = await setPlatformProfitSharingSetting(
    page
  )

  await gotoAgentListPage(page, agentMultipleLayerPlatform.code)

  agents = await addAgent(page, AgentDividendType.MultipleLayer, agents)
  let [parent, agent] = agents
  let findAgentResult = await backofficeApi.agent.findAgent(
    agentMultipleLayerPlatform.id,
    agent.username
  )
  let agentRecord = await backofficeApi.agent.getAgent(findAgentResult?.id)
  expect(agentRecord.parentUsername).to.equals(parent.username)
})

const configProfitSharing = async (page) => {
  let dialogSelector = `#config-agent-dialog`
  await openDialog(page, dialogSelector)

  let profitSharingDialogSelector = `#agent-profit-sharing-setting-dialog`
  await openDialog(page, profitSharingDialogSelector)

  await page.click(
    `${profitSharingDialogSelector} button#add-profit-sharing-setting`
  )

  let activeNumber = 1
  await page.fill(
    `${profitSharingDialogSelector} #activeNumber input`,
    `${activeNumber}`
  )

  let netProfit = 1
  await page.fill(
    `${profitSharingDialogSelector} #netProfit input`,
    `${netProfit}`
  )

  let dividendPercentage = 1
  await page.fill(
    `${profitSharingDialogSelector} #dividendPercentage input`,
    `${dividendPercentage}`
  )

  await page.click(`${profitSharingDialogSelector} button[type="submit"]`)

  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/agent/`)),
    page.click(`${dialogSelector} button[type="submit"]`)
  ])
}
