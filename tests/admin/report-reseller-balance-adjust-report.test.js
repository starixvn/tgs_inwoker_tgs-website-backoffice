import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import numeral from "numeral"
import { selectRandomOption } from "../page/select.js"
import { openDialog } from "../page/dialog.js"

const test = base.extend(Fixture)

test("view reseller balance adjust report", async ({
  page,
  platform,
  player,
  agent,
  backofficeApi
}) => {
  let AdjustAmount = 10
  await Promise.all([
    backofficeApi.player.addBalance(player.code, { amount: AdjustAmount }),
    backofficeApi.agent.addBalance(agent.id, { amount: AdjustAmount })
  ])
  await gotoResellerBalanceAdjustReportPage(page, platform.code)

  let playerAdjustDialog = `#${platform.code}-player-adjust-dialog`
  await openDialog(page, playerAdjustDialog)

  await page.fill(`${playerAdjustDialog} input[name="user"]`, player.username)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/adjust-wallet/player/${platform.id}`) &&
        response.status() === 200
      )
    }),
    page.click(`${playerAdjustDialog} button[type="submit"]`)
  ])

  let playerUsername = await page
    .locator(`${playerAdjustDialog} td[data-column-id="userName"]`)
    .textContent()
  expect(playerUsername).equals(player.username)

  await page.click(`${playerAdjustDialog} button.bb-DialogClose`)

  let agentAdjustDialog = `#${platform.code}-agent-adjust-dialog`
  await openDialog(page, agentAdjustDialog)

  await page.fill(`${agentAdjustDialog} input[name="user"]`, agent.username)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/adjust-wallet/agent/${platform.id}`) &&
        response.status() === 200
      )
    }),
    page.click(`${agentAdjustDialog} button[type="submit"]`)
  ])

  let agentUsername = await page
    .locator(`${agentAdjustDialog} td[data-column-id="userName"]`)
    .textContent()
  expect(agentUsername).equals(agent.username)
})

const gotoResellerBalanceAdjustReportPage = async (page, platformCode) => {
  await page.goto("/resellerreport/balanceadjustreport", {
    waitUntil: "networkidle"
  })
  await selectRandomOption(page, `#page-merchant-bar [name="resellerId"]`)
}
