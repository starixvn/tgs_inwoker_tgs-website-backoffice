import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
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
  platformToken,
  player
}) => {
  let depositAmount = 10
  let balance = await depositAlarm(page, platformToken, player, depositAmount)
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

const gotoFundDepositPage = async (page) => {
  await goto({ page, value: "/fundmanagement/deposit" })
}
