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
    backofficeApi.player.updatePlayerAgent(player.code, agent.username),
    gotoMarketingPlayerDepositListPage(page, platform.code)
  ])

  await backofficeApi.fund.deposit.approve(depositFormId, {
    brandId: platform.id
  })

  await searchAgent(page, agent)

  //TODO: fix
  /*
  await noSecondDeposit(page)
  await firstDepositDialog(page)
  */
})

const noSecondDeposit = async (page) => {
  let dialogSelector = `[data-column-id="NoSecondDepositCount"] .bb-ModalDisclosure`

  let firstDepositCountString = await page
    .locator(dialogSelector)
    .first()
    .textContent()

  let firstDepositCount = numeral(firstDepositCountString).value()
  expect(firstDepositCount).greaterThanOrEqual(1)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response
          .url()
          .includes(`/api/PlayerDepositReport/playerNoSecondDepositDetails?`) &&
        response.status() === 200
      )
    }),
    page.click(dialogSelector)
  ])
  await page.click("#close-dialog")
}

const firstDepositDialog = async (page) => {
  let dialogSelector = `[data-column-id="FirstDepositCount"] .bb-ModalDisclosure`

  let firstDepositCountString = await page
    .locator(dialogSelector)
    .first()
    .textContent()

  let firstDepositCount = numeral(firstDepositCountString).value()
  expect(firstDepositCount).greaterThanOrEqual(1)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response
          .url()
          .includes(`/api/PlayerDepositReport/playerFirstDepositDetails?`) &&
        response.status() === 200
      )
    }),
    page.click(dialogSelector)
  ])
  await page.click("#close-dialog")
}

const searchAgent = async (page, agent) => {
  await page.fill(`input[name="agentUsername"]`, agent.username)

  await page.click(`#date-range #date-range-dropdown-menu button`)
  await page.click(`#date-range #date-range-dropdown-menu [data-type="Today"]`)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/PlayerDepositReport?`) &&
        response.status() === 200
      )
    }),
    page.click(`button[type="submit"]`)
  ])
}

const gotoMarketingPlayerDepositListPage = async (page, platformCode) => {
  await page.goto("/marketing/playerdeposit", { waitUntil: "networkidle" })
  await selectPlatformByCode(page, platformCode)
}
