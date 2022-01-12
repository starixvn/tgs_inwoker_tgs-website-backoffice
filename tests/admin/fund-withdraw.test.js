import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import numeral from "numeral"
import faker from "faker"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import { addManualBankCard, applyManualWithdrawForm } from "../player.js"

const test = base.extend(Fixture)
const { finance } = faker

test("approve player fund withdraw and paid", async ({
  page,
  platformCode,
  platformToken,
  player,
  backofficeApi,
  operatorApi
}) => {
  let depositAmount = 100
  await backofficeApi.player.addBalance(player.code, {
    amount: depositAmount
  })

  let withdrawAmount = depositAmount
  let formId = await approveWithdraw(
    page,
    operatorApi,
    platformCode,
    platformToken,
    player,
    withdrawAmount
  )

  let Approve = "approve"
  await reviewPaid(page, platformCode, formId, Approve)
})

test.skip("TODO: approve player fund withdraw and reject paid", async () => {
  let depositAmount = 100
  await backofficeApi.player.addBalance(player.code, {
    amount: depositAmount
  })

  let withdrawAmount = depositAmount
  let formId = await approveWithdraw(
    page,
    operatorApi,
    platformCode,
    platformToken,
    player,
    withdrawAmount
  )

  let Reject = "Reject"
  await reviewPaid(page, platformCode, formId, Reject)
  console.warn("add rejected status filter and check status")
})

export const approveWithdraw = async (
  page,
  operatorApi,
  platformCode,
  platformToken,
  player,
  withdrawAmount
) => {
  let playerBalance = await operatorApi.wallet(platformToken, player.token)

  let expectedBalance = playerBalance - withdrawAmount

  let expectBankCard = {
    bankAccount: finance.account(),
    name: finance.accountName(),
    bankName: "bankName",
    bankBranch: "bankBranch"
  }

  //TODO: use operatorApi
  await addManualBankCard(platformToken, player.token, expectBankCard)
  //TODO: use operatorApi
  let formId = await applyManualWithdrawForm(platformToken, player.token, {
    amount: withdrawAmount
  })

  let brandId = await gotoFundWithdraw(page, platformCode, formId)

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
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/withdraw/${brandId}?`) &&
        response.status() === 200
      )
    }),
    page.click(`${VerifyDialogSelector} button[data-type="approve"]`)
  ])

  let StatusSelector = `${TableSelector} [data-column-id="status"] [data-status]`
  let statusLocator = page.locator(StatusSelector)
  let status = await statusLocator.getAttribute("data-status")
  expect(status).to.equal("Approved")

  let balance = await operatorApi.wallet(platformToken, player.token)
  expect(balance).to.equal(expectedBalance)

  return formId
}

export const reviewPaid = async (page, platformCode, formId, type) => {
  let brandId = await gotoFundWithdraw(page, platformCode, formId)
  let PaidDialogSelector = `#review-paid-dialog`
  await openDialog(page, PaidDialogSelector)

  let expectedUrl = `/api/withdraw/${formId}`
  let [approvePaidResonse] = await Promise.all([
    page.waitForResponse((response) => {
      return response.url().includes(expectedUrl) && response.status() === 200
    }),
    page.click(`${PaidDialogSelector} button[data-type="approve"]`)
  ])

  let approvePaidResult = await approvePaidResonse.json()
  expect(approvePaidResult.valid).to.be.true
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

const gotoFundWithdraw = async (page, platformCode, formId) => {
  await page.goto("/fundmanagement/withdraw", { waitUntil: "networkidle" })
  let brandId = await selectPlatformByCode(page, platformCode)

  if (formId) {
    await page.fill(`input[name="id"]`, formId)
    await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().includes(`id=${formId}`) && response.status() === 200
        )
      }),
      page.click(`button[type="submit"]`)
    ])
  }

  return brandId
}
