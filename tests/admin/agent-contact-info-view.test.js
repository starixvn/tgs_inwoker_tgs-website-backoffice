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

const test = base.extend(Fixture)

test("edit and view agent contact", async ({
  page,
  platformCode,
  agent,
  backofficeApi
}) => {
  let expected = {
    phone: faker.phone.number(),
    email: faker.internet.email()
  }
  await Promise.all([
    backofficeApi.agent.updateContact(agent.id, expected),
    gotoAgentListPage(page, platformCode)
  ])

  await searchAgent(page, agent.username)

  let viewDialogSelector = await openViewAgentDialog(page, agent)
  await page.click(`${viewDialogSelector} #AgentContactInfo`)

  let phoneLocator = page.locator(`${viewDialogSelector} [data-field="phone"]`)
  let phone = await phoneLocator.textContent()
  expect(phone).to.equals(expected.phone)

  let emailLocator = page.locator(`${viewDialogSelector} [data-field="email"]`)
  let email = await emailLocator.textContent()
  expect(email).to.equals(expected.email)
})
