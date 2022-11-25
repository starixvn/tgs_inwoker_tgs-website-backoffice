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

  let bankNameLocator = page.locator(
    `${dialogSelector} [data-field="bankName"]`
  )
  let bankName = await bankNameLocator.textContent()
  expect(bankName).to.equals(bank.detail.bankName)

  let bankBranchLocator = page.locator(
    `${dialogSelector} [data-field="bankBranch"]`
  )
  let bankBranch = await bankBranchLocator.textContent()
  expect(bankBranch).to.equals(bank.detail.bankBranch)

  let accountNameLocator = page.locator(`${dialogSelector} [data-field="name"]`)
  let accountName = await accountNameLocator.textContent()
  expect(accountName).to.equals(bank.detail.name)

  let bankAccountLocator = page.locator(
    `${dialogSelector} [data-field="bankAccount"]`
  )
  let bankAccount = await bankAccountLocator.textContent()
  expect(bankAccount).to.equals(bank.detail.bankAccount)
}
