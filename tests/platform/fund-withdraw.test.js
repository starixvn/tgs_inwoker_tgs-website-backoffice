import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import numeral from "numeral"
import { goto } from "../sidebar.js"
import { addManualBankCard, applyManualWithdrawForm } from "../player.js"
import faker from "faker"

const test = base.extend(Fixture)
const { finance } = faker

const SecondInMilliseconds = 1000
test.use({ timeout: 40 * SecondInMilliseconds })

test("deposit and withdraw alarm on header", async ({
  page,
  platformToken,
  player,
  backofficeApi
}) => {
  let depositAmount = 10
  await backofficeApi.player.addBalance(player.code, {
    amount: depositAmount
  })

  let withdrawAmount = depositAmount
  await withdrawAlarm(page, platformToken, player, withdrawAmount)
})

const withdrawAlarm = async (page, platformToken, player, withdrawAmount) => {
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

const gotoFundWithdraw = async (page) => {
  await goto({ page, value: "/fundmanagement/withdraw" })
}
