import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { gotoPlayerListPage } from "./player-list-page.js"
import { urlIncludes } from "../page/response.js"
import { selectPlatformByCode } from "../page/content.js"

const test = base.extend(Fixture)

test("player list", async ({ page, platform, player }) => {
  await page.goto("/playermanagement/onlineplayerlist", {
    waitUntil: "networkidle"
  })

  await selectPlatformByCode(page, platform.code)

  await page.fill(`input[name="username"]`, player.username)

  await Promise.all([
    page.waitForResponse(urlIncludes(`username=${player.username}`)),
    page.click(`button[type="submit"]`)
  ])

  //TODO: simulate online player?
})
