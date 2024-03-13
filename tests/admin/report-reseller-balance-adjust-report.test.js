import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import numeral from "numeral"
import { selectRandomOption, selectByLabel } from "../page/select.js"
import { openDialog } from "../page/dialog.js"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test("view reseller balance adjust report", async ({
  page,
  resellerCode,
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
  await gotoResellerBalanceAdjustReportPage(page, resellerCode)

  let [downloadAdjustList] = await Promise.all([
    page.waitForEvent("download"),
    page.click(`#export-report`)
  ])

  let adjustListPath = await downloadAdjustList.path()
  expect(adjustListPath).to.be.not.empty

  let playerAdjustDialog = `#${platform.code}-player-adjust-dialog`
  await openDialog(page, playerAdjustDialog)

  let [downloadPlatformAdjustList] = await Promise.all([
    page.waitForEvent("download"),
    page.click(`${playerAdjustDialog} #export-report`)
  ])

  let platformAdjustListPath = await downloadPlatformAdjustList.path()
  expect(platformAdjustListPath).to.be.not.empty

  await page.fill(`${playerAdjustDialog} input[name="user"]`, player.username)

  await Promise.all([
    page.waitForResponse(
      urlIncludes(`/api/adjust-wallet/player/${platform.id}`)
    ),
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
    page.waitForResponse(
      urlIncludes(`/api/adjust-wallet/agent/${platform.id}`)
    ),
    page.click(`${agentAdjustDialog} button[type="submit"]`)
  ])

  let agentUsername = await page
    .locator(`${agentAdjustDialog} td[data-column-id="userName"]`)
    .textContent()
  expect(agentUsername).equals(agent.username)
})

const gotoResellerBalanceAdjustReportPage = async (page, resellerCode) => {
  await page.goto("/resellerreport/balanceadjustreport", {
    waitUntil: "networkidle"
  })

  await selectByLabel(
    page,
    `#page-merchant-bar [name="resellerId"]`,
    resellerCode
  )
}
