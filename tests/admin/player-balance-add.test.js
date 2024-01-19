import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { random } from "lodash-es"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import { searchPlayer } from "./player-list-page.js"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test("add player balance", async ({ page, player, platformCode }) => {
  await gotoPlayerBalanceAdjustmentPage(page, platformCode)

  await searchPlayer(page, player)
  await addBalance(page, player)
})

const addBalance = async (page, player) => {
  let Selector = `#add-balance-dialog`
  await openDialog(page, Selector)

  let option = "CompanyAdjust"
  setTransactionType(page, option)

  let amount = random(100, 1000)
  await page.fill(`${Selector} input[name="amount"]`, `${amount}`)

  let bucketAmount = random(100, 1000)
  await page.fill(`${Selector} input[name="bucketAmount"]`, `${bucketAmount}`)

  let [response] = await Promise.all([
    page.waitForResponse(
      urlIncludes(`/api/player/${player.code}/adjust/increase`)
    ),
    page.click(`${Selector} button[type="submit"]`)
  ])
}

const TransactionTypeSelector = `select[name="transactionType"]`
const getTransactionTypeOptions = async (
  page,
  selectSelector = TransactionTypeSelector
) => {
  //TODO: rm when BonusAdjust ready
  return ["CompanyAdjust", "AgentAdjust"]

  let Selector = `${selectSelector} option:not(:first-child)`
  await page.waitForSelector(Selector, { state: "attached" })
  return page.$$eval(Selector, (options) => options.map(({ value }) => value))
}

const setTransactionType = async (
  page,
  option = "",
  selectSelector = TransactionTypeSelector
) => {
  return page.selectOption(selectSelector, option)
}

const gotoPlayerBalanceAdjustmentPage = async (page, platformCode) => {
  await page.goto("/playermanagement/balanceadjustment", {
    waitUntil: "networkidle"
  })
  return await selectPlatformByCode(page, platformCode)
}
