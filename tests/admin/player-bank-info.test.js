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
import faker from "@faker-js/faker"

const test = base.extend(Fixture)

test("edit and view player bank", async ({ page, platformCode, player }) => {
  await gotoPlayerListPage(page, platformCode)
  await searchPlayer(page, player)

  let bank = await addBank(page, player)

  bank = await editBank(page, bank, player)
  await viewBank(page, bank, player)
  await deleteBank(page, player)
})

const addBank = async (page, player) => {
  let dialogSelector = await openEditPlayerDialog(page)
  await page.click(`${dialogSelector} #banks`)

  let addBankDialogSelector = `#add-bank-dialog`
  await openDialog(page, addBankDialogSelector)

  let bank = {
    bankType: "Bank",
    detail: {
      bankName: faker.name.firstName(),
      bankBranch: faker.name.firstName(),
      name: faker.finance.accountName(),
      bankAccount: faker.finance.account()
    }
  }

  await selectByValue(
    page,
    `${addBankDialogSelector} select[name="bankType"]`,
    bank.bankType
  )

  await selectRandomOption(
    page,
    `${addBankDialogSelector} select[name="paymentChannelId"]`
  )

  await page.fill(
    `${addBankDialogSelector} input[name="detail.bankName"]`,
    bank.detail.bankName
  )
  await page.fill(
    `${addBankDialogSelector} input[name="detail.bankBranch"]`,
    bank.detail.bankBranch
  )
  await page.fill(
    `${addBankDialogSelector} input[name="detail.name"]`,
    bank.detail.name
  )
  await page.fill(
    `${addBankDialogSelector} input[name="detail.bankAccount"]`,
    bank.detail.bankAccount
  )

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/player/${player.code}/bank`) &&
        response.status() === 200
      )
    }),
    page.click(`${addBankDialogSelector} button[type="submit"]`)
  ])

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

  await page.click(`${dialogSelector} .bb-DialogClose`)

  return bank
}

const editBank = async (page, bank, player) => {
  let dialogSelector = await openEditPlayerDialog(page)
  await page.click(`${dialogSelector} #banks`)

  let editBankDialogSelector = `#edit-bank-dialog`
  await openDialog(page, editBankDialogSelector)

  let bankNameSelector = `${editBankDialogSelector} input[name="detail.bankName"]`
  let bankNameLocator = page.locator(bankNameSelector)
  let bankName = await bankNameLocator.inputValue()
  expect(bankName).to.equals(bank.detail.bankName)

  let bankBranchSelector = `${editBankDialogSelector} input[name="detail.bankBranch"]`
  let bankBranchLocator = page.locator(bankBranchSelector)
  let bankBranch = await bankBranchLocator.inputValue()
  expect(bankBranch).to.equals(bank.detail.bankBranch)

  let nameSelector = `${editBankDialogSelector} input[name="detail.name"]`
  let nameLocator = page.locator(nameSelector)
  let name = await nameLocator.inputValue()
  expect(name).to.equals(bank.detail.name)

  let bankAccountSelector = `${editBankDialogSelector} input[name="detail.bankAccount"]`
  let bankAccountLocator = page.locator(bankAccountSelector)
  let bankAccount = await bankAccountLocator.inputValue()
  expect(bankAccount).to.equals(bank.detail.bankAccount)

  let detail = {
    bankName: faker.name.firstName(),
    bankBranch: faker.name.firstName(),
    name: faker.finance.accountName(),
    bankAccount: faker.finance.account()
  }

  await page.fill(bankNameSelector, detail.bankName)
  await page.fill(bankBranchSelector, detail.bankBranch)
  await page.fill(nameSelector, detail.name)
  await page.fill(bankAccountSelector, detail.bankAccount)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/player/${player.code}/bank`) &&
        response.status() === 200
      )
    }),
    page.click(`${editBankDialogSelector} button[type="submit"]`)
  ])

  await page.click(`${dialogSelector} .bb-DialogClose`)

  return {
    ...bank,
    detail
  }
}

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

  await page.click(`${dialogSelector} .bb-DialogClose`)
}

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
