import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import numeral from "numeral"
import { selectPlatformByCode } from "../page/content.js"
import { subHours } from "date-fns"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test.skip("platform game provider report", async ({
  page,
  platform,
  player,
  backofficeApi,
  reportAggregateApi
}) => {
  let expectedRound = await backofficeApi.game.round.add(platform.id, {
    playerCode: player.code
  })

  console.log("TODO: gen game provider report using bo api")
  await reportAggregateApi.aggregateRound()
  await reportAggregateApi.aggregatePlayer()

  await page.goto("/report/gameproviderreport", { waitUntil: "networkidle" })
  await selectPlatformByCode(page, platform.code)
  await searchToday(page)

  let countLocator = page.locator(`[data-column-id="transactionCount"]`).first()
  let countString = await countLocator.textContent()
  expect(numeral(countString).value()).to.greaterThan(0)

  let betAmountLocator = page.locator(`[data-column-id="betAmount"]`).first()
  let betAmountString = await betAmountLocator.textContent()
  expect(numeral(betAmountString).value()).to.greaterThanOrEqual(
    expectedRound.betAmount
  )

  let totalCountLocator = page
    .locator(`[data-row-type="total"] [data-column-id="transactionCount"]`)
    .first()
  let totalCountString = await totalCountLocator.textContent()
  expect(numeral(totalCountString).value()).to.greaterThan(0)

  let totalBetAmountLocator = page
    .locator(`[data-row-type="total"] [data-column-id="betAmount"]`)
    .first()
  let totalBetAmountString = await totalBetAmountLocator.textContent()
  expect(numeral(totalBetAmountString).value()).to.greaterThanOrEqual(
    expectedRound.betAmount
  )
})

const searchToday = async (page) => {
  let DateRangeSelector = `#date-range`
  await page.click(`${DateRangeSelector} #date-range-dropdown-menu button`)
  await page.click(
    `${DateRangeSelector} #date-range-dropdown-menu [data-type="Today"]`
  )
  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/GameProviderReport?`)),
    page.click(`button[type="submit"]`)
  ])
}
