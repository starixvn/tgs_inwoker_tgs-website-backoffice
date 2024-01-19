import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import { urlIncludes } from "../page/response.js"

export const gotoFundDepositPage = async (page, platformCode) => {
  await page.goto("/fundmanagement/deposit", { waitUntil: "networkidle" })
  await selectPlatformByCode(page, platformCode)
}

export const searchByFormId = async (page, formId) => {
  await page.fill(`input[name="id"]`, formId)
  await Promise.all([
    page.waitForResponse(urlIncludes(`id=${formId}`)),
    page.click(`button[type="submit"]`)
  ])
}

export const approveDeposit = async (page, platformCode, formId) => {
  await gotoFundDepositPage(page, platformCode)
  await searchByFormId(page, formId)

  let VerifyDialogSelector = `#verify-deposit-dialog`
  await openDialog(page, VerifyDialogSelector)
  await Promise.all([
    page.waitForResponse((response) => {
      return response.url().endsWith(`/api/deposit/${formId}`)
    }),
    page.click(`${VerifyDialogSelector} button[data-type="approve"]`)
  ])
}
