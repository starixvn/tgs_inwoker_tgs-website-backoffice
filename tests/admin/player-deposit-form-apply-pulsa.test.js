import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { openDialog } from "../page/dialog.js"
import { selectByValue } from "../page/select.js"
import { gotoPlayerListPage, searchPlayer } from "./player-list-page.js"
import { faker } from "@faker-js/faker"

const test = base.extend(Fixture)

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

  let dialogSelector = `#apply-deposit-form-dialog`
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes("/api/brandpayment/player") &&
        response.status() === 200
      )
    }),
    page.waitForResponse((response) => {
      let url = response.url()

      let isApi = url.includes(`/api/player/${player.code}`)
      console.log(
        "isApi",
        isApi,
        "url",
        url,
        "includes? [" + `/api/player/${player.code}` + "]"
      )
      if (isApi && !response.ok()) {
        throw Error(
          `get player api failed [ /api/player/${player.code} ] error`
        )
      }

      return isApi
    }),
    openDialog(page, dialogSelector)
  ])

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

  let phone = await page
    .locator(`${dialogSelector} input[name="phone"]`)
    .inputValue()
  expect(phone).equals(bank.detail.phone)

  let form = {
    amount: 10,
    note: faker.lorem.word()
  }

  await page.fill(`${dialogSelector} input[name="amount"]`, `${form.amount}`)
  await page.fill(`${dialogSelector} textarea[name="note"]`, form.note)

  let [applyFormResponse] = await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes("/api/ManualDeposit/Pulsa") &&
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
