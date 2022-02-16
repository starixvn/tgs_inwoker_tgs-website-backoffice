import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import numeral from "numeral"
import faker from "@faker-js/faker"
import { selectPlatformByCode } from "../page/content.js"
// import { manualDeposit, applyManualDepositForm } from "../player.js"
import { openDialog } from "../page/dialog.js"

const test = base.extend(Fixture)
const { finance } = faker

test("approve player deposit", async ({
  page,
  operatorApi,
  platformCode,
  platformToken,
  player
}) => {
  let depositAmount = 10
  let balance = await approveDeposit(
    page,
    operatorApi,
    platformCode,
    platformToken,
    player,
    depositAmount
  )
})

const approveDeposit = async (
  page,
  operatorApi,
  platformCode,
  platformToken,
  player,
  deposit
) => {
  const DepositAccount = "account"
  const ExpectedDepositAmount = deposit
  let [brandId, playerBalance, formId] = await Promise.all([
    gotoFundDepositPage(page, platformCode),
    operatorApi.wallet(platformToken, player.token),
    operatorApi.deposit.applyManualDeposit(platformToken, player.token, {
      account: DepositAccount,
      amount: ExpectedDepositAmount
    })
  ])

  let expectedBalance = playerBalance + ExpectedDepositAmount

  await page.fill(`input[name="id"]`, formId)
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`id=${formId}`) && response.status() === 200
      )
    }),
    page.click(`button[type="submit"]`)
  ])

  let TableSelector = `#deposit`
  let depositAmountString = await page.textContent(
    `${TableSelector} [data-column-id="amount"] span`
  )
  let depositAmount = numeral(depositAmountString).value()
  expect(depositAmount).to.equal(ExpectedDepositAmount)

  let [download] = await Promise.all([
    page.waitForEvent("download"),
    page.click(`#export-report`)
  ])

  let path = await download.path()
  expect(path).to.be.not.empty

  let VerifyDepositDialogSelector = `#verify-deposit-dialog`
  await openDialog(page, VerifyDepositDialogSelector)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/deposit/${formId}`) &&
        response.status() === 200
      )
    }),
    page.click(`${VerifyDepositDialogSelector} button[data-type="approve"]`)
  ])

  await Promise.all([
    page.waitForSelector(VerifyDepositDialogSelector, {
      state: "detached"
    })
    /*
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/deposit/${brandId}?`) &&
        response.status() === 200
      )
    })
    */
  ])

  //TODO: reset status filter to find approved form record
  // let StatusSelector = `${TableSelector} [data-column-id="status"] span`
  // await page.waitForSelector(StatusSelector)
  // let status = await page.$eval(
  //   StatusSelector,
  //   ({ dataset }) => dataset.status
  // )
  // expect(status).to.equal("Approved")

  // let OperatorSelector = `${TableSelector} [data-column-id="reviewedUserName"]`
  // let operator = await page.textContent(OperatorSelector)
  // expect(operator).to.equal(AdminUserName)

  // let TotalAmountSelector = `#total-amount`
  // let totalAmountString = await page.textContent(TotalAmountSelector)
  // expect(depositAmountString).to.equal(totalAmountString)

  let balance = await operatorApi.wallet(platformToken, player.token)
  expect(balance).to.equal(expectedBalance)
}

const gotoFundDepositPage = async (page, platformCode) => {
  await page.goto(`/fundmanagement/deposit`, { waitUntil: "networkidle" })
  await selectPlatformByCode(page, platformCode)
}
