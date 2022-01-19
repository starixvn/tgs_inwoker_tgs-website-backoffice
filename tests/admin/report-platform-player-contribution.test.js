import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"

const test = base.extend(Fixture)

test.skip("view platform player contribution report", async ({
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

  await page.goto("/report/playercontributionreport", {
    waitUntil: "networkidle"
  })
  let brandId = await selectPlatformByCode(page, platformCode)
  await searchPlayer(page, player)

  let betAmountLocator = page.locator(`[data-column-id="betAmount"]`).first()
  let betAmountString = await betAmountLocator.textContent()
  expect(numeral(betAmountString).value()).to.greaterThanOrEqual(betAmount)
})

const searchPlayer = async (page, player) => {
  await page.fill(`input[name="username"]`, player.username)
  let DateRangeSelector = `#date-range`
  await page.click(`${DateRangeSelector} #date-range-dropdown-menu button`)
  await page.click(
    `${DateRangeSelector} #date-range-dropdown-menu [data-type="Today"]`
  )
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/PlayerReport/contribution?`) &&
        response.status() === 200
      )
    }),
    page.click(`button[type="submit"]`)
  ])
}
