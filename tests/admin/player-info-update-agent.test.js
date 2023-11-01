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
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/player/agent/${player.code}`) &&
        response.status() === 200
      )
    }),
    page.click(
      `${dialogSelector} [aria-labelledby="player"] button[type="submit"]`
    )
  ])
}
