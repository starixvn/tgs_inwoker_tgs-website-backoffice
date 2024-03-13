import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { faker } from "@faker-js/faker"
import { urlIncludes } from "../page/response.js"
import {
  gotoAdminUserListPage,
  searchAdminUser
} from "./admin-user-list-page.js"
import { openDialog } from "../page/dialog.js"
import { selectByValue } from "../page/select.js"

const test = base.extend(Fixture)

test("disable brand admin user", async ({ page, backofficeApi }) => {
  let username = `${faker.person.firstName()}${new Date().getTime()}`
  let [user] = await Promise.all([
    backofficeApi.user.platformUser.findOrCreate({
      username,
      name: username
    }),
    gotoAdminUserListPage(page)
  ])

  await searchAdminUser(page, username)

  let DialogSelector = `#edit-user-dialog`
  openDialog(page, DialogSelector)

  let Disabled = "Disabled"
  await selectByValue(page, `${DialogSelector} select[name="status"]`, Disabled)

  let [response] = await Promise.all([
    page.waitForResponse(urlIncludes(`/api/users/${user.id}`)),
    page.locator(`${DialogSelector} button[type="submit"]`).click()
  ])

  let result = await response.json()
  expect(result.valid).to.be.true
})
