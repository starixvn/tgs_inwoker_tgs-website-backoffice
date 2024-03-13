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

const test = base.extend(Fixture)

test("view agent info", async ({
  page,
  platformCode,
  agent,
  backofficeApi
}) => {
  let expected = {
    realName: faker.person.firstName()
  }
  await Promise.all([
    gotoAgentListPage(page, platformCode),
    backofficeApi.agent.updateInfo(agent.id, expected)
  ])

  await searchAgent(page, agent.username)
  await viewAgent(page, agent, expected)
})

const viewAgent = async (page, agent, expected) => {
  let dialogSelector = await openViewAgentDialog(page, agent)
  if (expected.realName) {
    let UpdateViewTimeout = 500
    await page.waitForTimeout(UpdateViewTimeout)

    let realNameLocator = page.locator(
      `${dialogSelector} [data-field="realName"]`
    )

    let realName = await realNameLocator.textContent()
    expect(realName).to.equals(
      expected.realName,
      `agent username ${agent.username}`
    )
  }
}
