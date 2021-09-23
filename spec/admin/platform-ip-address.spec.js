import { chromium } from "playwright"
import { expect } from "chai"
import { StorageState } from "../auth"
import { host, headless } from "../env"
import { random } from "lodash"
import numeral from "numeral"
import { startOfDay, endOfTomorrow, format } from "date-fns"
import { lorem } from "faker"
import clone from "clone-deep"
import { fillDatePicker } from "../fill"
import { goto } from "../sidebar"
import platform from "../platform"

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

    await gotoPlatformIpAddressPage()

    let platformApiKey = await platform.apiKey({ page, brandCode: "GPI" })
    let platformToken = await platform.token({ page, brandCode: "GPI" })
    console.log("platformToken", platformToken)
  })

  afterEach(async () => {
    await page.close()
  })

  after(async () => {
    await browser.close()
  })

  it("should able to search ip address", async () => {})

  const gotoPlatformIpAddressPage = async () => {
    await goto({ page, value: "/platform/ipaddress" })
    await platform.selectFirst({ page })
  }
})
