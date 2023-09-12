import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectByValue, selectRandomOption } from "../page/select.js"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import numeral from "numeral"
import {
  gotoPlayerListPage,
  openEditPlayerDialog,
  openViewPlayerDialog,
  searchPlayer
} from "./player-list-page.js"

const test = base.extend(Fixture)

test("edit and view player bank", async ({
  page,
  platform,
  player,
  backofficeApi
}) => {
  let [bank] = await Promise.all([
    backofficeApi.player.bankCard.add({
      brandId: platform.id,
      playerCode: player.code
    }),
    gotoPlayerListPage(page, platform.code)
  ])

  await searchPlayer(page, player)
  await deleteBank(page, player)
})

const deleteBank = async (page, player) => {
  let dialogSelector = await openEditPlayerDialog(page)
  await page.click(`${dialogSelector} #banks`)

  let deleteBankSelector = `#delete-bank-dialog`
  await openDialog(page, deleteBankSelector)

  let idLocator = page.locator(`${deleteBankSelector} [data-field="bank-id"]`)
  let id = await idLocator.getAttribute(`data-value`)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/player/${player.code}/bank/${id}`) &&
        response.status() === 200
      )
    }),
    page.click(`${deleteBankSelector} button[type="submit"]`)
  ])
}
