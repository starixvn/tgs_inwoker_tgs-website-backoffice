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

test("promotion payout list", async ({
  page,
  platformCode,
  platformToken,
  player,
  operatorApi
}) => {
  let promotion = await addDepositPromotion(page, platformCode)
  let promotionid = await findPromotionId(page, promotion)
  await approveDeposit(
    page,
    operatorApi,
    platformCode,
    platformToken,
    player,
    promotionid
  )
  await checkAutoPayoutPromotion(page, platformCode, player)

  //TODO: other promotion type that use auto payout
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

const findPromotionId = async (page, promotion) => {
  await page.fill(`input[name="name"]`, promotion.name)
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/promotion?`) && response.status() === 200
      )
    }),
    page.click(`button[type="submit"]`)
  ])

  let PromotionIdSelector = `#promotion tbody tr[data-row-id]`
  await page.waitForSelector(PromotionIdSelector)
  let promotionid = await page.$eval(
    PromotionIdSelector,
    ({ dataset }) => dataset.rowId
  )
  expect(promotionid).to.be.not.empty

  return promotionid
}

const addDepositPromotion = async (page, platformCode) => {
  await gotoPromotionListPage(page, platformCode)

  let DialogSelector = `#add-promotion-dialog`
  await openDialog(page, DialogSelector)

  let from = startOfDay(new Date())
  let to = addWeeks(new Date(), 2)
  let promotion = {
    name: `${lorem.word()}-${Date.now()}`,
    from: format(from, "yyyy/MM/dd"),
    to: format(to, "yyyy/MM/dd"),
    subSubject: lorem.word(),
    totalAmountLimit: 1000,
    percentage: 50,
    bonusAmountLimit: 100,
    turnoverMultiple: 2
  }

  await page.fill(
    `${DialogSelector} input[name="subSubject"]`,
    promotion.subSubject
  )

  await fillDatePicker({
    page,
    selector: `${DialogSelector} #promotion-period-box .react-datepicker-wrapper:first-child input`,
    value: promotion.from
  })
  await fillDatePicker({
    page,
    selector: `${DialogSelector} #promotion-period-box .react-datepicker-wrapper:not(:first-child) input`,
    value: promotion.to
  })

  await page.fill(`${DialogSelector} input[name="name"]`, promotion.name)

  await page.click(
    `${DialogSelector} #vipLevels input[type="checkbox"] + .bb-CheckboxIcon`
  )

  await selectByValue(
    page,
    `${DialogSelector} select[name="promotionTypeGroup"]`,
    "Deposit"
  )

  await selectByValue(
    page,
    `${DialogSelector} select[name="promotionType"]`,
    "FirstDeposit"
  )

  /*TODO: other promotion type for disabled autoSent
  await page.click(
    `${DialogSelector} [name="autoSentPlayerBonus"] + .bb-SwitchIcon`
  )
  */

  await page.fill(
    `${DialogSelector} input[name="totalAmountLimit"]`,
    `${promotion.totalAmountLimit}`
  )

  /*
  const [desktopFileChooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    page.click(`${DialogSelector} #desktopBanner`)
  ])
  await desktopFileChooser.setFiles("./tests/dummy.png")
  await page.waitForResponse((response) => {
    return (
      response.url().endsWith(`/api/fs/upload/promotion`) &&
      response.status() === 200
    )
  })

  const [mobileFileChooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    page.click(`${DialogSelector} #mobileBanner`)
  ])
  await mobileFileChooser.setFiles("./tests/dummy.png")
  await page.waitForResponse((response) => {
    return (
      response.url().endsWith(`/api/fs/upload/promotion`) &&
      response.status() === 200
    )
  })
  */

  await page.fill(
    `${DialogSelector} input[name="rule.percentage"]`,
    `${promotion.percentage}`
  )
  await page.fill(
    `${DialogSelector} input[name="rule.bonusAmountLimit"]`,
    `${promotion.bonusAmountLimit}`
  )
  await page.fill(
    `${DialogSelector} input[name="rule.turnoverMultiple"]`,
    `${promotion.turnoverMultiple}`
  )

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().endsWith("/api/promotion") && response.status() === 200
      )
    }),
    page.click(`${DialogSelector} button[type="submit"]`)
  ])

  await page.waitForSelector(DialogSelector, { state: "detached" })
  return promotion
}

//TODO: use backofficeApi instead
const approveDeposit = async (
  page,
  operatorApi,
  platformCode,
  platformToken,
  player,
  promotionid,
  deposit = 10
) => {
  const DepositAccount = "account"
  const ExpectedDepositAmount = deposit
  let formId = await operatorApi.deposit.applyManualDeposit(
    platformToken,
    player.token,
    {
      account: DepositAccount,
      amount: ExpectedDepositAmount,
      promotionid
    }
  )

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
  await page.click(`${VerifyDialogSelector}-disclosure`)
  await page.waitForSelector(VerifyDialogSelector)
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

const gotoPromotionListPage = async (page, platformCode) => {
  await page.goto("/promotion/promotionlist", { waitUntil: "networkidle" })
  await selectPlatformByCode(page, platformCode)
}

const gotoPromotionPayoutListPage = async (page, platformCode) => {
  await page.goto("/promotion/payoutlist", { waitUntil: "networkidle" })
  await selectPlatformByCode(page, platformCode)
}
