import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import faker from "@faker-js/faker"
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
  await gotoAgentListPage(page, platform.code)
  await searchAgent(page, agent.username)

  let domain = await addDomain(page, platform, agent)
  let isInclude = await backofficeApi.agent.domain.includes(
    platform.id,
    agent.id,
    domain
  )

  expect(isInclude).to.be.true
})

const addDomain = async (page, platform, agent) => {
  let editDialogSelector = await openEditAgentDialog(page)
  await page.click(`${editDialogSelector} #AgentDomainList`)

  await page.click(
    `${editDialogSelector} [aria-labelledby="AgentDomainList"] #add-domain-input`
  )

  let ExpectedDomain = faker.internet.domainName()
  await page.fill(
    `${editDialogSelector} [aria-labelledby="AgentDomainList"] input`,
    ExpectedDomain
  )

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response
          .url()
          .includes(
            `/api/agent/domain/${platform.id}/${agent.id}?domain=${ExpectedDomain}`
          ) && response.status() === 200
      )
    }),
    page.click(
      `${editDialogSelector} [aria-labelledby="AgentDomainList"] #add-domain`
    )
  ])

  await page.click(`${editDialogSelector} .bb-DialogClose`)

  return ExpectedDomain
}
