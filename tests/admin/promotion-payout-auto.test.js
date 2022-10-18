import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { fillDatePicker } from "../fill.js"
import { selectPlatformByCode } from "../page/content.js"
import { selectByValue } from "../page/select.js"
import { startOfDay, endOfTomorrow, format, addWeeks } from "date-fns"
import faker from "@faker-js/faker"
import { openDialog } from "../page/dialog.js"

const test = base.extend(Fixture)
const { lorem } = faker

test("promotion payout auto", async ({
  page,
  platformCode,
  platform,
  player,
  backofficeApi
}) => {
  let autoSentPlayerBonus = true
  let promotion = await backofficeApi.promotion.addFirstDeposit({
    autoSentPlayerBonus,
    brandId: platform.id
  })

  console.warn("TODO: approve deposit by api")
  await approveDeposit(page, backofficeApi, platform, player, promotion.id)
  await checkAutoPayoutPromotion(page, platformCode, player)
})

const checkAutoPayoutPromotion = async (page, platformCode, player) => {
  await gotoPromotionPayoutListPage(page, platformCode)

  await page.fill(`input[name="username"]`, player.username)
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`username=${player.username}`) &&
        response.status() === 200
      )
    }),
    page.click(`button[type="submit"]`)
  ])

  let DataStatusSelector = `[data-column-id="status"] span`
  await page.waitForSelector(DataStatusSelector)
  let statusString = await page.$eval(
    DataStatusSelector,
    ({ dataset }) => dataset.sent
  )

  expect(statusString).to.equal("true")
  /*
  let PayoutDialogSelector = `#payout-promotion-dialog`
  await page.click(`${PayoutDialogSelector}-disclosure`)
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/PromotionDispatch`) &&
        response.status() === 200
      )
    }),
    page.click(`${PayoutDialogSelector} button[type="submit"]`)
  ])
  */
}

//TODO: use backofficeApi instead
const approveDeposit = async (
  page,
  backofficeApi,
  platform,
  player,
  promotionId,
  deposit = 10
) => {
  const ExpectedDepositAmount = deposit
  let [formId] = await Promise.all([
    backofficeApi.player.applyBankManualDepositForm({
      brandId: platform.id,
      playerCode: player.code,
      amount: ExpectedDepositAmount,
      promotionId
    }),
    gotoFundDepositPage(page, platform.code)
  ])

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

const gotoFundDepositPage = async (page, platformCode) => {
  await page.goto("/fundmanagement/deposit", { waitUntil: "networkidle" })
  await selectPlatformByCode(page, platformCode)
}

const gotoPromotionPayoutListPage = async (page, platformCode) => {
  await page.goto("/promotion/payoutlist", { waitUntil: "networkidle" })
  await selectPlatformByCode(page, platformCode)
}
