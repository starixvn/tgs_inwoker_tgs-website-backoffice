import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import { selectByValue, selectRandomOption } from "../page/select.js"
import { gotoPlayerListPage, searchPlayer } from "./player-list-page.js"
import faker from "@faker-js/faker"

const test = base.extend(Fixture)

const { finance, name, lorem } = faker

test("player apply withdraw form", async ({
  page,
  platform,
  platformToken,
  player,
  backofficeApi,
  operatorApi
}) => {
  let depositAmount = 100

  await Promise.all([
    backofficeApi.player.addBalance(player.code, {
      amount: depositAmount
    }),
    operatorApi.player.addManualBankCard(platformToken, player.token),
    gotoPlayerListPage(page, platform.code),
    searchPlayer(page, player)
  ])

  let playerRecord = await backofficeApi.player.getPlayer(player.code)
  expect(playerRecord.balance).equals(depositAmount)

  let dialogSelector = `#apply-withdraw-form-dialog`
  await openDialog(page, dialogSelector)

  let withdrawAmount = depositAmount
  let form = {
    amount: withdrawAmount,
    note: lorem.word()
  }

  //TODO: select by id?
  await selectRandomOption(page, `${dialogSelector} select[name="bankInfoId"]`)

  await page.fill(`${dialogSelector} input[name="amount"]`, `${form.amount}`)
  await page.fill(`${dialogSelector} textarea[name="note"]`, form.note)

  let [applyFormResponse] = await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes("/api/Withdraw/player") &&
        response.status() == 200
      )
    }),
    page.click(`${dialogSelector} button[type="submit"]`)
  ])

  let result = await applyFormResponse.json()
  expect(result.valid).equals(true)
})
