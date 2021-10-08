import { chromium } from "playwright"
import { expect } from "chai"
import { StorageState } from "../auth"
import { host, headless } from "../env"
import { random } from "lodash"
import numeral from "numeral"
import { startOfDay, endOfTomorrow, format } from "date-fns"
import { lorem, phone, datatype, image } from "faker"
import clone from "clone-deep"
import { fillDatePicker } from "../fill"
import { goto } from "../sidebar"
import platform from "../platform"
import select from "../select"
import {
  register,
  login,
  manualDeposit,
  applyManualDepositForm,
  wallet
} from "../player"

let browser
let context
let page

let brandCode = "GPI"
let platformToken
let player

describe("Admin user", () => {
  before(async () => {
    browser = await chromium.launch({ headless: headless() })
    context = await browser.newContext({ storageState: StorageState.Admin })
  })

  beforeEach(async () => {
    page = await context.newPage()

    await page.goto(host(), {
      waitUntil: "networkidle0"
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

  it("should able to verify player deposit and withdraw", async () => {
    let depositAmount = 10
    let balance = await approveDeposit(depositAmount)

    //TODO
    await rejectDeposit()
    await approvePendingDeposit()
    await approveWithdraw(depositAmount)
    await rejectWithdraw()
  })

  const approveDeposit = async (deposit) => {
    const DepositAccount = "account"
    const ExpectedDepositAmount = deposit
    let expectedFormId = await manualDeposit(platformToken, player.token, {
      account: DepositAccount,
      amount: ExpectedDepositAmount
    })

    await applyManualDepositForm(platformToken, player.token, expectedFormId)

    let playerBalance = await wallet(platformToken, player.token)
    let expectedBalance = playerBalance + ExpectedDepositAmount
    await gotoFundDepositPage()

    await page.fill(`input[name="id"]`, expectedFormId)
    await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().includes(`id=${expectedFormId}`) &&
          response.status() === 200
        )
      }),
      page.click(`button[type="submit"]`)
    ])

    let TableSelector = `#deposit`
    let FormIdSelector = `${TableSelector} [data-column-id="id"]`
    await page.waitForSelector(FormIdSelector)

    let formId = await page.textContent(FormIdSelector)
    expect(formId).to.equal(expectedFormId)

    let depositAmountString = await page.textContent(
      `${TableSelector} [data-column-id="amount"] span`
    )
    let depositAmount = numeral(depositAmountString).value()
    expect(depositAmount).to.equal(ExpectedDepositAmount)

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

    let StatusSelector = `${TableSelector} [data-column-id="status"] [data-status]`
    await page.waitForSelector(StatusSelector)
    /*
    //FIXME: not work
    let status = await page.$eval(
      StatusSelector,
      ({ dataset }) => dataset.status
    )
    expect(status).to.equal("Approved")
    */

    let balance = await wallet(platformToken, player.token)
    expect(balance).to.equal(expectedBalance)
  }

  const rejectDeposit = async () => {}

  const approvePendingDeposit = async () => {}

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
    let expectedPlayerBalance = playerBalance - withdraw

    //TODO:
    //1. player init bank card
    //2. apply withdraw
    await gotoFundWithdraw()
    //2. bo > fund withdraw > verify
    //3. get player balance
  }

  const rejectWithdraw = async () => {}

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
