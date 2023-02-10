import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import { selectByValue, selectRandomOption } from "../page/select.js"
import { gotoPlayerListPage, searchPlayer } from "./player-list-page.js"
import { gotoFundDepositPage, searchByFormId } from "./fund-deposit-page.js"
import faker from "@faker-js/faker"

const test = base.extend(Fixture)

const { finance, name, lorem } = faker

test("player deposit form > apply bank transfer", async ({
  page,
  platform,
  player
}) => {
  console.log("TODO: player-deposit-form-apply-pulsa.test")
  /*
  await gotoPlayerListPage(page, platform.code)
  await searchPlayer(page, player)

  let dialogSelector = `#apply-deposit-form-dialog`
  await openDialog(page, dialogSelector)

  let form = {
    bankName: name.firstName(),
    bankAccount: finance.account(),
    amount: 10,
    note: lorem.word()
  }
  await selectPayment(page, dialogSelector)

  await page.fill(`${dialogSelector} input[name="bankName"]`, form.bankName)
  await page.fill(
    `${dialogSelector} input[name="bankAccount"]`,
    form.bankAccount
  )
  await page.fill(`${dialogSelector} input[name="amount"]`, `${form.amount}`)
  await page.fill(`${dialogSelector} textarea[name="note"]`, form.note)

  let [applyFormResponse] = await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes("/api/ManualDeposit/") &&
        response.status() === 200
      )
    }),
    page.click(`${dialogSelector} button[type="submit"]`)
  ])

  let formId = await applyFormResponse.json()
  expect(formId).to.not.be.empty
  */
})

const selectPayment = async (page, dialogSelector) => {
  let paymentMethod = "BankTransfer"
  await selectByValue(
    page,
    `${dialogSelector} select[name="method"]`,
    paymentMethod
  )

  await selectRandomOption(page, `${dialogSelector} select[name="channel"]`)
}
