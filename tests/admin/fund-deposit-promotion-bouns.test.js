import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import { urlIncludes } from "../page/response.js"
import { searchByFormId } from "./fund-deposit-page.js"
import { selectByValue as selectMultiSelectByValue } from "../page/multi-select.js"
import numeral from "numeral"

const test = base.extend(Fixture)

test("fund deposit > promotion bouns amount", async ({
  page,
  platformCode,
  platform,
  player,
  backofficeApi,
  promotionSetting
}) => {
  let autoSentPlayerBonus = true
  let promotion =
    await backofficeApi.promotion.reward.deposit.dailyFirstDeposit.add({
      autoSentPlayerBonus,
      brandId: platform.id
    })

  let ExpectedDepositAmount = 10
  let formId = await backofficeApi.player.applyBankManualDepositForm({
    brandId: platform.id,
    playerCode: player.code,
    amount: ExpectedDepositAmount,
    promotionId: promotion.id
  })
  await backofficeApi.fund.deposit.approve(formId, {
    brandId: platform.id
  })

  await gotoFundDepositPage(page, platform.code)
  await selectMultiSelectByValue(page, "#status", "Approved")
  await searchByFormId(page, formId)

  let bounsAmountInString = await page
    .locator(`table#deposit td[data-column-id="bonus"]`)
    .textContent()

  let bounsAmount = numeral(bounsAmountInString).value()
  expect(bounsAmount).to.be.above(0)
})

const gotoFundDepositPage = async (page, platformCode) => {
  await page.goto(`/fundmanagement/deposit`, { waitUntil: "networkidle" })
  await selectPlatformByCode(page, platformCode)
}

const checkAutoPayoutPromotion = async (page, platformCode, player) => {
  await gotoPromotionPayoutListPage(page, platformCode)

  await page.fill(`input[name="username"]`, player.username)
  await Promise.all([
    page.waitForResponse(urlIncludes(`username=${player.username}`)),
    page.click(`button[type="submit"]`)
  ])

  let sent = await page
    .locator(`[data-column-id="status"] span`)
    .getAttribute("data-sent")

  expect(sent).equals("true")

  let ViewDialogSelector = "#view-payout-dialog"
  await openDialog(page, ViewDialogSelector)

  sent = await page
    .locator(`${ViewDialogSelector} [data-sent]`)
    .getAttribute("data-sent")
  expect(sent).equals("true")
}

const gotoPromotionPayoutListPage = async (page, platformCode) => {
  await page.goto("/promotion/payoutlist", { waitUntil: "networkidle" })
  await selectPlatformByCode(page, platformCode)
}
