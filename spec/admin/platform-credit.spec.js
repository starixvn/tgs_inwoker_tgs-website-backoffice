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
      Array.from(window.document.querySelectorAll(`[data-column="code"]`))
        .map(({ textContent }) => textContent)
        .find((code) => code === "GPI")
    )
    expect(code).to.equal("GPI")
  })

  it("should seach platform credit by keyword", async () => {
    await gotoPlatformCreditPage()

    await Promise.all([
      await page.fill(`input[name="keyword"]`, "gpi"),
      await page.click(`button[type="submit"]`),
      page.waitForLoadState("networkidle"),
      page.waitForSelector("#platform-credit tbody")
    ])

    let code = await page.evaluate(() =>
      Array.from(window.document.querySelectorAll(`[data-column="code"]`))
        .map(({ textContent }) => textContent)
        .find((code) => code === "GPI")
    )
    expect(code).to.equal("GPI")

    await Promise.all([
      await page.click(`#clear-keyword-button`),
      await page.fill(`input[name="keyword"]`, "something something not exist"),
      await page.click(`button[type="submit"]`),
      page.waitForLoadState("networkidle"),
      page.waitForSelector("#platform-credit tbody")
    ])

    let rows = await page.$$(`[data-column="code"]`)
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
})
