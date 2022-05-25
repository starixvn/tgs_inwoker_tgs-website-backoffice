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

  let expected = await editAgent(page)
  await viewAgent(page, expected)
})

const editAgent = async (page) => {
  let dialogSelector = await openEditAgentDialog(page)
  let realName = faker.name.findName()

  await page.fill(`${dialogSelector} input[name="realName"]`, realName)
  await page.click(
    `${dialogSelector} [aria-labelledby="AgentInfo"] button[type="submit"]`
  )

  return {
    realName
  }
}

const viewAgent = async (page, expected) => {
  let dialogSelector = await openViewAgentDialog(page)
  if (expected.realName) {
    let realNameLocator = page.locator(
      `${dialogSelector} [data-field="realName"]`
    )

    let realName = await realNameLocator.textContent()
    expect(realName).to.equals(expected.realName)
  }
}
