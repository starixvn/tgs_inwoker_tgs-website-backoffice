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
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test("view dummy reward promotion", async ({
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

  await searchByName(page, promotion.name)

  let DialogSelector = `#view-promotion-dialog`
  await openDialog(page, DialogSelector)

  let promotionType = await page
    .locator(`${DialogSelector} select[name="promotionType"]`)
    .inputValue()
  expect(promotionType).equals(promotion.promotionType)

  let name = await page
    .locator(`${DialogSelector} input[name="name"]`)
    .inputValue()
  expect(name).equals(promotion.name)

  let subSubject = await page
    .locator(`${DialogSelector} input[name="subSubject"]`)
    .inputValue()
  expect(subSubject).equals(promotion.subSubject)
})

const searchByName = async (page, name) => {
  await page.fill(`input[name="name"]`, name)
  await Promise.all([
    page.waitForResponse(urlIncludes(`name=${name}`)),
    page.click(`button[type="submit"]`)
  ])
}

const gotoPromotionPage = async (page, platformCode) => {
  await page.goto("/promotion/promotionlist", { waitUntil: "networkidle" })
  return await selectPlatformByCode(page, platformCode)
}
