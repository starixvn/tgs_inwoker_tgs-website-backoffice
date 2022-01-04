import base from "@playwright/test"
import { Fixture } from "./auth.js"
import faker from "faker"
import { selectRandomOption } from "../page/select.js"

const test = base.extend(Fixture)
const { finance, commerce } = faker

test("add, search, edit and read platform payment", async ({ page }) => {
  let brandId = await gotoAdminPlatformPaymentListPage(page)

  let payment = await addDepositPayment(page)
  //TODO: search
  //TODO: edit
  //TODO: change order
})

const addDepositPayment = async (page) => {
  let DialogSelector = `#add-payment-dialog`
  await page.click(`${DialogSelector}-disclosure`)

  await page.waitForSelector(DialogSelector)

  let ChannelSelectSelector = `${DialogSelector} select[name="paymentChannelId"]`
  await selectRandomOption(page, ChannelSelectSelector)

  let payment = {
    channelName: commerce.productName(),
    extendedData: {
      name: finance.accountName(),
      bankAccount: finance.account()
    },
    transferLimitFrom: 0,
    transferLimitTo: 100,
    depositedAmountMin: 10,
    depositedAmountMax: 1000
  }
  await page.fill(
    `${DialogSelector} input[name="channelName"]`,
    payment.channelName
  )
  await page.fill(
    `${DialogSelector} input[name="extendedData.name"]`,
    payment.extendedData.name
  )
  await page.fill(
    `${DialogSelector} input[name="extendedData.bankAccount"]`,
    payment.extendedData.bankAccount
  )
  await page.fill(
    `${DialogSelector} input[name="transferLimitFrom"]`,
    `${payment.transferLimitFrom}`
  )
  await page.fill(
    `${DialogSelector} input[name="transferLimitTo"]`,
    `${payment.transferLimitTo}`
  )
  await page.fill(
    `${DialogSelector} input[name="depositedAmountMin"]`,
    `${payment.depositedAmountMin}`
  )

  await page.check(
    `${DialogSelector} input[name="depositedAmountUnlimited"] + .bb-CheckboxIcon`
  )

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().endsWith("/api/brandpayment/deposit") &&
        response.status() === 200
      )
    }),
    page.click(`${DialogSelector} button[type="submit"]`)
  ])

  return payment
}

const gotoAdminPlatformPaymentListPage = async (page) => {
  await page.goto(`/system/brandpayments`)
  return await selectRandomOption(page, `select[name="brandId"]`)
}
