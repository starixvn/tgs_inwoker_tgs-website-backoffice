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

test("update player status", async ({
  page,
  platformCode,
  player,
  backofficeApi
}) => {
  await gotoPlayerListPage(page, platformCode)
  await searchPlayer(page, player)

  let status = "InBlacklist"
  await updatePlayerStatus(page, player, status)

  let playerRecord = await backofficeApi.player.getPlayer(player.code)
  expect(playerRecord.status).to.equals(status)
})

const updatePlayerStatus = async (page, player, status) => {
  let dialogSelector = await openEditPlayerDialog(page)

  await selectByValue(page, `${dialogSelector} select[name="status"]`, status)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/player/status/${player.code}`) &&
        response.status() === 200
      )
    }),
    page.click(
      `${dialogSelector} [aria-labelledby="player"] button[type="submit"]`
    )
  ])
}
