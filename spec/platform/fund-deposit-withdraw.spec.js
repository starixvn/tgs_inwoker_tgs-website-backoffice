import { chromium } from "playwright"
import { expect } from "chai"
import { StorageState, PlatformCode as brandCode } from "../auth"
import { host, headless } from "../env"
import { random } from "lodash"
import numeral from "numeral"
import { startOfDay, endOfTomorrow, format } from "date-fns"
import {
  lorem,
  phone,
  datatype,
  image,
  finance,
  internet,
  commerce
} from "faker"
import clone from "clone-deep"
import { fillDatePicker } from "../fill"
import { goto } from "../sidebar"
import {
  manualDeposit,
  applyManualDepositForm,
  addManualBankCard,
  applyManualWithdrawForm
} from "../player"
import globalApi from "../../client/globalApi"
import operatorApi from "../../client/operatorApi"

let browser
let context
let page

let platformToken
let player

console.warn("TODO: test play audio?")
describe("Platform user", function () {
  const SecondInMilliseconds = 1000
  this.timeout(40 * SecondInMilliseconds)

  before(async () => {
    browser = await chromium.launch({ headless: headless() })
    context = await browser.newContext({ storageState: StorageState.Platform })
  })

  beforeEach(async () => {
    page = await context.newPage()

    await page.goto(host(), {
      waitUntil: "networkidle0"
    })

    platformToken = await globalApi.platformToken(brandCode)
    player = await operatorApi.player.createAndLogin(platformToken)
  })

  afterEach(async () => {
    await page.close()
  })

  after(async () => {
    await browser.close()
  })

  it("should show deposit and withdraw alarm on header", async () => {
    let depositAmount = 10
    let balance = await depositAlarm(depositAmount)

    let withdrawAmount = depositAmount
    await withdrawAlarm(withdrawAmount)
  })

  const depositAlarm = async (amount) => {
    const DepositAccount = "account"
    const ExpectedDepositAmount = amount

    let formId = await manualDeposit(platformToken, player.token, {
      account: DepositAccount,
      amount: ExpectedDepositAmount
    })
    await applyManualDepositForm(platformToken, player.token, formId)

    let AlarmSelector = `#fund-deposit-notify`
    await page.waitForSelector(AlarmSelector, {
      timeout: 20 * SecondInMilliseconds
    })
    let unprocessedString = await page.$eval(
      AlarmSelector,
      ({ dataset }) => dataset.unprocessed
    )
    let unprocessed = numeral(unprocessedString).value()
    expect(unprocessed).to.be.above(0)

    await approveFundDeposit(formId)
  }

  const approveFundDeposit = async (formId) => {
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

    let VerifyDepositDialogSelector = `#verify-deposit-dialog`
    await page.click(`${VerifyDepositDialogSelector}-disclosure`)

    await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().includes(`/api/deposit/${formId}`) &&
          response.status() === 200
        )
      }),
      page.click(`${VerifyDepositDialogSelector} button[data-type="approve"]`)
    ])

    await Promise.all([
      page.waitForSelector(VerifyDepositDialogSelector, {
        state: "detached"
      }),
      page.waitForResponse((response) => {
        return (
          response.url().includes(`/api/deposit/`) && response.status() === 200
        )
      })
    ])
  }

  const withdrawAlarm = async (withdraw) => {
    await clearPlayerWageringRequirement()

    let expectBankCard = {
      bankAccount: finance.account(),
      name: finance.accountName(),
      bankName: "bankName",
      bankBranch: "bankBranch"
    }
    await addManualBankCard(platformToken, player.token, expectBankCard)

    let formId = await applyManualWithdrawForm(platformToken, player.token, {
      amount: withdraw
    })

    let AlarmSelector = `#fund-withdraw-notify`
    await page.waitForSelector(AlarmSelector, {
      timeout: 16 * SecondInMilliseconds
    })
    let unprocessedString = await page.$eval(
      AlarmSelector,
      ({ dataset }) => dataset.unprocessed
    )
    let unprocessed = numeral(unprocessedString).value()
    expect(unprocessed).to.be.above(0)

    await approveFundWithdraw(formId)
  }

  const approveFundWithdraw = async (formId) => {
    await gotoFundWithdraw()

    await page.fill(`input[name="id"]`, formId)
    await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().includes(`id=${formId}`) && response.status() === 200
        )
      }),
      page.click(`button[type="submit"]`)
    ])

    let TableSelector = `#withdraw`
    let VerifyDialogSelector = `#verify-withdraw-dialog`
    await page.click(`${VerifyDialogSelector}-disclosure`)

    await selectManualBrandPayment()

    await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().includes(`/api/withdraw/${formId}`) &&
          response.status() === 200
        )
      }),
      page.click(`${VerifyDialogSelector} button[data-type="approve"]`)
    ])

    await Promise.all([
      page.waitForSelector(VerifyDialogSelector, {
        state: "detached"
      }),
      page.waitForResponse((response) => {
        return (
          response.url().includes(`/api/withdraw`) && response.status() === 200
        )
      })
    ])
  }

  const selectManualBrandPayment = async () => {
    let SelectSelector = `select[name="brandPaymentId"]`
    await page.waitForSelector(`${SelectSelector} option`, {
      state: "attached"
    })

    //TODO: how to prevent hardcode: Manual_BankTransfer_Custom
    await page.selectOption(SelectSelector, {
      label: "Manual_BankTransfer_Custom"
    })
  }

  const clearPlayerWageringRequirement = async () => {
    await gotoPlayerListPage()
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

    let EditPlayerDialog = `#edit-player-dialog`
    await page.click(`${EditPlayerDialog}-disclosure`)

    let ClearPlayerWageringRequirementDialogSelector = `#clear-player-wagering-requirement-dialog`
    await page.click(
      `${ClearPlayerWageringRequirementDialogSelector}-disclosure`
    )
    await page.click(
      `${ClearPlayerWageringRequirementDialogSelector} button[type="submit"]`
    )
    await page.click(`${EditPlayerDialog} button[type="submit"]`)
  }

  const gotoFundDepositPage = async () => {
    await goto({ page, value: "/fundmanagement/deposit" })
  }

  const gotoFundWithdraw = async () => {
    await goto({ page, value: "/fundmanagement/withdraw" })
  }

  const gotoPlayerListPage = async () => {
    await goto({ page, value: "/playermanagement/playerlist" })
  }
})
