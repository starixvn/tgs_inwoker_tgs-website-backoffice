import { chromium } from "playwright"
import { expect } from "chai"
import { StorageState, PlatformCode as brandCode } from "../auth"
import { host, headless } from "../env"
import { random } from "lodash"
import numeral from "numeral"
import { lorem, phone, datatype, image, finance } from "faker"
import clone from "clone-deep"
import { fillDatePicker } from "../fill"
import { goto } from "../sidebar"
import platform from "../platform"
import {
  register,
  login,
  manualDeposit,
  applyManualDepositForm,
  wallet,
  addManualBankCard,
  applyManualWithdrawForm,
  promotionList
} from "../player"
import { selectByValue } from "../page/select"
import { startOfDay, endOfTomorrow, format, addWeeks } from "date-fns"

let browser
let context
let page

let platformToken
let player

describe("Admin user", function () {
  before(async () => {
    browser = await chromium.launch({ headless: headless() })
    context = await browser.newContext({
      acceptDownloads: true,
      storageState: StorageState.Admin
    })
  })

  beforeEach(async () => {
    page = await context.newPage()

    await page.goto(host(), {
      waitUntil: "networkidle0"
      /*
      timeout: 0 // -> disable timeout
      */
    })

    platformToken = await platform.token({ brandCode })
    player = await register(platformToken)
    player = {
      ...player,
      ...(await login(platformToken, player))
    }
  })

  afterEach(async () => {
    await page.close()
  })

  after(async () => {
    await browser.close()
  })

  it("should show promotion payout list", async () => {
    let promotion = await addDepositPromotion()
    let promotionid = await findPromotionId(promotion)
    await approveDeposit(promotionid)
    await checkAutoPayoutPromotion()

    //TODO: other promotion type that use auto payout
  })

  const checkAutoPayoutPromotion = async () => {
    await gotoPromotionPayoutListPage()

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

  const findPromotionId = async (promotion) => {
    await page.fill(`input[name="name"]`, promotion.name)
    await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().includes(`/api/promotion?`) &&
          response.status() === 200
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

  const addDepositPromotion = async () => {
    await gotoPromotionListPage()

    let DialogSelector = `#add-promotion-dialog`
    await page.click(`${DialogSelector}-disclosure`)

    let from = startOfDay(new Date())
    let to = addWeeks(new Date(), 2)
    let promotion = {
      name: `${lorem.word()}-${Date.now()}`,
      from: format(from, "yyyy/MM/dd"),
      to: format(to, "yyyy/MM/dd"),
      totalAmountLimit: 1000,
      percentage: 50,
      bonusAmountLimit: 100,
      turnoverMultiple: 2
    }

    await page.fill(`${DialogSelector} input[name="name"]`, promotion.name)

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

    await page.click(
      `${DialogSelector} #vipLevels input[type="checkbox"] + .bb-CheckboxIcon`
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

    const [desktopFileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page.click(`${DialogSelector} #desktopBanner`)
    ])
    await desktopFileChooser.setFiles("./spec/dummy.png")
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
    await mobileFileChooser.setFiles("./spec/dummy.png")
    await page.waitForResponse((response) => {
      return (
        response.url().endsWith(`/api/fs/upload/promotion`) &&
        response.status() === 200
      )
    })

    await page.fill(
      `${DialogSelector} input[name="percentage"]`,
      `${promotion.percentage}`
    )
    await page.fill(
      `${DialogSelector} input[name="bonusAmountLimit"]`,
      `${promotion.bonusAmountLimit}`
    )
    await page.fill(
      `${DialogSelector} input[name="turnoverMultiple"]`,
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

  const approveDeposit = async (promotionid, deposit = 10) => {
    const DepositAccount = "account"
    const ExpectedDepositAmount = deposit
    let formId = await manualDeposit(platformToken, player.token, {
      account: DepositAccount,
      amount: ExpectedDepositAmount,
      promotionid
    })

    await applyManualDepositForm(platformToken, player.token, formId)

    await gotoFundDepositPage()

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

  const gotoFundDepositPage = async () => {
    await goto({ page, value: "/fundmanagement/deposit" })
    await platform.selectByCode({ page, brandCode })
  }

  const gotoPromotionListPage = async () => {
    await goto({ page, value: "/promotion/promotionlist" })
    await platform.selectByCode({ page, brandCode })
  }

  const gotoPromotionPayoutListPage = async () => {
    await goto({ page, value: "/promotion/payoutlist" })
    await platform.selectByCode({ page, brandCode })
  }
})
