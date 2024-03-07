import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { faker } from "@faker-js/faker"
import { selectByValue, selectRandomOption } from "../page/select.js"
import { urlIncludes } from "../page/response.js"
import { gotoAdminUserListPage } from "./admin-user-list-page.js"
import { openDialog } from "../page/dialog.js"

const test = base.extend(Fixture)

test("add brand admin user", async ({
  page,
  reseller,
  licensee,
  platform,
  backofficeApi
}) => {
  await gotoAdminUserListPage(page)

  let DialogSelector = `#add-user-dialog`
  await openDialog(page, DialogSelector)

  let username = `${faker.person.firstName()}${new Date().getTime()}`
  await page.locator(`${DialogSelector} input[name="username"]`).fill(username)

  await selectByValue(
    page,
    `${DialogSelector} select[name="roleType"]`,
    "Brand"
  )

  await selectByValue(
    page,
    `${DialogSelector} select[name="resellerId"]`,
    reseller.id
  )
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

  await selectRandomOption(page, `${DialogSelector} select[name="roleId"]`)
  await selectRandomOption(
    page,
    `${DialogSelector} select[name="departmentId"]`
  )

  await page.locator(`${DialogSelector} input[name="name"]`).fill(username)

  let Password = `${faker.internet.password({ length: 8 })}a1`
  await page.locator(`${DialogSelector} input[name="password"]`).fill(Password)
  await page
    .locator(`${DialogSelector} input[name="confirmPassword"]`)
    .fill(Password)

  await Promise.all([
    page.waitForResponse(urlIncludes("/api/users")),
    page.locator(`${DialogSelector} button[type="submit"]`).click()
  ])

  let user = await backofficeApi.user.platformUser.find(username)
  expect(user.username).equals(username)
})
