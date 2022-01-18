import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import { selectByLabel } from "../page/select.js"
import { openDialog } from "../page/dialog.js"

export const approveWithdraw = async (
  page,
  operatorApi,
  brandId,
  platformToken,
  player,
  withdrawAmount
) => {
  let playerBalance = await operatorApi.wallet(platformToken, player.token)
  let expectedBalance = playerBalance - withdrawAmount

  let formId = await operatorApi.withdraw.applyManualWithdraw(
    platformToken,
    player.token,
    {
      amount: withdrawAmount
    }
  )
  await findApplicationById(page, formId)

  let [download] = await Promise.all([
    page.waitForEvent("download"),
    page.click(`#export-report`)
  ])

  let VerifyDialogSelector = `#verify-withdraw-dialog`
  let [path] = await Promise.all([
    download.path(),
    openDialog(page, VerifyDialogSelector)
  ])
  expect(path).to.be.not.empty

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

  let TableSelector = `#withdraw`
  let StatusSelector = `${TableSelector} [data-column-id="status"] [data-status]`
  let statusLocator = page.locator(StatusSelector)
  let [status, balance] = await Promise.all([
    statusLocator.getAttribute("data-status"),
    operatorApi.wallet(platformToken, player.token)
  ])
  expect(status).to.equal("Approved")
  expect(balance).to.equal(expectedBalance)

  return formId
}

const selectManualBrandPayment = async (page) => {
  let SelectSelector = `select[name="brandPaymentId"]`
  return selectByLabel(page, SelectSelector, "Manual_BankTransfer_Custom")
}

export const findApplicationById = async (page, formId) => {
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

export const reviewPaid = async (
  page,
  platformCode,
  formId,
  type = "approve"
) => {
  let brandId = await gotoFundWithdraw(page, platformCode, formId)
  await findApplicationById(page, formId)

  let PaidDialogSelector = `#review-paid-dialog`
  await openDialog(page, PaidDialogSelector)

  let expectedUrl = `/api/withdraw/${formId}`
  let [approvePaidResonse] = await Promise.all([
    page.waitForResponse((response) => {
      return response.url().includes(expectedUrl) && response.status() === 200
    }),
    page.click(`${PaidDialogSelector} button[data-type="${type}"]`)
  ])

  let approvePaidResult = await approvePaidResonse.json()
  expect(approvePaidResult.valid).to.be.true
}

export const gotoFundWithdraw = async (page, platformCode) => {
  await page.goto("/fundmanagement/withdraw", { waitUntil: "networkidle" })
  let brandId = await selectPlatformByCode(page, platformCode)
  return brandId
}
