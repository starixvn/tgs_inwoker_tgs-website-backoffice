import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { faker } from "@faker-js/faker"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import numeral from "numeral"
import {
  gotoAgentListPage,
  searchAgent,
  openEditAgentDialog,
  openViewAgentDialog
} from "./agent-list-page.js"
const test = base.extend(Fixture)

test("edit and view agent domain list", async ({
  page,
  platform,
  agent,
  backofficeApi
}) => {
  let domain = faker.internet.url()
  await Promise.all([
    backofficeApi.agent.domain.add(platform.id, agent.id, domain),
    gotoAgentListPage(page, platform.code)
  ])

  await searchAgent(page, agent.username)

  await viewDomain(page, platform, agent, domain)
})

const viewDomain = async (page, platform, agent, expectedDomain) => {
  let dialogSelector = await openViewAgentDialog(page, agent)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response
          .url()
          .includes(`/api/agent/domain/${platform.id}/${agent.id}`) &&
        response.status() === 200
      )
    }),
    page.click(`${dialogSelector} #AgentDomainList`)
  ])

  let WaitForViewUpdate = 500
  await page.waitForTimeout(WaitForViewUpdate)

  let domain = await page
    .locator(`${dialogSelector} [aria-labelledby="AgentDomainList"] input`)
    .inputValue()
  expect(domain).to.equals(expectedDomain)

  await page.click(`${dialogSelector} .bb-DialogClose`)
}
