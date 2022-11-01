import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { random } from "lodash-es"
import numeral from "numeral"
import { openDialog } from "../page/dialog.js"

const test = base.extend(Fixture)

test("edit platform credit", async ({ page, host, platformCode }) => {
  await gotoPlatformCreditPage(page, host)

  await page.fill(`input[name="keyword"]`, platformCode)
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`keyword=${platformCode}`) &&
        response.status() === 200
      )
    }),
    page.click(`button[type="submit"]`)
  ])

  let DialogSelector = `#platform-credit-dialog`
  await openDialog(page, DialogSelector)

  let creditInputLocator = page.locator(
    `${DialogSelector} input[name="credit"]`
  )
  let inputValueInString = await creditInputLocator.inputValue()
  let platformCredit = numeral(inputValueInString).value()
  let expectedValue = platformCredit + 10
  await page.fill(`${DialogSelector} input[name="credit"]`, `${expectedValue}`)

  let id = await page.inputValue(`${DialogSelector} input[name="id"]`)
  let expectedUrl = `/api/PlatformCredit/${id}/${expectedValue}`

  await Promise.all([
    page.waitForResponse((response) => {
      return response.url().endsWith(expectedUrl) && response.status() === 200
    }),
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/PlatformCredit?`) &&
        response.status() === 200
      )
    }),
    page.click(`${DialogSelector} button[type="submit"]`)
  ])

  let creditLocator = page.locator(`[data-column-id="credit"]`).first()
  let creditString = await creditLocator.textContent()
  let credit = numeral(creditString).value()
  expect(credit).to.equal(expectedValue)
})

const gotoPlatformCreditPage = async (page) => {
  await page.goto("/merchant/platformcredit", { waitUntil: "networkidle" })
}
