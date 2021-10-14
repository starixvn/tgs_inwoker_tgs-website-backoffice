import { chromium } from "playwright"
import { expect } from "chai"
import { StorageState } from "../auth"
import { host, headless } from "../env"
import { random } from "lodash"
import numeral from "numeral"
import { startOfDay, endOfTomorrow, format } from "date-fns"
import { lorem, phone, datatype, image, finance, internet } from "faker"
import clone from "clone-deep"
import { fillDatePicker } from "../fill"
import { goto } from "../sidebar"

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

    await gotoAdminUserListPage()
  })

  afterEach(async () => {
    await page.close()
  })

  after(async () => {
    await browser.close()
  })

  it("should able to add, search and edit user", async () => {})

  const addAdminUser = async () => {
    let password = `${internet.password(8)}a1`
    let user = {
      username: internet.userName(),
      password
    }
  }

  const addResellerUser = async () => {}

  const addLicenseeUser = async () => {}

  const addPlatformUser = async () => {}

  const search = async (user) => {}

  const edit = async () => {}

  const gotoAdminUserListPage = async () => {
    await goto({ page, value: "/system/admins" })
  }
})
