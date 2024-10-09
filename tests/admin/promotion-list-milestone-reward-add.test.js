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

const test = base.extend(Fixture)

test("promotion add milestone reward", async ({
  page,
  platform,
  backofficeApi,
  promotionSetting
}) => {
  await gotoPromotionPage(page, platform.code)

  let promotion = await addPromotion(page)

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

  let [milestone] = rule.conditions
  expect(milestone.minimumValidBet).equals(promotion.milestone.minimumValidBet)
  expect(milestone.minimumDeposit).equals(promotion.milestone.minimumDeposit)
  expect(milestone.bonus).equals(promotion.milestone.bonus)
  expect(milestone.turnoverMultiple).equals(
    promotion.milestone.turnoverMultiple
  )
})

const addPromotion = async (page) => {
  let DialogSelector = `#add-promotion-dialog`
  await openDialog(page, DialogSelector)

  let from = startOfTomorrow(new Date())
  let to = addWeeks(new Date(), 2)

  let promotion = {
    name: `milestone-${faker.lorem.word()}-${Date.now()}`,
    from: format(from, "yyyy/MM/dd"),
    to: format(to, "yyyy/MM/dd"),
    subSubject: faker.lorem.word(),
    milestone: {
      minimumValidBet: 1,
      minimumDeposit: 2,
      bonus: 3,
      turnoverMultiple: 4
    }
  }

  await page
    .locator(`${DialogSelector} input[name="name"]`)
    .fill(promotion.name)

  await fillDatePicker({
    page,
    selector: `${DialogSelector} #promotion-period-box .react-datepicker-wrapper:first-child input`,
    value: promotion.from
  })
  await fillDatePicker({
    page,
    selector: `${DialogSelector} #promotion-period-box .react-datepicker-wrapper:not(:first-child) input`,
    value: promotion.to
  })

  const PromotionType = "Milestone"
  await page
    .locator(`${DialogSelector} select[name="promotionType"]`)
    .selectOption(PromotionType)

  await page
    .locator(`${DialogSelector} input[name="subSubject"]`)
    .fill(promotion.subSubject)

  await page
    .locator(
      `${DialogSelector} #vipLevels input[type="checkbox"][value="1"] + .bb-CheckboxIcon`
    )
    .click()

  await page
    .locator(
      `${DialogSelector} input[name="rule.conditions.0.minimumValidBet"]`
    )
    .fill(`${promotion.milestone.minimumValidBet}`)

  await page
    .locator(`${DialogSelector} input[name="rule.conditions.0.minimumDeposit"]`)
    .fill(`${promotion.milestone.minimumDeposit}`)

  await page
    .locator(`${DialogSelector} input[name="rule.conditions.0.bonus"]`)
    .fill(`${promotion.milestone.bonus}`)

  await page
    .locator(
      `${DialogSelector} input[name="rule.conditions.0.turnoverMultiple"]`
    )
    .fill(`${promotion.milestone.turnoverMultiple}`)

  await Promise.all([
    page.waitForResponse(urlIncludes("/api/promotion")),
    page.click(`${DialogSelector} button[type="submit"]`)
  ])

  return promotion
}

const gotoPromotionPage = async (page, platformCode) => {
  await page.goto("/promotion/promotionlist", { waitUntil: "networkidle" })
  return await selectPlatformByCode(page, platformCode)
}
