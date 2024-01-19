import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import numeral from "numeral"
import {
  gotoAgentListPage,
  searchAgent,
  openEditAgentDialog,
  openViewAgentDialog
} from "./agent-list-page.js"
import { faker } from "@faker-js/faker"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test("edit and view agent contact", async ({
  page,
  platformCode,
  agent,
  backofficeApi
}) => {
  await gotoAgentListPage(page, platformCode)
  await searchAgent(page, agent.username)

  let editDialogSelector = await openEditAgentDialog(page)
  await page.click(`${editDialogSelector} #AgentContactInfo`)

  let contact = {
    phone: faker.phone.number(),
    email: faker.internet.email()
  }

  await page.fill(`${editDialogSelector} input[name="phone"]`, contact.phone)
  await page.fill(`${editDialogSelector} input[name="email"]`, contact.email)

  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/agent/${agent.id}`)),
    page.click(
      `${editDialogSelector} [aria-labelledby="AgentContactInfo"] button[type="submit"]`
    )
  ])

  let agentRecord = await backofficeApi.agent.getAgent(agent.id)
  expect(agentRecord.phone).to.equals(contact.phone)
  expect(agentRecord.email).to.equals(contact.email)
})
