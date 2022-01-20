import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import numeral from "numeral"
import { selectPlatformByCode } from "../page/content.js"
import { subHours } from "date-fns"

const test = base.extend(Fixture)

test.skip("platform game provider report", async ({
  page,
  platformCode,
  player,
  backofficeApi,
  sboGameProviderApi,
  reportApi
}) => {
  let walletAmount = 100
  await backofficeApi.player.addBalance(player.code, {
    amount: walletAmount
  })

  let betAmount = 10
  let { externalRoundId, ...result } = await sboGameProviderApi.placeBet({
    amount: betAmount,
    playerCode: player.code
  })

  let openRound = await backofficeApi.round.findOpenRound({ externalRoundId })
  console.log("openRound", openRound)
  const TwoHours = 2 //report only aggregate round to prev hour
  let round = {
    ...openRound,
    externalClosedOn: subHours(new Date(), TwoHours).toISOString(),
    validBetAmount: betAmount,
    settleAmount: 0,
    commission: 0,
    turnover: betAmount,
    winLoss: 0,
    clientRoundStatus: "Loss" // Win, Loss, Draw, or Void
  }
  await backofficeApi.round.settleOpenRound(openRound.id, round)

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

  let totalCountLocator = page
    .locator(`[data-row-type="total"] [data-column-id="transactionCount"]`)
    .first()
  let totalCountString = await totalCountLocator.textContent()
  expect(numeral(totalCountString).value()).to.greaterThan(0)

  let totalBetAmountLocator = page
    .locator(`[data-row-type="total"] [data-column-id="betAmount"]`)
    .first()
  let totalBetAmountString = await totalBetAmountLocator.textContent()
  expect(numeral(totalBetAmountString).value()).to.greaterThanOrEqual(betAmount)
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
