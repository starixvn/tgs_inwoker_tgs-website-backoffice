import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import numeral from "numeral"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import { searchByFormId } from "./fund-deposit-page.js"
import { urlIncludes } from "../page/response.js"
import { faker } from "@faker-js/faker"

const test = base.extend(Fixture)

test("reject player deposit", async ({
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

  let expectedBalance = playerBalance

  await searchByFormId(page, formId)

  let TableSelector = `#deposit`
  let depositAmountString = await page.textContent(
    `${TableSelector} [data-column-id="amount"] span`
  )
  let depositAmount = numeral(depositAmountString).value()
  expect(depositAmount).to.equal(ExpectedDepositAmount)

  let VerifyDepositDialogSelector = `#verify-deposit-dialog`
  await openDialog(page, VerifyDepositDialogSelector)

  let remark = faker.lorem.word()
  await page
    .locator(`${VerifyDepositDialogSelector} textarea[name="remark"]`)
    .fill(remark)

  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/deposit/${formId}`)),
    page.waitForResponse(urlIncludes(`/api/deposit/${platform.id}?`)),
    page.click(`${VerifyDepositDialogSelector} button[data-type="reject"]`)
  ])

  let balance = await operatorApi.wallet(platformToken, player.token)
  expect(balance).to.equal(expectedBalance)

  let depositForm = await backofficeApi.fund.deposit.form(platform.id, formId)
  expect(depositForm.remark).equals(remark)
})

const gotoFundDepositPage = async (page, platformCode) => {
  await page.goto(`/fundmanagement/deposit`, { waitUntil: "networkidle" })
  await selectPlatformByCode(page, platformCode)
}
