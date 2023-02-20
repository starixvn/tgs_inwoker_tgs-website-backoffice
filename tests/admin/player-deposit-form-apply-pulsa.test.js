import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { openDialog } from "../page/dialog.js"
import { selectByValue } from "../page/select.js"
import { gotoPlayerListPage, searchPlayer } from "./player-list-page.js"
import faker from "@faker-js/faker"

const test = base.extend(Fixture)

const { name, lorem, phone } = faker

test("player deposit form > apply bank transfer", async ({
  page,
  platform,
  player,
  pulsaPaymentMethod,
  pulsaPaymentChannel,
  pulsaManualDepositPayment,
  pulsaManualWithdrawPayment,
  backofficeApi
}) => {
  /*
   Note. player bank card was design for withdraw at first
   */
  let [bank] = await Promise.all([
    backofficeApi.player.bankCard.add({
      brandId: platform.id,
      playerCode: player.code,
      bankType: pulsaPaymentMethod.bankType,
      paymentChannelId: pulsaManualWithdrawPayment.paymentChannelId,
      detail: {
        phone: "123456"
      }
    }),
    gotoPlayerListPage(page, platform.code)
  ])
  console.log("bank", bank, "player", player)

  let dialogSelector = `#apply-deposit-form-dialog`
  await openDialog(page, dialogSelector)

  await selectByValue(
    page,
    `${dialogSelector} select[name="method"]`,
    pulsaPaymentMethod.code
  )

  await selectByValue(
    page,
    `${dialogSelector} select[name="channel"]`,
    pulsaPaymentChannel.code
  )

  let form = {
    amount: 10,
    note: lorem.word()
  }

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

  let depositForm = await backofficeApi.fund.deposit.form(platform.id, formId)

  expect(depositForm.amount).equals(form.amount)
  expect(depositForm.applyInfo.sendPhone).equals(bank.detail.phone)
  expect(depositForm.applyInfo.sendNote).equals(form.note)
})
