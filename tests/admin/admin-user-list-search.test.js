import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { faker } from "@faker-js/faker"
import { selectRandomOption } from "../page/select.js"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test("search admin user", async ({ page, backofficeApi }) => {
  let name = `${faker.person.firstName()}${new Date().getTime()}`
  let [user] = await Promise.all([
    backofficeApi.user.platformUser.findOrCreate({
      name,
      username: name
    }),
    gotoAdminUserListPage(page)
  ])

  await page.fill(`input[name="username"]`, user.username)

  await Promise.all([
    page.waitForResponse(urlIncludes("/api/users")),
    page.click(`button[type="submit"]`)
  ])

  let UsernameSelector = `[data-column-id="username"]`
  await page.waitForSelector(UsernameSelector)
  let value = await page.textContent(UsernameSelector)
  expect(value).to.equal(user.username)

  //TODO: change name & status?
  
  //TODO: change pwd?
})

const gotoAdminUserListPage = async (page) => {
  await page.goto(`/system/admins`, { waitUntil: "networkidle" })
}
