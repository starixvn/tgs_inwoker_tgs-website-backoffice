import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { faker } from "@faker-js/faker"
import { selectPlatformByCode } from "../page/content.js"
import {
  gotoAgentListPage,
  searchAgent,
  openEditAgentDialog,
  openViewAgentDialog
} from "./agent-list-page.js"

const test = base.extend(Fixture)

test("change agent withdraw password", async ({
  page,
  platformCode,
  agent,
  backofficeApi
}) => {
  await gotoAgentListPage(page, platformCode)
  await searchAgent(page, agent.username)

  let dialogSelector = await openEditAgentDialog(page)
  await page.click(`${dialogSelector} button[id="AgentWithdrawPassword"]`)

  let payPassword = "123456"
  await page.fill(
    `${dialogSelector} [aria-labelledby="AgentWithdrawPassword"] input[name="payPassword"]`,
    payPassword
  )
  await page.fill(
    `${dialogSelector} [aria-labelledby="AgentWithdrawPassword"] input[name="confirmPassword"]`,
    payPassword
  )

  await Promise.all([
    page.waitForResponse((response) => {
      let isApi = response.url().includes(`/api/agent/pay-password`)
      if (isApi && !response.ok()) {
        //TODO: check response json and add to error msg?
        throw Error("/api/agent/pay-password error")
      }

      return isApi
    }),
    page.click(
      `${dialogSelector} [aria-labelledby="AgentWithdrawPassword"] button[type="submit"]`
    )
  ])
})
