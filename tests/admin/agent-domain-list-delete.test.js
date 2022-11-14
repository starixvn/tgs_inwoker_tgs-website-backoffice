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
  let domain = faker.internet.url()
  await Promise.all([
    backofficeApi.agent.domain.add(platform.id, agent.id, domain),
    gotoAgentListPage(page, platform.code)
  ])

  await searchAgent(page, agent.username)
  await deleteDomain(page, domain)
})

const deleteDomain = async (page, domain) => {
  let editDialogSelector = await openEditAgentDialog(page)
  await page.click(`${editDialogSelector} #AgentDomainList`)

  let inputLocator = await page.locator(
    `${editDialogSelector} [aria-labelledby="AgentDomainList"] input[type="text"]`
  )
  let inputCount = await inputLocator.count()
  let expectedInputCount = inputCount - 1
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`?domain=${domain}`) &&
        response.status() === 200
      )
    }),
    page.click(`${editDialogSelector} #delete-domain`)
  ])

  inputCount = await inputLocator.count()
  expect(inputCount).to.equals(expectedInputCount)
}
