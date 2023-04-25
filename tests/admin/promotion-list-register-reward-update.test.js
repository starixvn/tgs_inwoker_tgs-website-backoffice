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
import faker from "@faker-js/faker"

const test = base.extend(Fixture)
const { lorem } = faker

test("update register reward promotion", async ({
  page,
  platform,
  backofficeApi,
  promotionSetting
}) => {
  let [promotion] = await Promise.all([
    backofficeApi.promotion.reward.register.add({
      brandId: platform.id
    }),
    gotoPromotionPage(page, platform.code)
  ])

  //TODO: update from, to
  promotion.subSubject = faker.lorem.word()
  promotion.rule.bonusAmount = promotion.rule.bonusAmount + 1
  promotion.rule.turnoverMultiple = promotion.rule.turnoverMultiple + 1

  await searchByName(page, promotion.name)

  let DialogSelector = `#edit-promotion-dialog`
  await openDialog(page, DialogSelector)

  await page.fill(
    `${DialogSelector} input[name="subSubject"]`,
    `${promotion.subSubject}`
  )

  await page.fill(
    `${DialogSelector} input[name="rule.bonusAmount"]`,
    `${promotion.rule.bonusAmount}`
  )

  await page.fill(
    `${DialogSelector} input[name="rule.turnoverMultiple"]`,
    `${promotion.rule.turnoverMultiple}`
  )

  await Promise.all([
    /*
    TODO: wait for api result?
    page.waitForResponse((response) => {
      return (
        response.url().endsWith("/api/promotion") && response.status() === 200
      )
    }),
    */
    page.waitForTimeout(1000),
    page.waitForSelector(DialogSelector, { state: "detached" }),
    page.click(`${DialogSelector} button[type="submit"]`)
  ])

  let [mainInfo, content, rule] = await Promise.all([
    backofficeApi.promotion.mainInfo.fetch({
      platformId: platform.id,
      name: promotion.name
    }),
    backofficeApi.promotion.content.fetch({
      platformId: platform.id,
      name: promotion.name
    }),
    backofficeApi.promotion.rule.fetch({
      platformId: platform.id,
      name: promotion.name
    })
  ])

  expect(mainInfo).not.empty

  expect(content).not.empty
  expect(content.subSubject).equals(promotion.subSubject)

  expect(rule).not.empty
  expect(rule.bonusAmount).equals(promotion.rule.bonusAmount)
  expect(rule.turnoverMultiple).equals(promotion.rule.turnoverMultiple)
})

const searchByName = async (page, name) => {
  await page.fill(`input[name="name"]`, name)
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`name=${name}`) && response.status() === 200
      )
    }),
    page.click(`button[type="submit"]`)
  ])
}

const gotoPromotionPage = async (page, platformCode) => {
  await page.goto("/promotion/promotionlist", { waitUntil: "networkidle" })
  return await selectPlatformByCode(page, platformCode)
}
