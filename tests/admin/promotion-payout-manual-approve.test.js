import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { fillDatePicker } from "../fill.js"
import { selectPlatformByCode } from "../page/content.js"
import { selectByValue } from "../page/select.js"
import { startOfDay, endOfTomorrow, format, addWeeks } from "date-fns"
import { openDialog } from "../page/dialog.js"
import { urlIncludes } from "../page/response.js"
import { equals } from "ramda"

const test = base.extend(Fixture)

test("promotion payout > manual approve", async ({
  page,
  platform,
  player,
  backofficeApi,
  promotionSetting
}) => {
  let autoSentPlayerBonus = true
  let promotion = await backofficeApi.promotion.addFirstDeposit({
    autoSentPlayerBonus,
    brandId: platform.id,
    autoSentPlayerBonus: false
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

  await gotoPromotionPayoutListPage(page, platform.code)

  await page.locator(`input[name="username"]`).fill(player.username)
  await Promise.all([
    page.waitForResponse(urlIncludes(`username=${player.username}`)),
    page.locator(`button[type="submit"]`).click()
  ])

  let DialogSelector = `#review-promotion-payout-dialog`
  await openDialog(page, DialogSelector)

  let DialogLocator = page.locator(DialogSelector)

  let [response] = await Promise.all([
    page.waitForResponse(urlIncludes("api/PromotionDispatch")),
    page.waitForResponse(urlIncludes(`username=${player.username}`)),
    DialogLocator.locator(`button[type="submit"]`).click()
  ])

  let result = await response.json()
  expect(result.valid), equals(true)

  let sent = await page
    .locator(`[data-column-id="status"] span`)
    .getAttribute("data-sent")

  expect(sent).equals("true")
})

const gotoPromotionPayoutListPage = async (page, platformCode) => {
  await page.goto("/promotion/payoutlist", { waitUntil: "networkidle" })
  await selectPlatformByCode(page, platformCode)
}
