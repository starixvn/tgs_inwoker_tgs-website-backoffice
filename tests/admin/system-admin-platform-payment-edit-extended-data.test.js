import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import faker from "@faker-js/faker"
import { openDialog } from "../page/dialog.js"

const test = base.extend(Fixture)

test("edit platform payment extended data", async ({
  page,
  platform,
  backofficeApi
}) => {
  await page.goto("/systemadmin/brandpayments", { waitUntil: "networkidle" })
  let platformPayment = await backofficeApi.platform.payment.addDeposit({
    brandId: platform.id
  })

  await page.fill(`input[name="keyword"]`, platformPayment.channelName)
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(platformPayment.channelName) &&
        response.status() === 200
      )
    }),
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

  let jsonString = faker.datatype.json()
  await page.click(`${DialogSelector} .monaco-editor .monaco-mouse-cursor-text`)
  await page.keyboard.press("Control+A")
  await page.keyboard.press("Backspace")
  await page.keyboard.type(jsonString)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/brandpayment/extendeddata/`) &&
        response.status() === 200
      )
    }),
    page.click(`${DialogSelector} button[type="submit"]`)
  ])

  //TODO: how to check extendeddata?
})
