import { chromium } from "playwright"
import { expect } from "chai"
import { StorageState } from "../auth"
import { host, headless } from "../env"
import { random } from "lodash"
import numeral from "numeral"
import { startOfDay, endOfTomorrow, format } from "date-fns"
import {
  lorem,
  phone,
  datatype,
  image,
  finance,
  internet,
  commerce
} from "faker"
import clone from "clone-deep"
import { fillDatePicker } from "../fill"
import { goto } from "../sidebar"

let browser
let context
let page

//TODO: bo-api need add search function to able to test add department
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

    await gotoAdminDepartmentListPage()
  })

  afterEach(async () => {
    await page.close()
  })

  after(async () => {
    await browser.close()
  })

  it("should able to add, edit and delete department", async () => {})
})

export const addAdminDeportment = async (page) => {
  let department = {
    name: `Admin-${commerce.department()}`
  }

  return department
}

export const addResellerDepartment = async () => {}

export const addLicenseeDepartment = async () => {}

export const addPlatformDepartment = async (page) => {
  await gotoAdminDepartmentListPage()

  let DialogSelector = `#add-department-dialog-disclosure`
  await page.click(DialogSelector)
  await page.waitForSelector(DialogSelector)

  let department = {
    name: `Platform-${commerce.department()}`
  }
  return department
}

const search = async (department) => {}

export const gotoAdminDepartmentListPage = async (page) => {
  await goto({ page, value: "/system/departments" })
}
