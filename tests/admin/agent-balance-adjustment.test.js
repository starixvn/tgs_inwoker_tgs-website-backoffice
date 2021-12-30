import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { goto } from "../sidebar.js"
import { selectPlatformByCode } from "../page/content.js"
import { random } from "lodash-es"

const test = base.extend(Fixture)

test("add and deduct agent balance", async ({ page, platformCode }) => {
  let brandId = await gotoAgentBalanceAdjustmentPage(page, platformCode)
  await addBalance(page)

  await deductBalance(page)
})

const addBalance = async (page, index = 0) => {
  let Selector = `#add-balance-dialog`
  await page.click(`${Selector}-disclosure`)
  await page.waitForSelector(Selector)

  let options = await getTransactionTypeOptions(page)
  let optionIndex = random(0, options.length - 1)
  let option = options[optionIndex]
  expect(option).to.not.be.empty

  setTransactionType(page, option)

  let amount = random(100, 1000)
  await page.fill(`${Selector} input[name="amount"]`, `${amount}`)

  let id = await page.inputValue(`${Selector} input[name="id"]`)
  expect(id).to.not.be.empty
  let expectedUrl = `/api/Agent/${id}/adjust`

  let [response] = await Promise.all([
    page.waitForResponse((response) => {
      return response.url().endsWith(expectedUrl) && response.status() === 200
    }),
    page.click(`${Selector} button[type="submit"]`)
  ])
}

const TransactionTypeSelector = `select[name="transactionType"]`
const getTransactionTypeOptions = async (
  page,
  selectSelector = TransactionTypeSelector
) => {
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

const deductBalance = async (page, index = 0) => {
  let Selector = `#deduct-balance-dialog`

  await page.click(`${Selector}-disclosure`)
  await page.waitForSelector(Selector)

  let option = "Other"
  setTransactionType(page, option)

  let amount = random(10, 100)
  await page.fill(`${Selector} input[name="amount"]`, `${amount}`)

  let id = await page.inputValue(`${Selector} input[name="id"]`)
  expect(id).to.not.be.empty
  let expectedUrl = `/api/Agent/${id}/adjust`

  let [response] = await Promise.all([
    page.waitForResponse((response) => {
      return response.url().endsWith(expectedUrl) && response.status() === 200
    }),
    page.click(`${Selector} button[type="submit"]`)
  ])
}

const gotoAgentBalanceAdjustmentPage = async (page, platformCode) => {
  await goto({ page, value: "/agentmanagement/balanceadjustment" })
  return await selectPlatformByCode(page, platformCode)
}
