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

const test = base.extend(Fixture)

test("update player agent", async ({
  page,
  platformCode,
  player,
  agent,
  backofficeApi
}) => {
  await gotoPlayerListPage(page, platformCode)
  await searchPlayer(page, player)

  let agentUsername = agent.username
  await updatePlayerAgent(page, player, agentUsername)

  let playerRecord = await backofficeApi.player.getPlayer(player.code)
  expect(playerRecord.agentUsername).to.equals(agentUsername)
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
