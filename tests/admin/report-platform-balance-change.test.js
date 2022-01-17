import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import numeral from "numeral"

const test = base.extend(Fixture)

test("view platform player balance change report", async ({
  page,
  platformCode,
  player,
  backofficeApi
}) => {
  let ExpectedAmount = 100
  await Promise.all([
    gotoBalanceChangeReport(page, platformCode),
    backofficeApi.player.addBalance(player.code, {
      amount: ExpectedAmount
    })
  ])

  await searchPlayer(page, player)

  let AfterBalanceSelector = `[data-column-id="afterBalance"]`
  let afterBalanceLocator = page.locator(AfterBalanceSelector).first()
  let afterBalanceString = await afterBalanceLocator.textContent()
  expect(numeral(afterBalanceString).value()).to.equals(ExpectedAmount)
})

const searchPlayer = async (page, player) => {
  let usernameSelector = `input[name="username"]`
  await page.fill(usernameSelector, player.username)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/PlayerReport/playersAccountChanges?`) &&
        response.status() === 200
      )
    }),
    page.click(`button[type="submit"]`)
  ])
}

const gotoBalanceChangeReport = async (page, platformCode) => {
  await page.goto("/report/balancechangereport", { waitUntil: "networkidle" })
  return await selectPlatformByCode(page, platformCode)
}
