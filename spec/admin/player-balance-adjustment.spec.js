import { chromium } from "playwright"
import { expect } from "chai"
import { StorageState } from "../auth"
import { host, headless } from "../env"
import { random } from "lodash"
import numeral from "numeral"
import { startOfDay, endOfTomorrow, format } from "date-fns"
import { lorem } from "faker"
import clone from "clone-deep"
import { fillDatePicker } from "../fill"
import { goto } from "../sidebar"
import platform from "../platform"

let browser
let context
let page

describe("Admin user", () => {
  before(async () => {
    browser = await chromium.launch({ headless: headless() })
    context = await browser.newContext({ storageState: StorageState.Admin })
  })

  beforeEach(async () => {
    page = await context.newPage()

    await page.goto(host(), {
      waitUntil: "networkidle0"
    })

    await gotoPlayerBalanceAdjustmentPage()
  })

  afterEach(async () => {
    await page.close()
  })

  after(async () => {
    await browser.close()
  })

  it("should able to add or deduct player balance", async () => {
    await addBalance()

    await deductBalance()
  })

  const addBalance = async (index = 0) => {
    let Selector = `#add-balance-dialog`
    await page.click(`${Selector}-disclosure`)
    await page.waitForSelector(Selector)

    let options = await getTransactionTypeOptions()
    let optionIndex = random(0, options.length - 1)
    let option = options[optionIndex]
    expect(option).to.not.be.empty

    setTransactionType(option)

    let amount = random(100, 1000)
    await page.fill(`${Selector} input[name="amount"]`, `${amount}`)

    let bucketAmount = random(100, 1000)
    await page.fill(`${Selector} input[name="bucketAmount"]`, `${bucketAmount}`)

    let playerCode = await page.inputValue(
      `${Selector} input[name="playerCode"]`
    )
    expect(playerCode).to.not.be.empty
    let expectedUrl = `/api/player/${playerCode}/adjust`

    let [response] = await Promise.all([
      page.waitForResponse((response) => {
        return response.url().endsWith(expectedUrl) && response.status() === 200
      }),
      page.click(`${Selector} button[type="submit"]`)
    ])
  }

  const deductBalance = async () => {
    let Selector = `#deduct-balance-dialog`
    await page.click(`${Selector}-disclosure`)
    await page.waitForSelector(Selector)

    let options = await getTransactionTypeOptions()
    let optionIndex = random(0, options.length - 1)
    let option = options[optionIndex]
    expect(option).to.not.be.empty

    setTransactionType(option)

    let amount = random(10, 100)
    await page.fill(`${Selector} input[name="amount"]`, `${amount}`)

    let playerCode = await page.inputValue(
      `${Selector} input[name="playerCode"]`
    )
    expect(playerCode).to.not.be.empty
    let expectedUrl = `/api/player/${playerCode}/adjust`

    let [response] = await Promise.all([
      page.waitForResponse((response) => {
        return response.url().endsWith(expectedUrl) && response.status() === 200
      }),
      page.click(`${Selector} button[type="submit"]`)
    ])
  }

  const TransactionTypeSelector = `select[name="transactionType"]`
  const getTransactionTypeOptions = async (
    selectSelector = TransactionTypeSelector
  ) => {
    let Selector = `${selectSelector} option:not(:first-child)`
    await page.waitForSelector(Selector, { state: "attached" })
    return page.$$eval(Selector, (options) => options.map(({ value }) => value))
  }

  const setTransactionType = async (
    option = "",
    selectSelector = TransactionTypeSelector
  ) => {
    return page.selectOption(selectSelector, option)
  }

  const gotoPlayerBalanceAdjustmentPage = async () => {
    await goto({ page, value: "/playermanagement/balanceadjustment" })
    await platform.selectFirst({ page })
  }
})
