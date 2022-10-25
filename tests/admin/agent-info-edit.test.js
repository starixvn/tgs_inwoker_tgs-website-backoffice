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

test("edit and view agent info", async ({
  page,
  platformCode,
  agent,
  backofficeApi
}) => {
  await gotoAgentListPage(page, platformCode)
  await searchAgent(page, agent.username)

  let expected = await editAgent(page, agent)
  let agentRecord = await backofficeApi.agent.getAgent(agent.id)
  expect(agentRecord.realName).to.equals(expected.realName)
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
