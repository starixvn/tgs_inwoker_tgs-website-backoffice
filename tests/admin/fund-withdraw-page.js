import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import { selectByLabel } from "../page/select.js"
import { openDialog } from "../page/dialog.js"
import { urlIncludes } from "../page/response.js"

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

  let VerifyDialogSelector = `#verify-withdraw-dialog`
  let [brandPaymentResponse] = await Promise.all([
    page.waitForResponse(urlIncludes(`/api/brandpayment?brandId=${brandId}`)),
    page.waitForResponse(urlIncludes(`/api/PaymentChannel`)),
    openDialog(page, VerifyDialogSelector)
  ])
  let brandPaymentList = await brandPaymentResponse.json()
  let brandPayment = brandPaymentList?.items?.find(
    ({ bankType, paymentName }) =>
      bankType === "Bank" && paymentName === "Manual"
  )
  expect(brandPayment?.id).not.empty
  await page
    .locator(`${VerifyDialogSelector} select[name="brandPaymentId"]`)
    .selectOption(brandPayment.id)

  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/withdraw/${formId}`)),
    page.waitForResponse(urlIncludes(`/api/withdraw/${brandId}?`)),
    page.click(`${VerifyDialogSelector} button[data-type="approve"]`)
  ])

  let TableSelector = `#withdraw`
  let StatusSelector = `${TableSelector} [data-column-id="status"] [data-status]`
  let statusLocator = page.locator(StatusSelector)
  let [status, balance] = await Promise.all([
    statusLocator.getAttribute("data-status"),
    operatorApi.wallet(platformToken, player.token)
  ])
  expect(status).to.equal("Approved", `status = ${status}, expected "Approved"`)
  expect(balance).to.equal(expectedBalance)

  return formId
}

export const findApplicationById = async (page, formId) => {
  await page.fill(`input[name="id"]`, formId)
  await Promise.all([
    page.waitForResponse(urlIncludes(`id=${formId}`)),
    page.click(`button[type="submit"]`)
  ])
}

export const searchByFormId = findApplicationById

export const reviewPaid = async (
  page,
  platformCode,
  formId,
  type = "approve"
) => {
  await gotoFundWithdraw(page, platformCode, formId)
  await findApplicationById(page, formId)

  let PaidDialogSelector = `#review-paid-dialog`
  await openDialog(page, PaidDialogSelector)

  let [approvePaidResonse] = await Promise.all([
    page.waitForResponse(urlIncludes(`/api/withdraw/${formId}`)),
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
