import base from "@playwright/test"
import { Fixture } from "./auth.js"
import faker from "@faker-js/faker"
import { selectRandomOption, selectByValue } from "../page/select.js"
import { openDialog } from "../page/dialog.js"

const test = base.extend(Fixture)
const { finance, commerce } = faker

test("add, search, edit and view platform deposit payment", async ({
  page,
  backofficeApi
}) => {
  const BankTransferCode = "BankTransfer"
  let [bankTransferPaymentMethod, brandId] = await Promise.all([
    backofficeApi.payment.findPaymentMethod(BankTransferCode),
    gotoAdminPlatformPaymentListPage(page)
  ])

  let payment = await addDepositBankTransferPayment(
    page,
    bankTransferPaymentMethod
  )
})

const addDepositBankTransferPayment = async (
  page,
  bankTransferPaymentMethod
) => {
  let DialogSelector = `#add-payment-dialog`
  await openDialog(page, DialogSelector)

  let MethodSelector = `${DialogSelector} select[name="paymentMethodId"]`
  await selectByValue(page, MethodSelector, bankTransferPaymentMethod.id)

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
  await page.goto(`/system/brandpayments`, { waitUntil: "networkidle" })
  return await selectRandomOption(page, `select[name="brandId"]`)
}
