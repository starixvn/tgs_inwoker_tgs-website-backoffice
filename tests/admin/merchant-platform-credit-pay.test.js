import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { random } from "lodash-es"
import numeral from "numeral"
import { openDialog } from "../page/dialog.js"

const test = base.extend(Fixture)

test("pay platform credit and list payment list", async ({
  page,
  host,
  licensee,
  backofficeApi
}) => {
  let [platform] = await Promise.all([
    backofficeApi.platform.addPlatform({
      licenseeId: licensee.id
    }),
    gotoPlatformCreditPage(page, host)
  ])
  await page.fill(`input[name="keyword"]`, platform.code)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`keyword=${platform.code}`) &&
        response.status() === 200
      )
    }),
    page.click(`button[type="submit"]`)
  ])

  let DialogSelector = `#platform-credit-payment-dialog`
  await openDialog(page, DialogSelector)

  let amount = 10
  await page.fill(`${DialogSelector} input[name="amount"]`, `${amount}`)

  let [paymentResponse] = await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().endsWith(`/pay/${amount}`) && response.status() === 200
      )
    }),
    page.click(`${DialogSelector} button[type="submit"]`)
  ])

  let paymentResult = await paymentResponse.json()
  expect(paymentResult.valid).to.be.true

  let PaymentListDialogSelector = `#platform-credit-payment-list-dialog`
  await Promise.all([
    page.waitForResponse((response) => {
      let apiUrl = response.url()

      return apiUrl.includes(`paymentRecords`) && response.status() === 200
    }),
    openDialog(page, PaymentListDialogSelector)
  ])

  let paymentAmounts = await page.evaluate(() =>
    Array.from(
      window.document.querySelectorAll(
        `#platform-credit-payment-list-dialog [data-column-id="amount"]`
      )
    ).map(({ textContent }) => textContent)
  )

  expect(paymentAmounts.length).to.be.above(0)
})

const gotoPlatformCreditPage = async (page) => {
  await page.goto("/merchant/platformcredit", { waitUntil: "networkidle" })
}
