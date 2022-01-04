import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import numeral from "numeral"
import faker from "faker"
import { goto } from "../sidebar.js"
import { selectPlatformByCode } from "../page/content.js"
import {
  wallet,
  addManualBankCard,
  applyManualWithdrawForm
} from "../player.js"

const test = base.extend(Fixture)
const { finance } = faker

test("verify player deposit and withdraw", async ({
  page,
  platformCode,
  platformToken,
  player,
  backofficeApi
}) => {
  let depositAmount = 10
  await backofficeApi.player.addBalance(player.code, {
    amount: depositAmount
  })

  let withdrawAmount = depositAmount
  await approveWithdraw(
    page,
    platformCode,
    platformToken,
    player,
    withdrawAmount
  )
})

const approveWithdraw = async (
  page,
  platformCode,
  platformToken,
  player,
  withdrawAmount
) => {
  let playerBalance = await wallet(platformToken, player.token)
  let expectedBalance = playerBalance - withdrawAmount

  let expectBankCard = {
    bankAccount: finance.account(),
    name: finance.accountName(),
    bankName: "bankName",
    bankBranch: "bankBranch"
  }
  await addManualBankCard(platformToken, player.token, expectBankCard)
  let formId = await applyManualWithdrawForm(platformToken, player.token, {
    amount: withdrawAmount
  })

  await gotoFundWithdraw(page, platformCode)

  await page.fill(`input[name="id"]`, formId)
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`id=${formId}`) && response.status() === 200
      )
    }),
    page.click(`button[type="submit"]`)
  ])

  let [download] = await Promise.all([
    page.waitForEvent("download"),
    page.click(`#export-report`)
  ])

  let path = await download.path()
  expect(path).to.be.not.empty

  let TableSelector = `#withdraw`
  let VerifyDialogSelector = `#verify-withdraw-dialog`
  await page.click(`${VerifyDialogSelector}-disclosure`)

  await selectManualBrandPayment(page)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/withdraw/${formId}`) &&
        response.status() === 200
      )
    }),
    page.click(`${VerifyDialogSelector} button[data-type="approve"]`)
  ])

  let brandId = await page.inputValue(`select[name="brandId"]`)
  await Promise.all([
    page.waitForSelector(VerifyDialogSelector, {
      state: "detached"
    })
    /*
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/withdraw/${brandId}?`) &&
        response.status() === 200
      )
    })
    */
  ])

  //TODO: reset form id
  // let StatusSelector = `${TableSelector} [data-column-id="status"] [data-status]`
  // await page.waitForSelector(StatusSelector)
  // let status = await page.$eval(
  //   StatusSelector,
  //   ({ dataset }) => dataset.status
  // )
  // expect(status).to.equal("Approved")

  // let OperatorSelector = `${TableSelector} [data-column-id="reviewedUserName"]`
  // let operator = await page.textContent(OperatorSelector)
  // expect(operator).to.equal(AdminUserName)

  // let balance = await wallet(platformToken, player.token)
  // expect(balance).to.equal(expectedBalance)

  // let PaidDialogSelector = `#fund-withdraw-paid-dialog`
  // await page.click(`${PaidDialogSelector}-disclosure`)
  // await page.waitForSelector(PaidDialogSelector)
  // await Promise.all([
  //   page.waitForResponse((response) => {
  //     return (
  //       response.url().includes(`/api/withdraw/${formId}`) &&
  //       response.status() === 200
  //     )
  //   }),
  //   page.click(`${PaidDialogSelector} button[type="submit"]`)
  // ])

  // await Promise.all([
  //   page.waitForSelector(PaidDialogSelector, {
  //     state: "detached"
  //   }),
  //   page.waitForResponse((response) => {
  //     return (
  //       response.url().includes(`/api/withdraw/${brandId}?`) &&
  //       response.status() === 200
  //     )
  //   })
  // ])

  // status = ""
  // await page.waitForSelector(StatusSelector)
  // status = await page.$eval(StatusSelector, ({ dataset }) => dataset.status)
  // expect(status).to.equal("Paid")
}

const selectManualBrandPayment = async (page) => {
  let SelectSelector = `select[name="brandPaymentId"]`
  await page.waitForSelector(`${SelectSelector} option`, {
    state: "attached"
  })

  //TODO: how to prevent hardcode: Manual_BankTransfer_Custom
  await page.selectOption(SelectSelector, {
    label: "Manual_BankTransfer_Custom"
  })
}

const gotoFundWithdraw = async (page, platformCode) => {
  await goto({ page, value: "/fundmanagement/withdraw" })
  await selectPlatformByCode(page, platformCode)
}

const gotoPlayerListPage = async (page, platformCode) => {
  await goto({ page, value: "/playermanagement/playerlist" })
  await selectPlatformByCode(page, platformCode)
}
