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

  let DataStatusSelector = `[data-column-id="status"] span`
  await page.waitForSelector(DataStatusSelector)
  let statusString = await page.$eval(
    DataStatusSelector,
    ({ dataset }) => dataset.sent
  )

  expect(statusString).to.equal("true")
}

const gotoPromotionPayoutListPage = async (page, platformCode) => {
  await page.goto("/promotion/payoutlist", { waitUntil: "networkidle" })
  await selectPlatformByCode(page, platformCode)
}
