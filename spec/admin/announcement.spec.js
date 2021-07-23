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

  beforeEach(async () => {
    page = await context.newPage()

    await page.goto(host(), {
      waitUntil: "networkidle0"
    })

    await gotoPlatformAnnouncementPage()
  })

  afterEach(async () => {
    await page.close()
  })

  after(async () => {
    await browser.close()
  })

  it("should able to add -> approve -> change status -> update -> reject announcement", async () => {
    //TODO
    //1. select platform
    //2. add new record
    //3. view record and approve
    //4. click valid tab
    //5. change record status
    //6. edit record
    //7. back to verify tab
    //8. open record and reject it
    //9. record go to reject tab
  })

  const selectRandomPlatform = async () => {
    await page.waitForSelector(
      `#page-merchant-bar select[brandId="brandId"] option[value*="-"]`
    )
  }

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
