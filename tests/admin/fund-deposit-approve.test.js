import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import numeral from "numeral"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import { searchByFormId } from "./fund-deposit-page.js"

const test = base.extend(Fixture)

test("approve player deposit", async ({
  page,
  operatorApi,
  backofficeApi,
  platform,
  platformCode,
  platformToken,
  player
}) => {
  const ExpectedDepositAmount = 10
  let [_, playerBalance, formId] = await Promise.all([
    gotoFundDepositPage(page, platformCode),
    operatorApi.wallet(platformToken, player.token),
    backofficeApi.player.applyBankManualDepositForm({
      brandId: platform.id,
      playerCode: player.code,
      amount: ExpectedDepositAmount
    })
  ])

  let expectedBalance = playerBalance + ExpectedDepositAmount

  await searchByFormId(page, formId)

  let TableSelector = `#deposit`
  let depositAmountString = await page.textContent(
    `${TableSelector} [data-column-id="amount"] span`
  )
  let depositAmount = numeral(depositAmountString).value()
  expect(depositAmount).to.equal(ExpectedDepositAmount)

  let VerifyDepositDialogSelector = `#verify-deposit-dialog`
  await openDialog(page, VerifyDepositDialogSelector)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/deposit/${formId}`) &&
        response.status() === 200
      )
    }),
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/deposit/${platform.id}?`) &&
        response.status() === 200
      )
    }),
    page.click(`${VerifyDepositDialogSelector} button[data-type="approve"]`)
  ])

  let balance = await operatorApi.wallet(platformToken, player.token)
  expect(balance).to.equal(expectedBalance)
})

const gotoFundDepositPage = async (page, platformCode) => {
  await page.goto(`/fundmanagement/deposit`, { waitUntil: "networkidle" })
  await selectPlatformByCode(page, platformCode)
}
