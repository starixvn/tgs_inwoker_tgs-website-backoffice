import { chromium } from "playwright"
import { expect } from "chai"
import { StorageState, UserName } from "../auth"
import { host, headless } from "../env"

let browser
let context
let page

describe("Admin user", () => {
  before(async () => {
    browser = await chromium.launch({ headless: headless() })
    context = await browser.newContext({ storageState: StorageState.Admin })
    page = await context.newPage()

    await page.goto(host(), {
      waitUntil: "networkidle0"
    })
  })

  after(async () => {
    if (!page.isClosed()) {
      await browser.close()
    }
  })

  it("should show platform credit list", async () => {
    await gotoPlatformCreditPage()

    let code = await page.evaluate(() =>
      Array.from(window.document.querySelectorAll(`[data-column-id="code"]`))
        .map(({ textContent }) => textContent)
        .find((code) => code === "GPI")
    )
    expect(code).to.equal("GPI")
  })

  /* TODO
  it("should search platform credit by licensee name", async () => {
    await gotoPlatformCreditPage()

    //TODO: search by licensee name
  })
  */

  it("should seach platform credit by keyword", async () => {
    await gotoPlatformCreditPage()

    await searchByInputNameValue({
      name: "keyword",
      value: "gpi",
      page
    })

    let code = await page.evaluate(() =>
      Array.from(window.document.querySelectorAll(`[data-column-id="code"]`))
        .map(({ textContent }) => textContent)
        .find((code) => code === "GPI")
    )
    expect(code).to.equal("GPI")

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
