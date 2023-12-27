import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { faker } from "@faker-js/faker"
import { openDialog } from "../page/dialog.js"
import { selectPlatformByCode } from "../page/content.js"
import numeral from "numeral"

const test = base.extend(Fixture)

test("platform account fund > add", async ({ page, platform }) => {
  await gotoPlatformAccountFundPage(page, platform.code)

  let DialogSelector = `#fund-action-dialog`
  await openDialog(page, DialogSelector)

  let ExpectedType = "Debit"
  await page
    .locator(`${DialogSelector} select[name="type"]`)
    .selectOption(ExpectedType)

  let ExpectedAmount = faker.number.int({ min: 100, max: 1000 })
  await page
    .locator(`${DialogSelector} input[name="amount"]`)
    .fill(`${ExpectedAmount}`)

  let ExpectedRemark = faker.lorem.word()
  await page
    .locator(`${DialogSelector} textarea[name="remark"]`)
    .fill(ExpectedRemark)

  let ExpectedMoney = faker.number.int({ min: 100, max: 1000 })
  await page
    .locator(`${DialogSelector} input[name="money"]`)
    .fill(`${ExpectedMoney}`)

  await page
    .locator(`${DialogSelector} input[name="confirm"]  + .bb-CheckboxIcon`)
    .click()

  await page.click(`${DialogSelector} button[data-type="submit"]`)
  await Promise.all([
    page.waitForResponse((response) => {
      let url = response.url()
      let isApi = url.endsWith("/debit")
      if (isApi && !response.ok()) {
        throw Error("credit api error")
      }

      return isApi
    }),
    page.click(`#double-confirm-dialog button[type="submit"]`)
  ])

  let DetailDialogSelector = `#fund-action-detail-dialog`
  await openDialog(page, DetailDialogSelector)

  let type = await page
    .locator(`${DetailDialogSelector} tr td[data-column-id="type"] [data-type]`)
    .first()
    .getAttribute("data-type")
  expect(type).equals(ExpectedType)

  let amountString = await page
    .locator(`${DetailDialogSelector} tr td[data-column-id="amount"] > span`)
    .first()
    .innerText()
  let amount = numeral(amountString).value()
  expect(amount).equals(ExpectedAmount)

  let moneyString = await page
    .locator(`${DetailDialogSelector} tr td[data-column-id="money"] > span`)
    .first()
    .innerText()
  let money = numeral(moneyString).value()
  expect(money).equals(ExpectedMoney)

  let remark = await page
    .locator(`${DetailDialogSelector} tr td[data-column-id="remark"]`)
    .first()
    .innerText()
  expect(remark).equals(ExpectedRemark)
})

const gotoPlatformAccountFundPage = async (page, platformCode) => {
  await page.goto("/merchant/platformaccountfund", { waitUntil: "networkidle" })
  await selectPlatformByCode(page, platformCode)
}
