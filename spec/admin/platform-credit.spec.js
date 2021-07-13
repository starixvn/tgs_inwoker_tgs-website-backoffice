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

    let name = await page.$eval(
      `[data-column-id="licenseeName"]`,
      ({ textContent }) => textContent
    )
    expect(name).to.equal(licenseeName)

    await Promise.all([
      await page.click(`#clear-licenseeName-button`),
      await searchByInputNameValue({
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

    let code = await page.$eval(
      `[data-column-id="brandCode"]`,
      ({ textContent }) => textContent
    )
    expect(code).to.equal(brandCode)

    await Promise.all([
      await page.click(`#clear-keyword-button`),
      await searchByInputNameValue({
        name: "keyword",
        value: "something something not exist",
        page
      })
    ])

    let rows = await page.$$(`[data-column-id="code"]`)
    expect(rows.length).to.equal(0)
  })

  it("should able to update platform credit", async () => {
    let brandCodes = await getPlatformCodes()
    let index = random(brandCodes.length - 1)
    let brandCode = brandCodes[index]

    await Promise.all([
      page.click(`#${brandCode}-platform-credit-dialog-disclosure`),
      page.waitForSelector(`#platform-credit-dialog input[name="credit"]`)
    ])
    let inputValueInString = await page.$eval(
      `#platform-credit-dialog input[name="credit"]`,
      (input) => input.value
    )
    let platformCredit = numeral(inputValueInString).value()
    expect(platformCredit).to.be.above(0)

    let expectedValue = platformCredit + 10
    await Promise.all([
      page.fill(
        `#platform-credit-dialog input[name="credit"]`,
        `${expectedValue}`
      ),
      page.click(`#platform-credit-dialog button[type="submit"]`)
    ])

    await Promise.all([
      page.waitForLoadState("networkidle"),
      page.waitForTimeout(1000) /* FIXME: wait for render update*/
    ])

    let creditString = await page.$eval(
      `[data-row-index="${index}"] [data-column-id="credit"]`,
      ({ textContent }) => textContent
    )
    let credit = numeral(creditString).value()
    expect(credit).to.equal(expectedValue)
  })

  it("should able to pay platform credit and list payment list", async () => {
    let brandCodes = await getPlatformCodes()
    let index = random(brandCodes.length - 1)
    let brandCode = brandCodes[index]

    let amount = 10
    await Promise.all([
      page.click(`#${brandCode}-platform-credit-payment-dialog-disclosure`),
      page.waitForSelector(
        `#platform-credit-payment-dialog input[name="amount"]`
      ),
      page.fill(
        `#platform-credit-payment-dialog input[name="amount"]`,
        `${amount}`
      )
    ])

    let [paymentResponse] = await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().endsWith(`/pay/${amount}`) && response.status() === 200
        )
      }),
      page.click(`#platform-credit-payment-dialog button[type="submit"]`),
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
      await page.fill(`input[name="${name}"]`, value),
      await page.click(`button[type="submit"]`),
      page.waitForLoadState("networkidle"),
      page.waitForSelector("#platform-credit tbody")
    ])
})
