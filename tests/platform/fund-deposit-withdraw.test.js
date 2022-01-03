import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { PlatformCode as brandCode } from "../auth.js"
import numeral from "numeral"
import { goto } from "../sidebar.js"
import {
  manualDeposit,
  applyManualDepositForm,
  addManualBankCard,
  applyManualWithdrawForm
} from "../player.js"
import faker from "faker"

const test = base.extend(Fixture)
const { finance } = faker

const SecondInMilliseconds = 1000
test.use({ timeout: 40 * SecondInMilliseconds })

test("deposit and withdraw alarm on header", async ({
  page,
  platformCode,
  platformToken,
  player
}) => {
  let depositAmount = 10
  let balance = await depositAlarm(page, platformToken, player, depositAmount)

  let withdrawAmount = depositAmount
  await withdrawAlarm(page, platformToken, player, withdrawAmount)
})

const depositAlarm = async (page, platformToken, player, amount) => {
  const DepositAccount = "account"
  const ExpectedDepositAmount = amount

  let formId = await manualDeposit(platformToken, player.token, {
    account: DepositAccount,
    amount: ExpectedDepositAmount
  })
  await applyManualDepositForm(platformToken, player.token, formId)

  let AlarmSelector = `#fund-deposit-notify`
  await page.waitForSelector(AlarmSelector, {
    timeout: 20 * SecondInMilliseconds
  })
  let unprocessedString = await page.$eval(
    AlarmSelector,
    ({ dataset }) => dataset.unprocessed
  )
  let unprocessed = numeral(unprocessedString).value()
  expect(unprocessed).to.be.above(0)

  await approveFundDeposit(page, formId)
}

const approveFundDeposit = async (page, formId) => {
  await gotoFundDepositPage(page)
  await page.fill(`input[name="id"]`, formId)
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`id=${formId}`) && response.status() === 200
      )
    }),
    page.click(`button[type="submit"]`)
  ])

  let VerifyDepositDialogSelector = `#verify-deposit-dialog`
  await page.click(`${VerifyDepositDialogSelector}-disclosure`)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/deposit/${formId}`) &&
        response.status() === 200
      )
    }),
    page.click(`${VerifyDepositDialogSelector} button[data-type="approve"]`)
  ])

  await Promise.all([
    page.waitForSelector(VerifyDepositDialogSelector, {
      state: "detached"
    }),
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/deposit/`) && response.status() === 200
      )
    })
  ])
}

const withdrawAlarm = async (page, platformToken, player, withdrawAmount) => {
  await clearPlayerWageringRequirement(page, player)

  let expectBankCard = {
    bankAccount: finance.account(),
    name: finance.accountName(),
    bankName: "bankName",
    bankBranch: "bankBranch"
  }
  await addManualBankCard(platformToken, player.token, expectBankCard)

  let formId = await applyManualWithdrawForm(platformToken, player.token, {
    amount: withdrawAmount
  })

  let AlarmSelector = `#fund-withdraw-notify`
  await page.waitForSelector(AlarmSelector, {
    timeout: 16 * SecondInMilliseconds
  })
  let unprocessedString = await page.$eval(
    AlarmSelector,
    ({ dataset }) => dataset.unprocessed
  )
  let unprocessed = numeral(unprocessedString).value()
  expect(unprocessed).to.be.above(0)

  await approveFundWithdraw(page, formId)
}

const approveFundWithdraw = async (page, formId) => {
  await gotoFundWithdraw(page)

  await page.fill(`input[name="id"]`, formId)
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`id=${formId}`) && response.status() === 200
      )
    }),
    page.click(`button[type="submit"]`)
  ])

  let TableSelector = `#withdraw`
  let VerifyDialogSelector = `#verify-withdraw-dialog`
  await page.click(`${VerifyDialogSelector}-disclosure`)

  await selectManualBrandPayment(page)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/withdraw/${formId}`) &&
        response.status() === 200
      )
    }),
    page.click(`${VerifyDialogSelector} button[data-type="approve"]`)
  ])

  await Promise.all([
    page.waitForSelector(VerifyDialogSelector, {
      state: "detached"
    }),
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/withdraw`) && response.status() === 200
      )
    })
  ])
}

const selectManualBrandPayment = async (page) => {
  let SelectSelector = `select[name="brandPaymentId"]`
  await page.waitForSelector(`${SelectSelector} option`, {
    state: "attached"
  })

  //TODO: how to prevent hardcode: Manual_BankTransfer_Custom
  await page.selectOption(SelectSelector, {
    label: "Manual_BankTransfer_Custom"
  })
}

//TODO: use backoffice client instead
const clearPlayerWageringRequirement = async (page, player) => {
  await gotoPlayerListPage(page)
  await page.fill(`input[name="username"]`, player.username)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`username=${player.username}`) &&
        response.status() === 200
      )
    }),
    page.click(`button[type="submit"]`)
  ])

  let EditPlayerDialog = `#edit-player-dialog`
  await page.click(`${EditPlayerDialog}-disclosure`)

  let ClearPlayerWageringRequirementDialogSelector = `#clear-player-wagering-requirement-dialog`
  await page.click(`${ClearPlayerWageringRequirementDialogSelector}-disclosure`)
  await page.click(
    `${ClearPlayerWageringRequirementDialogSelector} button[type="submit"]`
  )
  await page.click(`${EditPlayerDialog} button[type="submit"]`)
}

const gotoFundDepositPage = async (page) => {
  await goto({ page, value: "/fundmanagement/deposit" })
}

const gotoFundWithdraw = async (page) => {
  await goto({ page, value: "/fundmanagement/withdraw" })
}

const gotoPlayerListPage = async (page) => {
  await goto({ page, value: "/playermanagement/playerlist" })
}
