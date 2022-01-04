import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import numeral from "numeral"
import { selectFirst } from "../licensee.js"

const test = base.extend(Fixture)

test("view and download licensee market report", async ({ page }) => {
  await gotoLicenseeMarketReportPage(page)
  await page.waitForSelector(`[data-column-id="depositAmount"] span`)

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

  let adjustmentAmountString = await page.textContent(`
  [data-column-id="adjustmentAmount"] span`)
  let adjustmentAmount = numeral(adjustmentAmountString).value()
  expect(adjustmentAmount).to.be.a("number")

  let bonusAmountString = await page.textContent(
    `[data-column-id="bonusAmount"] span`
  )
  let bonusAmount = numeral(bonusAmountString).value()
  expect(bonusAmount).to.be.a("number")

  let betAmountString = await page.textContent(
    `[data-column-id="betAmount"] span`
  )
  let betAmount = numeral(betAmountString).value()
  expect(betAmount).to.be.a("number")

  let validBetAmountString = await page.textContent(
    `[data-column-id="turnover"] span`
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

const gotoLicenseeMarketReportPage = async (page) => {
  await page.goto("/licenseereport/marketreport")
  await selectFirst({ page })
}
