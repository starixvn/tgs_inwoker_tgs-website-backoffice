import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { random } from "lodash-es"
import {
  startOfDay,
  startOfTomorrow,
  endOfTomorrow,
  format,
  addWeeks
} from "date-fns"
import { fillDatePicker } from "../fill.js"
import { selectPlatformByCode } from "../page/content.js"
import { optionValues } from "../page/select.js"
import { openDialog } from "../page/dialog.js"
import { faker } from "@faker-js/faker"
import { urlIncludes } from "../page/response.js"
import { searchByName } from "./promotion-list-page.js"

const test = base.extend(Fixture)

test("update dummy reward promotion", async ({
  page,
  platform,
  backofficeApi,
  promotionSetting
}) => {
  let [promotion] = await Promise.all([
    backofficeApi.promotion.reward.dummy.add({
      brandId: platform.id
    }),
    gotoPromotionPage(page, platform.code)
  ])

  //TODO: change from, to
  promotion.subSubject = faker.lorem.word()

  await searchByName(page, promotion.name)

  let DialogSelector = `#edit-promotion-dialog`
  await openDialog(page, DialogSelector)

  await page.fill(
    `${DialogSelector} input[name="subSubject"]`,
    `${promotion.subSubject}`
  )

  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/promotion/main/${promotion.id}`)),
    page.waitForResponse(urlIncludes(`/api/promotion/content/${promotion.id}`)),
    page.waitForResponse(urlIncludes(`/api/promotion/rule/${promotion.id}`)),
    page.click(`${DialogSelector} button[type="submit"]`)
  ])

  let [mainInfo, content] = await Promise.all([
    backofficeApi.promotion.mainInfo.fetch({
      platformId: platform.id,
      name: promotion.name
    }),
    backofficeApi.promotion.content.fetch({
      platformId: platform.id,
      name: promotion.name
    })
  ])

  expect(content.subSubject).equals(promotion.subSubject)
})

const gotoPromotionPage = async (page, platformCode) => {
  await page.goto("/promotion/promotionlist", { waitUntil: "networkidle" })
  return await selectPlatformByCode(page, platformCode)
}
