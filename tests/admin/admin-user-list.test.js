import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import faker from "faker"
import { selectRandomOption } from "../page/select.js"

const test = base.extend(Fixture)
const { internet, name } = faker

test("add, search and edit admin user", async ({ page }) => {
  await gotoAdminUserListPage(page)

  let user = await addUser(page, Type.Admin)
  await search(page, user)

  await edit(page, user)
})

const Type = {
  Admin: "Admin",
  Reseller: "Reseller",
  Licensee: "Licensee",
  Brand: "Brand"
}

const selectRole = async (page, type = Type.Admin) => {
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

const addUser = async (page, type = Type.Admin) => {
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
  let roleId = await selectRole(page, type)

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
      return response.url().endsWith("/api/users") && response.status() === 200
    }),
    page.click(`${DialogSelector} button[type="submit"]`)
  ])

  return {
    ...user,
    roleId,
    departmentId
  }
}

const search = async (page, user) => {
  await page.fill(`input[name="username"]`, user.username)

  await Promise.all([
    page.waitForResponse((response) => {
      return response.url().includes("/api/users") && response.status() === 200
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

const edit = async (page, user) => {
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
      return response.url().includes("/api/users") && response.status() === 200
    })
  ])

  let NameSelector = `[data-column-id="name"]`
  await page.waitForSelector(NameSelector)
  let value = await page.textContent(NameSelector)
  expect(value).to.equal(user.name)

  return user
}

const gotoAdminUserListPage = async (page) => {
  await page.goto(`/system/admins`)
}
