import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import { random } from "lodash-es"
import { openDialog } from "../page/dialog.js"
import { searchAgent } from "./agent-list-page.js"

const test = base.extend(Fixture)

test("add and deduct agent balance", async ({ page, agent, platformCode }) => {
  let brandId = await gotoAgentBalanceAdjustmentPage(page, platformCode)

  await searchAgent(page, agent.username)

  await addBalance(page, agent)
  await deductBalance(page, agent)
})

const addBalance = async (page, agent) => {
  let Selector = `#add-balance-dialog`
  await openDialog(page, Selector)

  let options = await getTransactionTypeOptions(page)
  let optionIndex = random(0, options.length - 1)
  let option = options[optionIndex]
  expect(option).to.not.be.empty

  setTransactionType(page, option)

  let amount = random(100, 1000)
  await page.fill(`${Selector} input[name="amount"]`, `${amount}`)

  let [response] = await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().endsWith(`/api/Agent/${agent.id}/adjust/increase`) &&
        response.status() === 200
      )
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

const deductBalance = async (page, agent) => {
  let Selector = `#deduct-balance-dialog`
  await openDialog(page, Selector)

  let option = "Other"
  setTransactionType(page, option)

  let amount = random(10, 100)
  await page.fill(`${Selector} input[name="amount"]`, `${amount}`)

  let [response] = await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().endsWith(`/api/Agent/${agent.id}/adjust/reduce`) &&
        response.status() === 200
      )
    }),
    page.click(`${Selector} button[type="submit"]`)
  ])
}

const gotoAgentBalanceAdjustmentPage = async (page, platformCode) => {
  await page.goto(`agentmanagement/balanceadjustment`, {
    waitUntil: "networkidle"
  })
  return await selectPlatformByCode(page, platformCode)
}
