import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectByValue } from "../page/select.js"
import {
  gotoPlayerListPage,
  searchPlayer,
  openEditPlayerDialog,
  openViewPlayerDialog
} from "./player-list-page.js"
import { faker } from "@faker-js/faker"

const test = base.extend(Fixture)

test("update player all agent player", async ({
  page,
  platformCode,
  player,
  backofficeApi,
  operatorApi,
  platformToken
}) => {
  await gotoPlayerListPage(page, platformCode)
  await searchPlayer(page, player)

  let allAgentPlayer = await operatorApi.player.createAndLogin(platformToken)
  let parentUsername = allAgentPlayer.username
  await updatePlayerStatus(page, player, parentUsername)

  let playerRecord = await backofficeApi.player.getPlayer(player.code)
  expect(playerRecord.parentUsername).to.equals(parentUsername)
})

const updatePlayerStatus = async (page, player, allAgentPlayerUsername) => {
  let dialogSelector = await openEditPlayerDialog(page)

  await page.fill(
    `${dialogSelector} input[name="parentUsername"]`,
    allAgentPlayerUsername
  )
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/player/parent-player/${player.code}`) &&
        response.status() === 200
      )
    }),
    page.click(
      `${dialogSelector} [aria-labelledby="player"] button[type="submit"]`
    )
  ])
}
