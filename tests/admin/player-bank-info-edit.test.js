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
import { faker } from "@faker-js/faker"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test("edit player bank card", async ({
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

  let expectedBankCard = await editBank(page, bank, player)

  let playerRecord = await backofficeApi.player.getPlayer(player.code)
  let bankCard = playerRecord?.banks?.[0]

  expect(bankCard.detail.bankName).to.equals(expectedBankCard.detail.bankName)
  expect(bankCard.detail.name).to.equals(expectedBankCard.detail.name)
  expect(bankCard.detail.bankAccount).to.equals(
    expectedBankCard.detail.bankAccount
  )
})

const editBank = async (page, bank, player) => {
  let dialogSelector = await openEditPlayerDialog(page)
  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/player/${player.code}/bank`)),
    page.click(`${dialogSelector} #banks`)
  ])

  let editBankDialogSelector = `#edit-bank-dialog`
  await openDialog(page, editBankDialogSelector)

  let detail = {
    bankName: faker.person.firstName(),
    bankBranch: faker.person.firstName(),
    name: faker.finance.accountName(),
    bankAccount: faker.finance.accountNumber()
  }

  await page
    .locator(`${editBankDialogSelector} input[name="detail.bankName"]`)
    .fill(detail.bankName)

  await page
    .locator(`${editBankDialogSelector} input[name="detail.bankBranch"]`)
    .fill(detail.bankBranch)

  await page
    .locator(`${editBankDialogSelector} input[name="detail.name"]`)
    .fill(detail.name)

  await page
    .locator(`${editBankDialogSelector} input[name="detail.bankAccount"]`)
    .fill(detail.bankAccount)

  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/player/${player.code}/bank`)),
    page.waitForSelector(editBankDialogSelector, { state: "detached" }),
    page.click(`${editBankDialogSelector} button[type="submit"]`)
  ])

  await Promise.all([
    page.waitForSelector(dialogSelector, { state: "detached" }),
    page.click(`${dialogSelector} .bb-DialogClose`)
  ])

  return {
    ...bank,
    detail
  }
}
