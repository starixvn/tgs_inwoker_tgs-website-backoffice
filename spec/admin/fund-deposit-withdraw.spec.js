import { chromium } from "playwright"
import { expect } from "chai"
import { StorageState } from "../auth"
import { host, headless } from "../env"
import { random } from "lodash"
import numeral from "numeral"
import { startOfDay, endOfTomorrow, format } from "date-fns"
import { lorem, phone, datatype, image, finance } from "faker"
import clone from "clone-deep"
import { fillDatePicker } from "../fill"
import { goto } from "../sidebar"
import platform from "../platform"
import {
  manualDeposit,
  applyManualDepositForm,
  wallet,
  addManualBankCard,
  applyManualWithdrawForm
} from "../player"
import { AdminUserName } from "../auth"
import globalApi from "../../client/globalApi"
import operatorApi from "../../client/operatorApi"

let browser
let context
let page

let brandCode = "GPI"
let platformToken
let player

describe("Admin user", () => {
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

  it("should able to verify player deposit and withdraw", async () => {
    let depositAmount = 10
    let balance = await approveDeposit(depositAmount)

    let withdrawAmount = depositAmount
    await approveWithdraw(withdrawAmount)

    //TODO
    /*
    await approvePendingDeposit()
    await rejectDeposit()
    await rejectWithdraw()
    */
  })

  const approveDeposit = async (deposit) => {
    const DepositAccount = "account"
    const ExpectedDepositAmount = deposit
    let formId = await manualDeposit(platformToken, player.token, {
      account: DepositAccount,
      amount: ExpectedDepositAmount
    })

    await applyManualDepositForm(platformToken, player.token, formId)

    let playerBalance = await wallet(platformToken, player.token)
    let expectedBalance = playerBalance + ExpectedDepositAmount
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

    let TableSelector = `#deposit`
    let depositAmountString = await page.textContent(
      `${TableSelector} [data-column-id="amount"] span`
    )
    let depositAmount = numeral(depositAmountString).value()
    expect(depositAmount).to.equal(ExpectedDepositAmount)

    let [download] = await Promise.all([
      page.waitForEvent("download"),
      page.click(`#export-report`)
    ])

    let path = await download.path()
    expect(path).to.be.not.empty

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

    let brandId = await page.inputValue(`select[name="brandId"]`)
    await Promise.all([
      page.waitForSelector(VerifyDepositDialogSelector, {
        state: "detached"
      }),
      page.waitForResponse((response) => {
        return (
          response.url().includes(`/api/deposit/${brandId}?`) &&
          response.status() === 200
        )
      })
    ])

    //TODO: reset status filter to find approved form record
    /*
    let StatusSelector = `${TableSelector} [data-column-id="status"] span`
    await page.waitForSelector(StatusSelector)
    let status = await page.$eval(
      StatusSelector,
      ({ dataset }) => dataset.status
    )
    expect(status).to.equal("Approved")

    let OperatorSelector = `${TableSelector} [data-column-id="reviewedUserName"]`
    let operator = await page.textContent(OperatorSelector)
    expect(operator).to.equal(AdminUserName)

    let TotalAmountSelector = `#total-amount`
    let totalAmountString = await page.textContent(TotalAmountSelector)
    expect(depositAmountString).to.equal(totalAmountString)
    */

    let balance = await wallet(platformToken, player.token)
    expect(balance).to.equal(expectedBalance)
  }

  const rejectDeposit = async () => {
    //TODO
  }

  const approvePendingDeposit = async () => {
    //TODO
  }

  const approveWithdraw = async (withdraw) => {
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

    let playerBalance = await wallet(platformToken, player.token)
    let expectedBalance = playerBalance - withdraw

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

    let [download] = await Promise.all([
      page.waitForEvent("download"),
      page.click(`#export-report`)
    ])

    let path = await download.path()
    expect(path).to.be.not.empty

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

    let brandId = await page.inputValue(`select[name="brandId"]`)
    await Promise.all([
      page.waitForSelector(VerifyDialogSelector, {
        state: "detached"
      }),
      page.waitForResponse((response) => {
        return (
          response.url().includes(`/api/withdraw/${brandId}?`) &&
          response.status() === 200
        )
      })
    ])

    //TODO: reset form id
    /*
    let StatusSelector = `${TableSelector} [data-column-id="status"] [data-status]`
    await page.waitForSelector(StatusSelector)
    let status = await page.$eval(
      StatusSelector,
      ({ dataset }) => dataset.status
    )
    expect(status).to.equal("Approved")

    let OperatorSelector = `${TableSelector} [data-column-id="reviewedUserName"]`
    let operator = await page.textContent(OperatorSelector)
    expect(operator).to.equal(AdminUserName)

    let balance = await wallet(platformToken, player.token)
    expect(balance).to.equal(expectedBalance)

    let PaidDialogSelector = `#fund-withdraw-paid-dialog`
    await page.click(`${PaidDialogSelector}-disclosure`)
    await page.waitForSelector(PaidDialogSelector)
    await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().includes(`/api/withdraw/${formId}`) &&
          response.status() === 200
        )
      }),
      page.click(`${PaidDialogSelector} button[type="submit"]`)
    ])

    await Promise.all([
      page.waitForSelector(PaidDialogSelector, {
        state: "detached"
      }),
      page.waitForResponse((response) => {
        return (
          response.url().includes(`/api/withdraw/${brandId}?`) &&
          response.status() === 200
        )
      })
    ])

    status = ""
    await page.waitForSelector(StatusSelector)
    status = await page.$eval(StatusSelector, ({ dataset }) => dataset.status)
    expect(status).to.equal("Paid")
    */
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

  const rejectWithdraw = async () => {
    //TODO
  }

  const gotoFundDepositPage = async () => {
    await goto({ page, value: "/fundmanagement/deposit" })
    await platform.selectByCode({ page, brandCode })
  }

  const gotoFundWithdraw = async () => {
    await goto({ page, value: "/fundmanagement/withdraw" })
    await platform.selectByCode({ page, brandCode })
  }

  const gotoPlayerListPage = async () => {
    await goto({ page, value: "/playermanagement/playerlist" })
    await platform.selectByCode({ page, brandCode })
  }
})
