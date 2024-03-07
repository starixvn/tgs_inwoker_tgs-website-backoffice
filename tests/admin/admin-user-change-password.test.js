import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { faker } from "@faker-js/faker"
import { selectRandomOption } from "../page/select.js"
import { urlIncludes } from "../page/response.js"
import {
  gotoAdminUserListPage,
  searchAdminUser
} from "./admin-user-list-page.js"
import { openDialog } from "../page/dialog.js"

const test = base.extend(Fixture)

test("change brand admin user password", async ({ page, backofficeApi }) => {
  let username = `${faker.person.firstName()}${new Date().getTime()}`
  let [user] = await Promise.all([
    backofficeApi.user.platformUser.findOrCreate({
      username,
      name: username
    }),
    gotoAdminUserListPage(page)
  ])

  await searchAdminUser(page, username)

  let DialogSelector = `#edit-user-password-dialog`
  await openDialog(page, DialogSelector)

  let Password = faker.internet.password({ length: 8 })
  await page.locator(`${DialogSelector} input[name="password"]`).fill(Password)
  await page
    .locator(`${DialogSelector} input[name="confirmPassword"]`)
    .fill(Password)

  let [response] = await Promise.all([
    page.waitForResponse(urlIncludes(`/api/users/${user.id}/password`)),
    page.locator(`${DialogSelector} button[type="submit"]`).click()
  ])
  let result = await response.json()
  expect(result.valid).to.be.true
})
