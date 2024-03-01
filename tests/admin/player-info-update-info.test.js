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

//TODO: total 5 fields
test("update player real name, ", async ({
  page,
  platformCode,
  player,
  backofficeApi
}) => {
  await gotoPlayerListPage(page, platformCode)
  await searchPlayer(page, player)

  let updated = await editPlayerInfo(page, player)
  let playerRecord = await backofficeApi.player.getPlayer(player.code)
  expect(playerRecord.realName).to.equals(updated.realName)
  expect(playerRecord.idNumber).to.equals(updated.idNumber)
})

const editPlayerInfo = async (page, player) => {
  let dialogSelector = await openEditPlayerDialog(page)

  let info = {
    realName: faker.person.firstName(),
    idNumber: faker.string.alphanumeric(5)
  }

  await page.fill(`${dialogSelector} input[name="realName"]`, info.realName)
  await page.fill(`${dialogSelector} input[name="idNumber"]`, info.idNumber)

  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/player/info/${player.code}`)),
    page.click(
      `${dialogSelector} [aria-labelledby="player"] button[type="submit"]`
    )
  ])

  return info
}
