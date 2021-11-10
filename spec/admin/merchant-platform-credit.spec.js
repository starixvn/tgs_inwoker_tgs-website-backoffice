import { chromium } from "playwright"
import { expect } from "chai"
import { StorageState, UserName } from "../auth"
import { host, headless } from "../env"
import { random } from "lodash"
import numeral from "numeral"

let browser
let context
let page

describe("Admin user", () => {
  before(async () => {
    browser = await chromium.launch({ headless: headless() })
    context = await browser.newContext({ storageState: StorageState.Admin })
  })

  beforeEach(async () => {
    page = await context.newPage()

    await page.goto(host(), {
      waitUntil: "networkidle0"
    })

    await gotoPlatformCreditPage()
  })

  afterEach(async () => {
    await page.close()
  })

  after(async () => {
    await browser.close()
  })

  it("should able to search by licensee name", async () => {
    let licenseeNames = await page.evaluate(() =>
      Array.from(
        window.document.querySelectorAll(`[data-column-id="licenseeName"]`)
      ).map(({ textContent }) => textContent)
    )
    let index = random(licenseeNames.length - 1)
    let licenseeName = licenseeNames[index]
    await searchByInputNameValue({
      name: "licenseeName",
      value: licenseeName,
      page
    })

    await page.waitForSelector(`[data-column-id="licenseeName"]`)
    let name = await page.$eval(
      `[data-column-id="licenseeName"]`,
      ({ textContent }) => textContent
    )
    expect(name).to.equal(licenseeName)

    await Promise.all([
      page.click(`#clear-licenseeName-button`),
      searchByInputNameValue({
        name: "licenseeName",
        value: "something something not exist",
        page
      })
    ])

    let rows = await page.$$(`[data-column-id="code"]`)
    expect(rows.length).to.equal(0)
  })

  it("should able to search by code", async () => {
    let brandCodes = await getPlatformCodes()
    let index = random(brandCodes.length - 1)
    let brandCode = brandCodes[index]

    await searchByInputNameValue({
      name: "keyword",
      value: brandCode,
      page
    })

    await page.waitForSelector(`[data-column-id="brandCode"]`)
    let code = await page.$eval(
      `[data-column-id="brandCode"]`,
      ({ textContent }) => textContent
    )
    expect(code).to.equal(brandCode)

    await page.click(`#clear-keyword-button`)
    await searchByInputNameValue({
      name: "keyword",
      value: "something something not exist",
      page
    })

    let rows = await page.$$(`[data-column-id="code"]`)
    expect(rows.length).to.equal(0)
  })

  it("should able to update platform credit", async () => {
    let DialogSelector = `#platform-credit-dialog`
    let brandCodes = await getPlatformCodes()
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

    let id = await page.inputValue(`${DialogSelector} input[name="id"]`)
    let expectedUrl = `/api/PlatformCredit/${id}/${expectedValue}`

    await Promise.all([
      page.fill(`${DialogSelector} input[name="credit"]`, `${expectedValue}`),
      page.waitForResponse((response) => {
        return response.url().endsWith(expectedUrl) && response.status() === 200
      }),
      page.click(`${DialogSelector} button[type="submit"]`)
    ])

    await Promise.all([
      page.waitForSelector(DialogSelector, { state: "detached" }),
      page.waitForResponse((response) => {
        return (
          response.url().includes(`/api/PlatformCredit?`) &&
          response.status() === 200
        )
      })
    ])

    let creditString = await page.$eval(
      `[data-row-index="${index}"] [data-column-id="credit"]`,
      ({ textContent }) => textContent
    )
    let credit = numeral(creditString).value()
    expect(credit).to.equal(expectedValue)
  })

  it("should able to pay platform credit and list payment list", async () => {
    let DialogSelector = `#platform-credit-payment-dialog`

    let brandCodes = await getPlatformCodes()
    let index = random(brandCodes.length - 1)
    let brandCode = brandCodes[index]

    let amount = 10
    await Promise.all([
      page.click(`#${brandCode}-platform-credit-payment-dialog-disclosure`),
      page.waitForSelector(`${DialogSelector} input[name="amount"]`),
      page.fill(`${DialogSelector} input[name="amount"]`, `${amount}`)
    ])

    let [paymentResponse] = await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().endsWith(`/pay/${amount}`) && response.status() === 200
        )
      }),
      page.click(`${DialogSelector} button[type="submit"]`),
      page.waitForLoadState("networkidle")
    ])

    let paymentResult = await paymentResponse.json()
    expect(paymentResult.valid).to.be.true

    await Promise.all([
      page.click(
        `#${brandCode}-platform-credit-payment-list-dialog-disclosure`
      ),
      page.waitForSelector(
        `#platform-credit-payment-list-dialog #platform-credit-payments tbody`
      )
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

  const getPlatformCodes = async () =>
    await page.evaluate(() =>
      Array.from(
        window.document.querySelectorAll(`[data-column-id="brandCode"]`)
      ).map(({ textContent }) => textContent)
    )

  const gotoPlatformCreditPage = async () => {
    let PlatformCreditSelector = `#sidebar a[href="/merchant/platformcredit"]`
    await Promise.all([
      page.waitForNavigation(),
      page.click(PlatformCreditSelector),
      page.waitForLoadState("networkidle"),
      page.waitForSelector("#platform-credit tbody")
    ])
  }

  const searchByInputNameValue = async ({ name = "", value = "", page }) =>
    await Promise.all([
      page.fill(`input[name="${name}"]`, value),
      page.waitForResponse((response) => {
        return (
          response.url().includes(`/api/PlatformCredit?`) &&
          response.status() === 200
        )
      }),
      page.click(`button[type="submit"]`),
      page.waitForLoadState("networkidle")
    ])
})
