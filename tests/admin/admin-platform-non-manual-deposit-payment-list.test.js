import base from "@playwright/test"
import { Fixture } from "./auth.js"
import faker from "@faker-js/faker"
import {
  selectRandomOption,
  selectByValue,
  selectByLabel
} from "../page/select.js"
import { openDialog } from "../page/dialog.js"

const test = base.extend(Fixture)
const { finance, commerce } = faker

console.warn("TODO: wait api update fix")
test.skip("non-manual platform deposit payment ", async ({
  page,
  platform
}) => {
  await gotoAdminPlatformPaymentListPage(page, platform.code)

  let name = "LeePay_Crypto_ETHEREUM"
  await searchPlatformPaymentBy(page, name)

  let DialogSelector = `#edit-platform-payment-dialog`
  await openDialog(page, DialogSelector)

  let platformPaymentId = await page.getAttribute(
    `table tbody tr`,
    "data-row-id"
  )
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().endsWith(`/api/brandpayment/${platformPaymentId}`) &&
        response.status() === 200
      )
    }),
    page.click(`${DialogSelector} button[type="submit"]`)
  ])
})

const searchPlatformPaymentBy = async (page, name) => {
  await page.fill(`input[name="keyword"]`, name)
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/brandpayment?`) &&
        response.status() === 200
      )
    }),
    page.click(`button[type="submit"]`)
  ])
}

const gotoAdminPlatformPaymentListPage = async (page, platformCode) => {
  await page.goto(`/system/brandpayments`, { waitUntil: "networkidle" })
  return await selectByLabel(page, `select[name="brandId"]`, platformCode)
}
