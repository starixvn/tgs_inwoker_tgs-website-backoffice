import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import {
  gotoPlayerListPage,
  searchPlayer,
  openEditPlayerDialog,
  openViewPlayerDialog
} from "./player-list-page.js"
import { faker } from "@faker-js/faker"
import { urlIncludes } from "../page/response.js"
import { gotoAgentListPage, searchAgent } from "./agent-list-page.js"
import { openDialog } from "../page/dialog.js"

const test = base.extend(Fixture)

test("config agent player profit sharing", async ({
  page,
  agentPlayerPlatform: platform,
  brandCertApi,
  operatorApi,
  backofficeApi
}) => {
  let platformToken = await brandCertApi.platformToken(platform.code)
  let player = await operatorApi.player.createAndLogin(platformToken)

  await Promise.all([
    backofficeApi.player.upgradeToAgent(player.playerCode),
    gotoAgentListPage(page, platform.code)
  ])

  let username = player.username
  let [agent] = await Promise.all([
    backofficeApi.agent.findAgent(platform.id, username),
    searchAgent(page, username)
  ])

  let DialogSelector = `#config-agent-dialog`
  await openDialog(page, DialogSelector)

  let profitSharing = faker.number.int({
    min: 0,
    max: 99
  })

  await page
    .locator(`${DialogSelector} input[name="dividendPercentage"]`)
    .fill(`${profitSharing}`)

  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/agent/one-layer/${agent.id}`)),
    page.locator(`${DialogSelector} button[type="submit"]`).click()
  ])

  let record = await backofficeApi.agent.getAgent(agent.id)
  expect(record.dividendPercentage).equals(profitSharing)
})

const updatePlayerAgent = async (page, player, agentUsername) => {
  let dialogSelector = await openEditPlayerDialog(page)

  await page.fill(
    `${dialogSelector} input[name="agentUsername"]`,
    agentUsername
  )

  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/player/agent/${player.code}`)),
    page.click(
      `${dialogSelector} [aria-labelledby="player"] button[type="submit"]`
    )
  ])
}
