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
import faker from "@faker-js/faker"

const test = base.extend(Fixture)

test("edit and view player info", async ({ page, platformCode, player }) => {
  await gotoPlayerListPage(page, platformCode)
  await searchPlayer(page, player)

  let info = await editPlayerInfo(page, player)
  await viewPlayerInfo(page, info, player)
})

const editPlayerInfo = async (page, player) => {
  let dialogSelector = await openEditPlayerDialog(page)

  let info = {
    realName: faker.name.findName()
  }

  await page.fill(`${dialogSelector} input[name="realName"]`, info.realName)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/player/${player.code}/info`) &&
        response.status() === 200
      )
    }),
    page.click(
      `${dialogSelector} [aria-labelledby="player"] button[type="submit"]`
    )
  ])

  return info
}

const viewPlayerInfo = async (page, info, player) => {
  let dialogSelector = await openViewPlayerDialog(page, player)

  let realNameSelector = page.locator(
    `${dialogSelector} [data-field="realName"]`
  )
  let realName = await realNameSelector.textContent()
  expect(realName).to.equals(info.realName)
}
