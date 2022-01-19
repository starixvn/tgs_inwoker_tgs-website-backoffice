import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import numeral from "numeral"
import { selectPlatformByCode, selectRandomPlatform } from "../page/content.js"

const test = base.extend(Fixture)

test("platform game provider report", async ({
  page,
  platformCode,
  player,
  backofficeApi,
  sboGameProviderApi,
  reportApi
}) => {
  let walletAmount = 100
  let addBalanceResult = await backofficeApi.player.addBalance(player.code, {
    amount: walletAmount
  })

  let betAmount = 10
  let loseBetResult = await sboGameProviderApi.placeLoseBet({
    amount: betAmount,
    playerCode: player.code
  })

  await reportApi.aggregateRound()
  await reportApi.aggregatePlayer()

  await page.goto("/report/gameproviderreport", { waitUntil: "networkidle" })
  let brandId = await selectPlatformByCode(page, platformCode)
  await searchToday(page)

  let countLocator = page.locator(`[data-column-id="transactionCount"]`).first()
  let countString = await countLocator.textContent()
  expect(numeral(countString).value()).to.greaterThan(0)

  let betAmountLocator = page.locator(`[data-column-id="betAmount"]`).first()
  let betAmountString = await betAmountLocator.textContent()
  expect(numeral(betAmountString).value()).to.greaterThanOrEqual(betAmount)

  //TODO: test table footer?
})

const searchToday = async (page) => {
  let DateRangeSelector = `#date-range`
  await page.click(`${DateRangeSelector} #date-range-dropdown-menu button`)
  await page.click(
    `${DateRangeSelector} #date-range-dropdown-menu [data-type="Today"]`
  )
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/GameProviderReport?`) &&
        response.status() === 200
      )
    }),
    page.click(`button[type="submit"]`)
  ])
}
