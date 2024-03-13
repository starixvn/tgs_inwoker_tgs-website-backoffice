import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import {
  gotoPlayerListPage,
  searchPlayer,
  openEditPlayerDialog
} from "./player-list-page.js"
import { faker } from "@faker-js/faker"
import { urlIncludes } from "../page/response.js"
import { last } from "lodash-es"

const test = base.extend(Fixture)

test("update player vip level", async ({
  page,
  vipPlatform,
  operatorApi,
  brandCertApi,
  backofficeApi
}) => {
  let [platformToken] = await Promise.all([
    brandCertApi.platformToken(vipPlatform.code),
    gotoPlayerListPage(page, vipPlatform.code)
  ])

  let [player, vipList] = await Promise.all([
    operatorApi.player.createAndLogin(platformToken),
    backofficeApi.platform.vip.list(vipPlatform.id)
  ])
  await searchPlayer(page, player)

  let DialogSelector = await openEditPlayerDialog(page)

  let vip = last(vipList)
  await page
    .locator(`${DialogSelector} select[name="vipId"]`)
    .selectOption(vip.id)

  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/player/info/${player.code}`)),
    page.click(
      `${DialogSelector} [aria-labelledby="player"] button[type="submit"]`
    )
  ])

  let record = await backofficeApi.player.getPlayer(player.code)
  expect(record.vipId).to.equals(vip.id)
})
