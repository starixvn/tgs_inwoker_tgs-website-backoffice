import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import faker from "@faker-js/faker"
import { selectPlatformByCode } from "../page/content.js"
import {
  gotoAgentListPage,
  searchAgent,
  openEditAgentDialog,
  openViewAgentDialog
} from "./agent-list-page.js"

const test = base.extend(Fixture)

test("edit and view agent info", async ({ page, platformCode, agent }) => {
  await gotoAgentListPage(page, platformCode)
  await searchAgent(page, agent.username)

  console.log(
    "TODO: use edit & view test, use get agent & update agent api instead"
  )
  let expected = await editAgent(page, agent)
  await viewAgent(page, agent, expected)
})

const editAgent = async (page, agent) => {
  let dialogSelector = await openEditAgentDialog(page)
  let realName = faker.name.findName()

  await page.fill(`${dialogSelector} input[name="realName"]`, realName)
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/agent/${agent.id}`) &&
        response.status() === 200
      )
    }),
    page.click(
      `${dialogSelector} [aria-labelledby="AgentInfo"] button[type="submit"]`
    )
  ])

  return {
    realName
  }
}

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
