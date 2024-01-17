import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import numeral from "numeral"

const test = base.extend(Fixture)

test("marketing > player deposit report", async ({
  page,
  platform,
  agent,
  player,
  backofficeApi
}) => {
  const DepositAmount = 100

  let [depositFormId] = await Promise.all([
    backofficeApi.player.applyBankManualDepositForm({
      brandId: platform.id,
      playerCode: player.code,
      amount: DepositAmount
    }),
    /*
    operatorApi.deposit.applyManualDeposit(platformToken, player.token, {
      amount: DepositAmount
    }),
    */
    backofficeApi.player.updatePlayerAgent(player.code, agent.username),
    gotoMarketingPlayerDepositListPage(page, platform.code)
  ])

  await backofficeApi.fund.deposit.approve(depositFormId, {
    brandId: platform.id
  })

  await searchAgent(page, agent)

  //TOOD: fix
  /*
  await registerDialog(page)
  await firstDepositDialog(page)
  */
})

const registerDialog = async (page) => {
  let dialogSelector = `[data-column-id="registerCount"] .bb-ModalDisclosure`

  /*
  TODO: aggregate report

  let registerCountString = await page
    .locator(dialogSelector)
    .first()
    .textContent()

  let registerCount = numeral(registerCountString).value()
  expect(registerCount).greaterThanOrEqual(1)
  */

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/MarketingReport/registerDetail?`) &&
        response.status() === 200
      )
    }),
    page.click(dialogSelector)
  ])
  await page.click("#close-dialog")
}

const firstDepositDialog = async (page) => {
  let dialogSelector = `[data-column-id="firstDepositCount"] .bb-ModalDisclosure`

  /*
  TODO: aggregate report

  let firstDepositCountString = await page
    .locator(dialogSelector)
    .first()
    .textContent()

  let firstDepositCount = numeral(firstDepositCountString).value()
  expect(firstDepositCount).greaterThanOrEqual(1)
  */

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/MarketingReport/firstDepositDetail?`) &&
        response.status() === 200
      )
    }),
    page.click(dialogSelector)
  ])
  await page.click("#close-dialog")
}

const searchAgent = async (page, agent) => {
  await page.fill(`input[name="agentUsername"]`, agent.username)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/MarketingReport?`) &&
        response.status() === 200
      )
    }),
    page.click(`button[type="submit"]`)
  ])
}

const gotoMarketingPlayerDepositListPage = async (page, platformCode) => {
  await page.goto("/marketing/marketingreport", { waitUntil: "networkidle" })
  await selectPlatformByCode(page, platformCode)
}
