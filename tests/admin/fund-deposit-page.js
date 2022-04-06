import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"

export const gotoFundDepositPage = async (page, platformCode) => {
  await page.goto("/fundmanagement/deposit", { waitUntil: "networkidle" })
  await selectPlatformByCode(page, platformCode)
}

export const approveDeposit = async (page, platformCode, formId) => {
  await gotoFundDepositPage(page, platformCode)

  await page.fill(`input[name="id"]`, formId)
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`id=${formId}`) && response.status() === 200
      )
    }),
    page.click(`button[type="submit"]`)
  ])

  let VerifyDialogSelector = `#verify-deposit-dialog`
  await openDialog(page, VerifyDialogSelector)
  await Promise.all([
    page.waitForResponse((response) => {
      return response.url().endsWith(`/api/deposit/${formId}`)
    }),
    page.click(`${VerifyDialogSelector} button[data-type="approve"]`)
  ])
}
