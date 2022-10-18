import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { random } from "lodash-es"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import { selectByValue } from "../page/select.js"
import { searchPlayer } from "./player-list-page.js"
import { utils, write } from "xlsx"
import { boolean } from "boolean"

const test = base.extend(Fixture)

test("batch add player balance", async ({
  page,
  player,
  platform,
  platformCode
}) => {
  await gotoPlayerBalanceAdjustmentPage(page, platformCode)

  //TOOD:
  // 1. open dialog
  // 2. select type
  // 3. gen excel file
  // 4. upload excel file
  // 5. submit
  // 6. compare with get player balance api

  let dialogSelector = `#player-batch-add-balance-dialog`
  await openDialog(page, dialogSelector)

  let type = "CompanyAdjust"
  await selectByValue(
    page,
    `${dialogSelector} select[name="transactionType"]`,
    type
  )
  const [fileChooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    page.click(`${dialogSelector} #upload`)
  ])

  let ExpectedAdjustAmount = 100
  let ExpectedTurnover = 200
  let ExpectedRemark = "remark!"
  let buffer = toFileBuffer({
    username: player.username,
    adjustAmount: ExpectedAdjustAmount,
    turnover: ExpectedTurnover,
    remark: ExpectedRemark
  })

  let [response] = await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().endsWith(`/api/batch-adj-balance/${platform.id}`) &&
        response.status() === 200
      )
    }),
    fileChooser.setFiles({ name: "batch.xlsx", buffer })
  ])

  let batchId = await response.json()
  expect(batchId).to.not.empty

  let username = await page
    .locator(`${dialogSelector} #preview td[data-column-id="userName"]`)
    .first()
    .textContent()
  expect(username).equals(player.username)

  let adjustAmountString = await page
    .locator(`${dialogSelector} #preview td[data-column-id="adjustAmount"]`)
    .first()
    .textContent()
  let adjustAmount = Number(adjustAmountString)
  expect(adjustAmount).equals(ExpectedAdjustAmount)

  let turnoverString = await page
    .locator(`${dialogSelector} #preview td[data-column-id="turnover"]`)
    .first()
    .textContent()
  let turnover = Number(turnoverString)
  expect(turnover).equals(ExpectedTurnover)

  let remark = await page
    .locator(`${dialogSelector} #preview td[data-column-id="remark"]`)
    .first()
    .textContent()
  expect(remark).equals(ExpectedRemark)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().endsWith(`/api/batch-adj-balance/result/${batchId}`) &&
        response.status() === 200
      )
    }),
    page.click(`${dialogSelector} button[type="submit"]`)
  ])

  let isSuccessString = await page
    .locator(`${dialogSelector} #result td[data-column-id="isSuccess"] span`)
    .first()
    .getAttribute("data-value")

  let isSuccess = boolean(isSuccessString)
  expect(isSuccess).to.be.true
})

const toFileBuffer = ({ username, adjustAmount, turnover, remark }) => {
  let rows = [
    {
      username,
      adjustAmount,
      turnover,
      remark
    }
  ]
  let worksheet = utils.json_to_sheet(rows)
  let workbook = utils.book_new()
  utils.book_append_sheet(workbook, worksheet, "Sheet1")
  return write(workbook, { type: "buffer", bookType: "xlsx" })
}

const gotoPlayerBalanceAdjustmentPage = async (page, platformCode) => {
  await page.goto("/playermanagement/balanceadjustment", {
    waitUntil: "networkidle"
  })
  return await selectPlatformByCode(page, platformCode)
}
