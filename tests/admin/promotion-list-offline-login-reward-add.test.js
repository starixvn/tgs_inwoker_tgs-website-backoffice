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
import { utils, write } from "xlsx"

const test = base.extend(Fixture)
const { lorem } = faker

test("add offline login reward promotion", async ({
  page,
  promotionSetting,
  platform,
  backofficeApi,
  player
}) => {
  let brandId = await gotoPromotionPage(page, platform.code)

  let promotion = await addPromotion(page, platform, player)

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

  expect(rule.bonusAmount).equals(promotion.bonusAmount)
  expect(rule.turnoverMultiple).equals(promotion.turnoverMultiple)
})

const toFileBuffer = (username) => {
  let rows = [
    {
      username
    }
  ]
  let worksheet = utils.json_to_sheet(rows)
  let workbook = utils.book_new()
  utils.book_append_sheet(workbook, worksheet, "Sheet1")
  return write(workbook, { type: "buffer", bookType: "xlsx" })
}

const addPromotion = async (page, platform, player) => {
  let DialogSelector = `#add-promotion-dialog`
  await openDialog(page, DialogSelector)

  let from = startOfTomorrow(new Date())
  let to = addWeeks(new Date(), 2)

  let promotion = {
    name: `${lorem.word()}-${Date.now()}`,
    from: format(from, "yyyy/MM/dd"),
    to: format(to, "yyyy/MM/dd"),
    bonusAmount: 100,
    turnoverMultiple: 2
  }

  await page.fill(`${DialogSelector} input[name="name"]`, promotion.name)

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

  const PromotionTypeGroup = "Offline"
  await page.selectOption(
    `select[name="promotionTypeGroup"]`,
    PromotionTypeGroup
  )

  const PromotionType = "OfflineLoginReward"
  await page.selectOption(`select[name="promotionType"]`, PromotionType)

  const [fileChooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    page.click(`${DialogSelector} #upload`)
  ])

  let buffer = toFileBuffer(player.username)

  let [response] = await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/offline/${platform.id}`) &&
        response.status() === 200
      )
    }),
    fileChooser.setFiles({ name: "batch.xlsx", buffer })
  ])

  let batchUploadResult = await response.json()
  let batchId = batchUploadResult.data
  expect(batchId).to.not.empty

  await page.fill(
    `${DialogSelector} input[name="bonusAmount"]`,
    `${promotion.bonusAmount}`
  )
  await page.fill(
    `${DialogSelector} input[name="turnoverMultiple"]`,
    `${promotion.turnoverMultiple}`
  )

  let WaitBatchUploadPlayerTime = 1000
  await page.waitForTimeout(WaitBatchUploadPlayerTime)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes("/api/offline-login-reward") &&
        response.status() === 200
      )
    }),
    page.click(`${DialogSelector} button[type="submit"]`)
  ])

  await page.waitForSelector(DialogSelector, { state: "detached" })
  return promotion
}

const gotoPromotionPage = async (page, platformCode) => {
  await page.goto("/promotion/promotionlist", { waitUntil: "networkidle" })
  return await selectPlatformByCode(page, platformCode)
}
