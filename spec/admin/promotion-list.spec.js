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

    await gotoPromotionPage()
  })

  afterEach(async () => {
    await page.close()
  })

  after(async () => {
    await browser.close()
  })

  it("should able to add and edit promotion", async () => {
    let promotion = await addPromotion()

    //TODO: fix data seeding
    // await editPromotion()
  })

  it("should able to toggle promotion status", async () => {
    await toggleStatus()
    await toggleStatus()
  })

  const toggleStatus = async (index = 0) => {
    await page.waitForSelector(
      `#promotion [data-row-index="${index}"] [data-column-id="status"] input[name="status"]`
    )

    const PromotionStatus = ["Enabled", "Disabled"]
    let status = await page.$eval(
      `#promotion [data-row-index="${index}"] [data-column-id="status"] label`,
      ({ dataset }) => dataset.status
    )

    expect(status).to.be.oneOf(PromotionStatus)
    let Status = PromotionStatus.filter((value) => value != status)
    let [ExpectedStatus] = Status

    await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().endsWith(`/${ExpectedStatus}`) &&
          response.status() === 200
        )
      }),
      page.click(
        `#promotion [data-row-index="${index}"] [data-column-id="status"] label .bb-SwitchIcon`
      )
    ])

    await page.reload({ waitUntil: "networkidle" })
    let toggledStatus = await page.$eval(
      `#promotion [data-row-index="${index}"] [data-column-id="status"] label`,
      ({ dataset }) => dataset.status
    )
    expect(toggledStatus).to.equal(ExpectedStatus)
  }

  //TODO
  const editPromotion = async () => {
    await page.click(`#edit-promotion-dialog-disclosure`)
    await page.waitForSelector("#edit-promotion-dialog")

    let from = startOfDay(new Date())
    let to = endOfTomorrow(new Date())
    let promotion = {
      name: lorem.word()
    }
    await page.fill(`#edit-promotion-dialog input[name="name"]`, promotion.name)

    await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().includes("/api/promotion") && response.status() === 200
        )
      }),
      page.click(`#edit-promotion-dialog button[type="submit"]`)
    ])
  }

  const addPromotion = async () => {
    await page.click(`#add-promotion-dialog-disclosure`)

    let from = startOfDay(new Date())
    let to = endOfTomorrow(new Date())
    let promotion = {
      name: lorem.word(),
      from: format(from, "yyyy/MM/dd"),
      to: format(to, "yyyy/MM/dd"),
      totalAmountLimit: 1000,
      percentage: 50,
      bonusAmountLimit: 100,
      turnoverMultiple: 2
    }

    await page.fill(`#add-promotion-dialog input[name="name"]`, promotion.name)

    await fillDatePicker({
      page,
      selector: `#add-promotion-dialog #promotion-period-box .react-datepicker-wrapper:first-child input`,
      value: promotion.from
    })
    await fillDatePicker({
      page,
      selector: `#add-promotion-dialog #promotion-period-box .react-datepicker-wrapper:not(:first-child) input`,
      value: promotion.to
    })

    await selectPromotionType()
    await page.fill(
      `#add-promotion-dialog input[name="totalAmountLimit"]`,
      `${promotion.totalAmountLimit}`
    )
    await page.fill(
      `#add-promotion-dialog input[name="percentage"]`,
      `${promotion.percentage}`
    )
    await page.fill(
      `#add-promotion-dialog input[name="bonusAmountLimit"]`,
      `${promotion.bonusAmountLimit}`
    )
    await page.fill(
      `#add-promotion-dialog input[name="turnoverMultiple"]`,
      `${promotion.turnoverMultiple}`
    )

    await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().endsWith("/api/promotion") && response.status() === 200
        )
      }),
      page.click(`#add-promotion-dialog button[type="submit"]`)
    ])
  }

  const gotoPromotionPage = async () => {
    let Menu = `#sidebar a[href="/promotion/promotionlist"]`
    await Promise.all([
      page.waitForNavigation(),
      page.click(Menu),
      page.waitForLoadState("networkidle")
    ])
    await selectPlatform()
  }

  const PromotionType = {
    DailyFirstDeposit: "DailyFirstDeposit"
  }
  const selectPromotionType = async (
    option = PromotionType.DailyFirstDeposit
  ) => {
    return page.selectOption(`select[name="promotionType"]`, option)
  }

  const selectPlatform = async () => {
    await page.waitForSelector(
      `#page-merchant-bar select[name="brandId"] option[value*="-"]:not(:first-child)`,
      {
        state: "attached"
      }
    )
    let option = await page.$eval(
      `#page-merchant-bar select[name="brandId"] option[value*="-"]:not(:first-child)`,
      (element) => element.value
    )
    await Promise.all([
      page.selectOption(`#page-merchant-bar select[name="brandId"]`, option)
    ])
  }
})
