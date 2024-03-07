import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import {
  gotoPlayerListPage,
  openViewPlayerDialog,
  searchPlayer
} from "./player-list-page.js"

const test = base.extend(Fixture)

test("view player bank card", async ({
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
  await viewBank(page, bank, player)
})

const viewBank = async (page, bank, player) => {
  let dialogSelector = await openViewPlayerDialog(page, player)
  await page.click(`${dialogSelector} #banks`)

  let bankName = await page
    .locator(`${dialogSelector} [data-field="bankName"]`)
    .textContent()
  expect(bankName).equals(bank.detail.bankName)

  let bankBranch = await page
    .locator(`${dialogSelector} [data-field="bankBranch"]`)
    .textContent()
  expect(bankBranch).equals(bank.detail.bankBranch)

  let accountName = await page
    .locator(`${dialogSelector} [data-field="name"]`)
    .textContent()
  expect(accountName).to.equals(bank.detail.name)

  let bankAccount = await page
    .locator(`${dialogSelector} [data-field="bankAccount"]`)
    .textContent()
  expect(bankAccount).to.equals(bank.detail.bankAccount)
}
