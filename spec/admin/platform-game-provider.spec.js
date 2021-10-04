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
import select from "../select"

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

    await gotoPlatformGameProviderListPage()
  })

  afterEach(async () => {
    await page.close()
  })

  after(async () => {
    await browser.close()
  })

  it("should able to search, change status, edit and default maintananice", async () => {
    let record = await editLogo()
    await editLogo(record)
  })

  const getGameProviderNames = async () => {
    let gameProviderNameSelector = `[data-column-id="gameProviderName"]`
    page.waitForSelector(``)
  }

  const searchGameProvider = async (keyword) => {}

  const editGameProvider = async () => {}

  const editDefaultMaintenance = async () => {}

  const gotoPlatformGameProviderListPage = async () => {
    await goto({ page, value: "/game/brandproviders" })
  }
})
