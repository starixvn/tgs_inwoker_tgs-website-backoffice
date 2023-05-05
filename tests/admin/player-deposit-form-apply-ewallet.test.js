import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { openDialog } from "../page/dialog.js"
import { selectByValue, selectRandomOption } from "../page/select.js"
import { gotoPlayerListPage, searchPlayer } from "./player-list-page.js"
import faker from "@faker-js/faker"

const test = base.extend(Fixture)

const { name, lorem, phone } = faker

test("player deposit form > apply bank transfer", async ({
  page,
  platform,
  player,
  eWalletPaymentMethod,
  eWalletPaymentChannel,
  eWalletManualDepositPayment,
  eWalletManualWithdrawPayment,
  backofficeApi
}) => {
  /*
   Note. player bank card was design for withdraw at first
   */
  let [bank] = await Promise.all([
    backofficeApi.player.bankCard.add({
      brandId: platform.id,
      playerCode: player.code,
      bankType: eWalletPaymentMethod.bankType,
      paymentChannelId: eWalletManualWithdrawPayment.paymentChannelId,
      detail: {
        eMoneyName: name.firstName(),
        phone: "123456"
      }
    }),
    gotoPlayerListPage(page, platform.code)
  ])

  let dialogSelector = `#apply-deposit-form-dialog`
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes("/api/brandpayment/player") &&
        response.status() === 200
      )
    }),
    openDialog(page, dialogSelector)
  ])

  await selectByValue(
    page,
    `${dialogSelector} select[name="method"]`,
    eWalletPaymentMethod.code
  )

  //TODO: need to wait for another api?
  await selectByValue(
    page,
    `${dialogSelector} select[name="channel"]`,
    eWalletPaymentChannel.code
  )

  let realName = await page
    .locator(`${dialogSelector} input[name="realName"]`)
    .inputValue()
  expect(realName).equals(bank.detail.eMoneyName)

  let phone = await page
    .locator(`${dialogSelector} input[name="phone"]`)
    .inputValue()
  expect(phone).equals(bank.detail.phone)

  let form = {
    amount: 10,
    note: lorem.word()
  }

  console.log("player", player)
  await page.fill(`${dialogSelector} input[name="amount"]`, `${form.amount}`)
  await page.fill(`${dialogSelector} textarea[name="note"]`, form.note)

  // const halfSecond = 500
  // await page.waitForTimeout(halfSecond)

  let [applyFormResponse] = await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes("/api/ManualDeposit/EWallet") &&
        response.status() === 200
      )
    }),
    page.click(`${dialogSelector} button[type="submit"]`)
  ])

  let formId = await applyFormResponse.json()
  expect(formId).to.not.be.empty

  let depositForm = await backofficeApi.fund.deposit.form(platform.id, formId)

  expect(depositForm.amount).equals(form.amount)
  expect(depositForm.applyInfo.sendEMoneyName).equals(bank.detail.eMoneyName)
  expect(depositForm.applyInfo.sendPhone).equals(bank.detail.phone)
  expect(depositForm.applyInfo.sendNote).equals(form.note)
})
