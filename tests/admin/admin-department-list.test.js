import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { selectByValue } from "../page/select.js"
import { expect } from "chai"
import { faker } from "@faker-js/faker"
import { urlIncludes } from "../page/response.js"
import { openDialog } from "../page/dialog.js"

const test = base.extend(Fixture)

test("admin department: add > edit > del", async ({
  page,
  reseller,
  licensee,
  departmentPlatform: platform
}) => {
  await page.goto("/system/departments", { waitUntil: "networkidle" })

  let departmentName = await add({ page, reseller, licensee, platform })

  departmentName = await edit({ page, platform, departmentName })

  await del({
    page,
    departmentName
  })
})

const add = async ({ page, reseller, licensee, platform }) => {
  let name = faker.lorem.word()

  let DialogSelector = `#add-department-dialog`
  await openDialog(page, DialogSelector)

  await selectByValue(
    page,
    `${DialogSelector} select[name="resellerId"]`,
    reseller.id
  )

  await selectByValue(
    page,
    `${DialogSelector} select[name="licenseeId"]`,
    licensee.id
  )

  await selectByValue(
    page,
    `${DialogSelector} select[name="brandId"]`,
    platform.id
  )

  await page.locator(`${DialogSelector} input[name="name"]`).fill(name)

  await Promise.all([
    page.waitForResponse(urlIncludes("/api/department")),
    page.locator(`${DialogSelector} button[type="submit"]`).click()
  ])

  return name
}

const edit = async ({ page, platform, departmentName }) => {
  await page.locator(`input[name="name"]`).fill(departmentName)
  await Promise.all([
    page.waitForResponse(urlIncludes("/api/department?")),
    page.locator(`button[type="submit"]`).click()
  ])

  let DialogSelector = `#edit-department-dialog`
  await openDialog(page, DialogSelector)

  let nameInputLocator = page.locator(`${DialogSelector} input[name="name"]`)
  await nameInputLocator.clear()

  let name = `${platform.name}-${faker.lorem.word()}-dept`
  await nameInputLocator.fill(name)

  await Promise.all([
    page.waitForResponse(urlIncludes("/api/department/")),
    page.locator(`${DialogSelector} button[type="submit"]`).click()
  ])

  return name
}

const del = async ({ page, departmentName }) => {
  await page.locator(`input[name="name"]`).fill(departmentName)
  await Promise.all([
    page.waitForResponse(urlIncludes("/api/department?")),
    page.locator(`button[type="submit"]`).click()
  ])

  let DialogSelector = `#delete-department-dialog`
  await openDialog(page, DialogSelector)

  let [response] = await Promise.all([
    page.waitForResponse(urlIncludes("/api/department/")),
    page.locator(`${DialogSelector} button[type="submit"]`).click()
  ])

  let result = await response.json()
  expect(result.valid).to.be.true
}
