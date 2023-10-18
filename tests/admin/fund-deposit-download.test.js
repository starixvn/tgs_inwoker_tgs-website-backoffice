import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import numeral from "numeral"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import { searchByFormId } from "./fund-deposit-page.js"

const test = base.extend(Fixture)

test("fund deposit download", async ({
  page,
  operatorApi,
  backofficeApi,
  platform,
  platformCode,
  platformToken,
  player
}) => {
  const ExpectedDepositAmount = 10
  let [brandId, playerBalance, formId] = await Promise.all([
    gotoFundDepositPage(page, platformCode),
    operatorApi.wallet(platformToken, player.token),
    backofficeApi.player.applyBankManualDepositForm({
      brandId: platform.id,
      playerCode: player.code,
      amount: ExpectedDepositAmount
    })
  ])

  await searchByFormId(page, formId)

  let [download] = await Promise.all([
    page.waitForEvent("download"),
    page.click(`#export-report`)
  ])

  let path = await download.path()
  expect(path).to.be.not.empty
})

const gotoFundDepositPage = async (page, platformCode) => {
  await page.goto(`/fundmanagement/deposit`, { waitUntil: "networkidle" })
  await selectPlatformByCode(page, platformCode)
}
