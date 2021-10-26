import { chromium } from "playwright"
import { expect } from "chai"
import { StorageState } from "../auth"
import { host, headless } from "../env"
import { random } from "lodash"
import numeral from "numeral"
import { startOfDay, endOfTomorrow, format } from "date-fns"
import { lorem, phone, datatype, image, finance, internet, name } from "faker"
import clone from "clone-deep"
import { fillDatePicker } from "../fill"
import { goto } from "../sidebar"
import { selectRandomOption } from "../page/select"

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

    await gotoAdminUserListPage()
  })

  afterEach(async () => {
    await page.close()
  })

  after(async () => {
    await browser.close()
  })

  it("should able to add, search and edit user", async () => {
    let adminUser = await addUser(Type.Admin)
    await search(adminUser)

    await edit(adminUser)
  })

  const Type = {
    Admin: "Admin",
    Reseller: "Reseller",
    Licensee: "Licensee",
    Brand: "Brand"
  }

  const selectRole = async (type = Type.Admin) => {
    await page.selectOption(`select[name="roleType"]`, type)

    switch (type) {
      case Type.Reseller:
        await selectRandomOption(page, `select[name="resellerId"]`)
      case Type.Licensee:
        await selectRandomOption(page, `select[name="licenseeId"]`)
      case Type.Brand:
        await selectRandomOption(page, `select[name="brandId"]`)
    }

    return await selectRandomOption(page, `select[name="roleId"]`)
  }

  const addUser = async (type = Type.Admin) => {
    let DialogSelector = `#add-user-dialog`
    await page.click(`${DialogSelector}-disclosure`)
    await page.waitForSelector(DialogSelector)

    let password = `${internet.password(8)}a1`
    let user = {
      type,
      username: `${internet.userName()}-${Date.now()}`,
      password,
      name: `${name.firstName()} ${name.lastName()}`
    }

    await page.fill(`${DialogSelector} input[name="username"]`, user.username)
    let roleId = await selectRole(type)

    let departmentId = await selectRandomOption(
      page,
      `select[name="departmentId"]`
    )

    await page.fill(`${DialogSelector} input[name="name"]`, user.name)
    await page.fill(`${DialogSelector} input[name="password"]`, user.password)
    await page.fill(
      `${DialogSelector} input[name="confirmPassword"]`,
      user.password
    )

    await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().endsWith("/api/users") && response.status() === 200
        )
      }),
      page.click(`${DialogSelector} button[type="submit"]`)
    ])

    return {
      ...user,
      roleId,
      departmentId
    }
  }

  const search = async (user) => {
    await page.fill(`input[name="username"]`, user.username)

    await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().includes("/api/users") && response.status() === 200
        )
      }),
      page.click(`button[type="submit"]`)
    ])

    let UsernameSelector = `[data-column-id="username"]`
    await page.waitForSelector(UsernameSelector)
    let username = await page.textContent(UsernameSelector)
    expect(username).to.equal(user.username)

    let NameSelector = `[data-column-id="name"]`
    let name = await page.textContent(NameSelector)
    expect(name).to.equal(user.name)
  }

  const edit = async (user) => {
    let DialogSelector = `#edit-user-dialog`
    await page.click(`${DialogSelector}-disclosure`)

    user.name = `${name.firstName()} ${name.lastName()}`
    await page.fill(`input[name="name"]`, user.name)

    let id = await page.inputValue(`input[name="id"]`)
    let expectedUrl = `/api/users/${id}`
    await Promise.all([
      page.waitForResponse((response) => {
        return response.url().endsWith(expectedUrl) && response.status() === 200
      }),
      page.click(`${DialogSelector} button[type="submit"]`)
    ])

    await Promise.all([
      page.waitForSelector(DialogSelector, {
        state: "detached"
      }),
      page.waitForResponse((response) => {
        return (
          response.url().includes("/api/users") && response.status() === 200
        )
      })
    ])

    let NameSelector = `[data-column-id="name"]`
    await page.waitForSelector(NameSelector)
    let value = await page.textContent(NameSelector)
    expect(value).to.equal(user.name)

    return user
  }

  const block = async (user) => {}

  const editPassword = async (user) => {
    //TODO
  }

  const gotoAdminUserListPage = async () => {
    await goto({ page, value: "/system/admins" })
  }
})
