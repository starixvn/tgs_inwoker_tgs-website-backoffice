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

const test = base.extend(Fixture)

test("view player info", async ({ page, platformCode, player }) => {
  await gotoPlayerListPage(page, platformCode)
  await searchPlayer(page, player)

  await viewPlayerInfo(page, player)
})

const viewPlayerInfo = async (page, player) => {
  let dialogSelector = await openViewPlayerDialog(page, player)

  let usernameSelector = page.locator(
    `${dialogSelector} [data-field="username"]`
  )
  let username = await usernameSelector.textContent()
  expect(username).to.equals(player.username)
}
