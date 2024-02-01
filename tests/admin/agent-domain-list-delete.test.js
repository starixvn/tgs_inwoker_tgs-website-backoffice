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
import { urlIncludes } from "../page/response.js"
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
  await deleteDomain(page, domain, platform, agent)
})

const deleteDomain = async (page, domain, platform, agent) => {
  let editDialogSelector = await openEditAgentDialog(page)
  await Promise.all([
    page.waitForResponse((response) => {
      let url = response.url()
      let isApi = url.includes(`/api/agent/domain/${platform.id}/${agent.id}`)
      if (isApi && !response.ok()) {
        return Error(`api /api/agent/domain/{platform.id}/{agent.id} failed`)
      }

      return isApi
    }),
    page.click(`${editDialogSelector} #AgentDomainList`)
  ])

  let inputLocator = await page.locator(
    `${editDialogSelector} [aria-labelledby="AgentDomainList"] input[type="text"]`
  )
  let inputCount = await inputLocator.count()
  let expectedInputCount = inputCount - 1
  await Promise.all([
    page.waitForResponse(urlIncludes(`?domain=${domain}`)),
    page.click(`${editDialogSelector} #delete-domain`)
  ])

  inputCount = await inputLocator.count()
  expect(inputCount).to.equals(expectedInputCount)
}
