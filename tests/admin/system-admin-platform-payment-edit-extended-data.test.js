import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { faker } from "@faker-js/faker"
import { openDialog } from "../page/dialog.js"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test("edit platform payment extended data", async ({
  page,
  platform,
  backofficeApi,
  customBankManualPaymentMethodChannel
}) => {
  let [platformPayment] = await Promise.all([
    backofficeApi.platform.payment.findOrCreate({
      brandId: platform.id,
      transferType: backofficeApi.platform.payment.TransferType.Deposit,
      paymentMethodChannelId: customBankManualPaymentMethodChannel.id
    }),
    page.goto("/systemadmin/brandpayments", { waitUntil: "networkidle" })
  ])

  await page.fill(`input[name="keyword"]`, platformPayment.channelName)
  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/brandpayment?`)),
    page.click(`button[type="submit"]`)
  ])

  let DialogSelector = "#edit-platform-payment-dialog"
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response
          .url()
          .includes(`/api/brandpayment/info/${platformPayment.id}`) &&
        response.status() === 200
      )
    }),
    openDialog(page, DialogSelector)
  ])

  let expected = { string: `${faker.lorem.word()}-${Date.now()}` }
  let jsonString = JSON.stringify(expected)
  await page.click(`${DialogSelector} .monaco-editor .monaco-mouse-cursor-text`)
  await page.keyboard.press("Control+A")
  await page.keyboard.press("Backspace")
  await page.keyboard.type(jsonString)

  const halfSecond = 500
  await page.waitForTimeout(halfSecond)

  let SubmitSelector = `${DialogSelector} button[type="submit"]`
  await page.focus(SubmitSelector)

  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/brandpayment/extendeddata/`)),
    page.click(SubmitSelector)
  ])
  await page.waitForSelector(DialogSelector, { state: "detached" })

  let platformPaymentRecord = await backofficeApi.platform.payment.get(
    platformPayment.id
  )
  expect(platformPaymentRecord.extendedData.string).to.equals(expected.string)
})
