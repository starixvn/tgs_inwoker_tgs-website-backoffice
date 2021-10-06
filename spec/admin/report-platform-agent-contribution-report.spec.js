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

let brandCode = "GPI"

describe("Admin user", () => {
  before(async () => {
    browser = await chromium.launch({ headless: headless() })
    context = await browser.newContext({
      acceptDownloads: true,
      storageState: StorageState.Admin
    })
  })

  beforeEach(async () => {
    page = await context.newPage()

    await page.goto(host(), {
      waitUntil: "networkidle0"
    })

    await gotoPlatformAgentContributionReportPage()
  })

  afterEach(async () => {
    await page.close()
  })

  after(async () => {
    await browser.close()
  })

  it("should able to view and download agent contribution report", async () => {
    let agentUsername = "GameProvider IntegrationChief"
    let inputSelector = `input[name="agentUsername"]`
    await page.waitForSelector(inputSelector)
    await page.fill(inputSelector, agentUsername)

    await Promise.all([
      page.click(`button[type="submit"]`),
      page.waitForLoadState("networkidle")
    ])

    let agentUsernameSelector = `[data-column-id="username"] a`
    await page.waitForSelector(agentUsernameSelector)
    let childAgentUsername = await page.textContent(agentUsernameSelector)
    expect(childAgentUsername).to.be.a("string")

    let depositAmountString = await page.textContent(
      `[data-column-id="depositAmount"] span`
    )
    let depositAmount = numeral(depositAmountString).value()
    expect(depositAmount).to.be.a("number")

    let withdrawalAmountString = await page.textContent(
      `[data-column-id="withdrawalAmount"] span`
    )
    let withdrawalAmount = numeral(withdrawalAmountString).value()
    expect(withdrawalAmount).to.be.a("number")

    let bonusAmountString = await page.textContent(
      `[data-column-id="bonusAmount"] span`
    )
    let bonusAmount = numeral(bonusAmountString).value()
    expect(bonusAmount).to.be.a("number")

    let adjustmentAmountString = await page.textContent(
      `[data-column-id="adjustmentAmount"] span`
    )
    let adjustmentAmount = numeral(adjustmentAmountString).value()
    expect(adjustmentAmount).to.be.a("number")

    let validBetAmountString = await page.textContent(
      `[data-column-id="validBetAmount"]`
    )
    let validBetAmount = numeral(validBetAmountString).value()
    expect(validBetAmount).to.be.a("number")

    let winLossAmountString = await page.textContent(
      `[data-column-id="winLossAmount"] span`
    )
    let winLossAmount = numeral(winLossAmountString).value()
    expect(winLossAmount).to.be.a("number")

    let netProfitString = await page.textContent(
      `[data-column-id="netProfit"] span`
    )
    let netProfit = numeral(netProfitString).value()
    expect(netProfit).to.be.a("number")

    let [download] = await Promise.all([
      page.waitForEvent("download"),
      page.click(`#export-report`)
    ])

    let path = await download.path()
    expect(path).to.be.not.empty
  })

  const gotoPlatformAgentContributionReportPage = async () => {
    await goto({ page, value: "/report/agentcontributionreport" })
    await platform.selectByCode({ page, brandCode })
  }
})
