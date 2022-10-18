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

test("add one layer agents", async ({ page }) => {
  await gotoPlatformListPage(page)
  let platform = await addPlatform(page, {
    agentDividendType: AgentDividendType.OneLayer
  })

  await gotoAgentListPage(page, platform.code)

  let agents = await addAgent(page, AgentDividendType.OneLayer)
  agents = await addAgent(page, AgentDividendType.OneLayer, agents)

  let [parent, agent] = agents
  await searchAgent(page, agent.username)

  let viewAgentDialogSelector = `#view-agent-dialog`
  await Promise.all([
    page.waitForResponse((response) => {
      return response.url().includes(`/api/agent/`) && response.status() === 200
    }),
    openDialog(page, viewAgentDialogSelector)
  ])

  let parentUsernameLocator = page.locator(
    `${viewAgentDialogSelector} [data-type="parent-username"]`
  )
  let parentUsername = await parentUsernameLocator.textContent()
  expect(parentUsername).to.equals(parent.username)
})
