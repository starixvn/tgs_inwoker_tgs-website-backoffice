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
  platformCode,
  agent
}) => {
  await gotoAgentListPage(page, platformCode)
  await searchAgent(page, agent.username)

  let domain = await addDomain(page, agent)
  await viewDomain(page, domain)
  await deleteDomain(page, domain)
})

const addDomain = async (page) => {
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
  await page.click(
    `${editDialogSelector} [aria-labelledby="AgentDomainList"] #add-domain`
  )

  await page.click(`${editDialogSelector} .bb-DialogClose`)

  return ExpectedDomain
}

const viewDomain = async (page, expectedDomain) => {
  let dialogSelector = await openViewAgentDialog(page)
  await page.click(`${dialogSelector} #AgentDomainList`)

  let domainLocator = await page.locator(
    `${dialogSelector} [aria-labelledby="AgentDomainList"] input`
  )
  let domain = await domainLocator.inputValue()
  expect(domain).to.equals(expectedDomain)

  await page.click(`${dialogSelector} .bb-DialogClose`)
}

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
