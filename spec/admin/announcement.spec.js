import { chromium } from "playwright"
import { expect } from "chai"
import { StorageState } from "../auth"
import { host, headless } from "../env"
import { random } from "lodash"
import numeral from "numeral"

let browser
let context
let page

describe.skip("Admin user", () => {
  before(async () => {
    browser = await chromium.launch({ headless: headless() })
    context = await browser.newContext({ storageState: StorageState.Admin })
  })

  const gotoPlatformAnnouncementPage = async () => {
    let PlatformCreditSelector = `#sidebar a[href="/platform/announcement"]`
    await Promise.all([
      page.waitForNavigation(),
      page.click(PlatformCreditSelector),
      page.waitForLoadState("networkidle"),
      page.waitForSelector("#platform-credit tbody")
    ])
  }
})
