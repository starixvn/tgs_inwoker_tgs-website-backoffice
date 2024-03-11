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
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

console.warn("TODO: use same brand to test")
test("update player all agent player", async ({
  page,
  licensee,
  brandCertApi,
  backofficeApi,
  operatorApi
}) => {
  let platform = await backofficeApi.platform.addPlatform({
    licenseeId: licensee.id
  })

  let [platformToken] = await Promise.all([
    brandCertApi.platformToken(platform.code),
    backofficeApi.platform.allAgent.enable(platform.id),
    gotoPlayerListPage(page, platform.code)
  ])

  let [allAgentPlayer, player] = await Promise.all([
    operatorApi.player.createAndLogin(platformToken),
    operatorApi.player.createAndLogin(platformToken)
  ])

  await searchPlayer(page, player)
  let parentUsername = allAgentPlayer.username

  await updatePlayerAllAgentPlayer(page, player, parentUsername)

  let playerRecord = await backofficeApi.player.getPlayer(player.code)
  expect(playerRecord.parentUsername).to.equals(parentUsername)
})

const updatePlayerAllAgentPlayer = async (
  page,
  player,
  allAgentPlayerUsername
) => {
  let dialogSelector = await openEditPlayerDialog(page)

  await page.fill(
    `${dialogSelector} input[name="parentUsername"]`,
    allAgentPlayerUsername
  )
  await Promise.all([
    page.waitForResponse(
      urlIncludes(`/api/player/parent-player/${player.code}`)
    ),
    page.click(
      `${dialogSelector} [aria-labelledby="player"] button[type="submit"]`
    )
  ])
}
