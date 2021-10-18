import { chromium } from "playwright"
import { expect } from "chai"
import { StorageState } from "../auth"
import { host, headless } from "../env"
import { random } from "lodash"
import numeral from "numeral"
import { startOfDay, endOfTomorrow, format } from "date-fns"
import {
  lorem,
  phone,
  datatype,
  image,
  finance,
  internet,
  commerce
} from "faker"
import clone from "clone-deep"
import { fillDatePicker } from "../fill"
import { goto } from "../sidebar"
import { selectRandomOption } from "../page/select"

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

    await gotoAdminPlatformPaymentListPage()
  })

  afterEach(async () => {
    await page.close()
  })

  after(async () => {
    await browser.close()
  })

  it("should able to add, search and edit payment", async () => {
    let payment = await addDepositPayment()
    //TODO: how to search payment by keyword?
    //TODO: edit deposit payment
    //TODO: change deposit payment order


  })

  const addDepositPayment = async () => {
    let DialogSelector = `#add-payment-dialog`
    await page.click(`${DialogSelector}-disclosure`)

    await page.waitForSelector(DialogSelector)

    let ChannelSelectSelector = `${DialogSelector} select[name="paymentChannelId"]`
    await selectRandomOption(page, ChannelSelectSelector)

    let payment = {
      channelName: commerce.productName(),
      extendedData: {
        name: finance.accountName(),
        bankAccount: finance.account()
      },
      transferLimitFrom: 0,
      transferLimitTo: 100,
      depositedAmountMin: 10,
      depositedAmountMax: 1000
    }
    await page.fill(
      `${DialogSelector} input[name="channelName"]`,
      payment.channelName
    )
    await page.fill(
      `${DialogSelector} input[name="extendedData.name"]`,
      payment.extendedData.name
    )
    await page.fill(
      `${DialogSelector} input[name="extendedData.bankAccount"]`,
      payment.extendedData.bankAccount
    )
    await page.fill(
      `${DialogSelector} input[name="transferLimitFrom"]`,
      `${payment.transferLimitFrom}`
    )
    await page.fill(
      `${DialogSelector} input[name="transferLimitTo"]`,
      `${payment.transferLimitTo}`
    )
    await page.fill(
      `${DialogSelector} input[name="depositedAmountMin"]`,
      `${payment.depositedAmountMin}`
    )

    await page.check(
      `${DialogSelector} input[name="depositedAmountUnlimited"] + .bb-CheckboxIcon`
    )

    await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().endsWith("/api/brandpayment/deposit") &&
          response.status() === 200
        )
      }),
      page.click(`${DialogSelector} button[type="submit"]`)
    ])
  }

  const gotoAdminPlatformPaymentListPage = async () => {
    await goto({ page, value: "/system/brandpayments" })
    await selectRandomOption(page, `select[name="brandId"]`)
  }
})
