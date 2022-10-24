import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { last } from "lodash-es"
import { selectPlatformByCode } from "../page/content.js"
import faker from "@faker-js/faker"
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

const test = base.extend(Fixture)
const { lorem, internet } = faker

test("add multiple layer agents", async ({ page, backofficeApi }) => {
  //TODO: add platform by api
  await gotoPlatformListPage(page)
  let platform = await addPlatform(page, {
    agentDividendType: AgentDividendType.MultipleLayer
  })

  await gotoAgentListPage(page, platform.code)

  let agents = await addAgent(page, AgentDividendType.MultipleLayer)
  console.log("TODO: add first agent by api?")
  await configProfitSharing(page)

  await gotoPlatformSettingPage(page, platform.code)
  let expectedProfitSharingSettings = await setPlatformProfitSharingSetting(
    page
  )

  await gotoAgentListPage(page, platform.code)

  agents = await addAgent(page, AgentDividendType.MultipleLayer, agents)
  let [parent, agent] = agents
  console.log("TODO: check agent's agent.parentUsername")

  /*
  await searchAgent(page, agent.username)
  let viewProfitSharingDialogSelector = `#agent-profit-sharing-setting-dialog`
  await openDialog(page, viewProfitSharingDialogSelector)
  */
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
    page.waitForResponse((response) => {
      return response.url().includes(`/api/agent/`) && response.status() === 200
    }),
    page.click(`${dialogSelector} button[type="submit"]`)
  ])
}
