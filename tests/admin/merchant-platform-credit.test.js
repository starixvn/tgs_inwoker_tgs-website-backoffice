import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { random } from "lodash-es"
import numeral from "numeral"
import { openDialog } from "../page/dialog.js"

const test = base.extend(Fixture)

test("search by licensee name", async ({ page }) => {
  await gotoPlatformCreditPage(page)

  let TableSelector = `#platform-credit`
  let LicenseeNameSelector = `${TableSelector} [data-column-id="licenseeName"]`
  await page.waitForSelector(LicenseeNameSelector)

  let licenseeNames = await page
    .locator(`#platform-credit [data-column-id="licenseeName"]`)
    .allTextContents()
  if (licenseeNames.length === 0) {
    console.warn("no licensee names?")
    return
  }

  let index = random(licenseeNames.length - 1)
  let licenseeName = licenseeNames[index]
  await searchByInputNameValue(page, {
    name: "licenseeName",
    value: licenseeName
  })

  await page.waitForSelector(`[data-column-id="licenseeName"]`)
  let name = await page.$eval(
    `[data-column-id="licenseeName"]`,
    ({ textContent }) => textContent
  )
  expect(name).to.equal(licenseeName)

  await Promise.all([
    page.click(`#clear-licenseeName-button`),
    searchByInputNameValue(page, {
      name: "licenseeName",
      value: "something something not exist"
    })
  ])

  let rows = await page.$$(`[data-column-id="code"]`)
  expect(rows.length).to.equal(0)
})

test("search by code", async ({ page, host }) => {
  await gotoPlatformCreditPage(page, host)

  let TableSelector = `#platform-credit`
  let brandCodes = await getPlatformCodes(page)
  if (brandCodes.length === 0) {
    console.warn("no brand codes?")
    return
  }

  let index = random(brandCodes.length - 1)
  let brandCode = brandCodes[index]

  await searchByInputNameValue(page, {
    name: "keyword",
    value: brandCode
  })

  let BrandCodeSelector = `${TableSelector} [data-column-id="brandCode"]`
  let codeLocator = page.locator(BrandCodeSelector).first()
  let code = await codeLocator.textContent()
  expect(code).to.equal(brandCode)

  await page.click(`#clear-keyword-button`)
  await searchByInputNameValue(page, {
    name: "keyword",
    value: "something something not exist"
  })

  let rows = await page.$$(`[data-column-id="code"]`)
  expect(rows.length).to.equal(0)
})

test("update platform credit", async ({ page, host }) => {
  await gotoPlatformCreditPage(page, host)

  let DialogSelector = `#platform-credit-dialog`
  let brandCodes = await getPlatformCodes(page)
  let index = random(brandCodes.length - 1)
  let brandCode = brandCodes[index]

  await Promise.all([
    page.click(`#${brandCode}-platform-credit-dialog-disclosure`),
    page.waitForSelector(`${DialogSelector} input[name="credit"]`)
  ])
  let inputValueInString = await page.$eval(
    `${DialogSelector} input[name="credit"]`,
    (input) => input.value
  )
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

  let creditLocator = page.locator(
    `[data-row-index="${index}"] [data-column-id="credit"]`
  )
  let creditString = await creditLocator.textContent()
  let credit = numeral(creditString).value()
  expect(credit).to.equal(expectedValue)
})

test("pay platform credit and list payment list", async ({
  page,
  host,
  platformCode
}) => {
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
  await openDialog(page, PaymentListDialogSelector)
  page.waitForSelector(
    `${PaymentListDialogSelector} #platform-credit-payments tbody`
  )

  let paymentAmounts = await page.evaluate(() =>
    Array.from(
      window.document.querySelectorAll(
        `#platform-credit-payment-list-dialog [data-column-id="amount"]`
      )
    ).map(({ textContent }) => textContent)
  )

  expect(paymentAmounts.length).to.be.above(0)
})

const getPlatformCodes = async (page) => {
  let locator = page.locator(`[data-column-id="brandCode"]`)
  return locator.allTextContents()
  /*
    await page.evaluate(() =>
    Array.from(
      window.document.querySelectorAll(`[data-column-id="brandCode"]`)
    ).map(({ textContent }) => textContent)
  )
  */
}

const gotoPlatformCreditPage = async (page) => {
  await page.goto("/merchant/platformcredit", { waitUntil: "networkidle" })
}

const searchByInputNameValue = async (page, { name = "", value = "" }) => {
  await Promise.all([
    page.fill(`input[name="${name}"]`, value),
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/PlatformCredit?`) &&
        response.status() === 200
      )
    }),
    page.click(`button[type="submit"]`)
  ])

  await page.waitForSelector(`#platform-credit tbody`)
}
