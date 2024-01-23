import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { gotoPlayerListPage } from "./player-list-page.js"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test("player list", async ({ page, platformCode, player }) => {
  await gotoPlayerListPage(page, platformCode)
  await page.fill(`input[name="username"]`, player.username)

  await Promise.all([
    page.waitForResponse(urlIncludes(`username=${player.username}`)),
    page.click(`button[type="submit"]`)
  ])

  let UsernameSelector = `[data-column-id="username"]`
  let username = await page.textContent(UsernameSelector)
  expect(username).to.equal(player.username)
})
