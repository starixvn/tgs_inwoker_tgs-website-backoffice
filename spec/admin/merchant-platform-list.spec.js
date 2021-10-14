import { chromium } from "playwright"
import { expect } from "chai"
import { StorageState } from "../auth"
import { host, headless } from "../env"
import { random } from "lodash"
import numeral from "numeral"
import { startOfDay, endOfTomorrow, format } from "date-fns"
import { lorem, phone, datatype, image } from "faker"
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

    await gotoPlatformListPage()
  })

  afterEach(async () => {
    await page.close()
  })

  after(async () => {
    await browser.close()
  })

  it("should able to edit platform logo", async () => {
    let record = await editLogo()
    await editLogo(record)
  })

  const editLogo = async (record = {}) => {
    let DialogSelector = `#platform-logo-dialog`
    await page.click(`${DialogSelector}-disclosure`)
    await page.waitForSelector(DialogSelector)

    if (record.mobile) {
      let url = await page.inputValue(`${DialogSelector} input[name="mobile"]`)
      expect(url).to.equal(record.mobile)
    }

    if (record.desktop) {
      let url = await page.inputValue(`${DialogSelector} input[name="desktop"]`)
      expect(url).to.equal(record.desktop)
    }

    if (record.loading) {
      let url = await page.inputValue(`${DialogSelector} input[name="loading"]`)
      expect(url).to.equal(record.loading)
    }

    let randomRecord = randomLogo()

    await page.fill(
      `${DialogSelector} input[name="mobile"]`,
      randomRecord.mobile
    )
    await page.fill(
      `${DialogSelector} input[name="desktop"]`,
      randomRecord.desktop
    )
    await page.fill(
      `${DialogSelector} input[name="loading"]`,
      randomRecord.loading
    )

    await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().endsWith(`/api/brand/logo`) &&
          response.status() === 200
        )
      }),
      page.click(`${DialogSelector} button[type="submit"]`)
    ])

    return randomRecord
  }

  const randomLogo = () => ({
    desktop: image.imageUrl(),
    mobile: image.imageUrl(),
    loading: image.imageUrl()
  })

  const gotoPlatformListPage = async () => {
    await goto({ page, value: "/merchant/brands" })
  }
})
