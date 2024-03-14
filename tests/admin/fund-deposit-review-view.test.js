import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import numeral from "numeral"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import { searchByFormId } from "./fund-deposit-page.js"
import { urlIncludes } from "../page/response.js"

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

  const ExpectedStatus = "WaitingPayment"
  let DialogSelector = `#view-deposit-dialog`

  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/deposit/${platform.id}/${formId}`)),
    openDialog(page, DialogSelector)
  ])

  let status = await page
    .locator(`${DialogSelector} [data-status]`)
    .getAttribute("data-status")
  expect(status).equals(ExpectedStatus)
})

const gotoFundDepositPage = async (page, platformCode) => {
  await page.goto(`/fundmanagement/deposit`, { waitUntil: "networkidle" })
  await selectPlatformByCode(page, platformCode)
}
