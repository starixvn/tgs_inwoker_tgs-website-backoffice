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

const test = base.extend(Fixture)

console.log("TODO: remove agent team info")
test.skip("view agent team info", async ({
  page,
  platformCode,
  agent,
  player,
  backofficeApi
}) => {
  await Promise.all([
    backofficeApi.player.updateInfo(player.code, {
      agentUsername: agent.username
    }),
    gotoAgentListPage(page, platformCode)
  ])

  await searchAgent(page, agent.username)

  let dialogSelector = await openViewAgentDialog(page)

  await Promise.all([
    page.waitForResponse((response) => {
      return response.url().includes(`/teamInfo?`) && response.status() === 200
    }),
    page.click(`${dialogSelector} #AgentTeamInfo`)
  ])

  let usernameLocator = page.locator(
    `${dialogSelector} [data-column-id="username"]`
  )
  let username = await usernameLocator.textContent()
  expect(username).to.equals(player.username)
})
