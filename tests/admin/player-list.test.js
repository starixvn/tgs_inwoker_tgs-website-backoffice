import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { goto } from "../sidebar.js"
import { selectPlatformByCode } from "../page/content.js"

const test = base.extend(Fixture)

test("should able to search, view and edit player", async ({
  page,
  adminUser,
  platformCode,
  platformToken,
  player
}) => {
  let brandId = await gotoPlayerListPage(page, platformCode)
  await page.fill(`input[name="username"]`, player.username)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`username=${player.username}`) &&
        response.status() === 200
      )
    }),
    page.click(`button[type="submit"]`)
  ])

  let UsernameSelector = `[data-column-id="username"]`
  let username = await page.textContent(UsernameSelector)
  expect(username).to.equal(player.username)

  //TODO: view & edit
})

const gotoPlayerListPage = async (page, platformCode) => {
  await goto({ page, value: "/playermanagement/playerlist" })
  return await selectPlatformByCode(page, platformCode)
}
