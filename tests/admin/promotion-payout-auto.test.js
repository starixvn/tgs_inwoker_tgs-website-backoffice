import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { fillDatePicker } from "../fill.js"
import { selectPlatformByCode } from "../page/content.js"
import { selectByValue } from "../page/select.js"
import { startOfDay, endOfTomorrow, format, addWeeks } from "date-fns"
import { openDialog } from "../page/dialog.js"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test("promotion payout auto", async ({
  page,
  platformCode,
  platform,
  player,
  backofficeApi,
  promotionSetting
}) => {
  let autoSentPlayerBonus = true
  let promotion = await backofficeApi.promotion.addFirstDeposit({
    autoSentPlayerBonus,
    brandId: platform.id
  })
  console.log("player.username", player.username)
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
  await checkAutoPayoutPromotion(page, platformCode, player)
})

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
