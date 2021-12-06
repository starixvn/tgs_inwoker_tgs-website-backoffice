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
import { selectByValue, selectRandomOption } from "../page/select"
import platform from "../platform"
import { selectPlatformByCode } from "../page/content"
import {
  register,
  login,
  manualDeposit,
  applyManualDepositForm,
  wallet,
  addManualBankCard,
  applyManualWithdrawForm
} from "../player"
import { placeBet } from "../sbo-game-provider"

let browser
let context
let page

let platformToken
let player

describe("Admin user", function () {
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

    let playerCode = await getPlayerCode(player.username)
    player.code = playerCode

    let walletAmount = 100
    await addPlayerBalance(walletAmount)
  })

  afterEach(async () => {
    await page.close()
  })

  after(async () => {
    await browser.close()
  })

  it("should able to close open round", async () => {
    let amount = 10
    let { externalRoundId, ...result } = await placeBet({
      amount,
      playerCode: player.code
    })

    await gotoGameRoundPage()

    await closeGameRoundBy(externalRoundId)

    //TODO: search player balance change record by filter = UnsettledBetManual
  })

  const closeGameRoundBy = async (externalRoundId) => {
    await page.fill(`input[name="externalRoundId"]`, externalRoundId)

    await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().includes(`externalRoundId=${externalRoundId}`) &&
          response.status() === 200
        )
      }),
      page.click(`button[type="submit"]`)
    ])

    let DialogSelector = `#close-game-open-round-dialog`
    await page.click(`${DialogSelector}-disclosure`)

    let round = {
      externalClosedOn: format(new Date(), "yyyy/MM/dd"),
      validBetAmount: 0,
      settleAmount: 0,
      commission: 0,
      turnover: 0,
      winLoss: 0,
      clientRoundStatus: "Win", // Win, Loss, Draw, or Void
      adjustAmount: 0,
      remark: lorem.word()
    }

    await fillDatePicker({
      page,
      selector: `${DialogSelector} .react-datepicker-wrapper input`,
      value: round.externalClosedOn
    })

    await page.fill(
      `${DialogSelector} input[name="validBetAmount"]`,
      `${round.validBetAmount}`
    )

    await page.fill(
      `${DialogSelector} input[name="settleAmount"]`,
      `${round.settleAmount}`
    )

    await page.fill(
      `${DialogSelector} input[name="commission"]`,
      `${round.commission}`
    )

    await page.fill(
      `${DialogSelector} input[name="turnover"]`,
      `${round.turnover}`
    )

    await page.fill(
      `${DialogSelector} input[name="winLoss"]`,
      `${round.winLoss}`
    )

    await selectByValue(
      page,
      `${DialogSelector} select[name="clientRoundStatus"]`,
      round.clientRoundStatus
    )

    await page.fill(`${DialogSelector} [name="remark"]`, round.remark)

    await page.click(`${DialogSelector} button[data-type="confirm"]`)

    await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().toLowerCase().endsWith("/closegameround") &&
          response.status() === 200
        )
      }),
      page.click(`#confirm-dialog button[type="submit"]`)
    ])
  }

  const getPlayerCode = async (username) => {
    await gotoPlayerListPage()

    await page.fill(`input[name="username"]`, username)

    await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().includes(`username=${username}`) &&
          response.status() === 200
        )
      }),
      page.click(`button[type="submit"]`)
    ])

    let playerCodeSelector = `table [data-column-id="playerCode"]`
    await page.waitForSelector(playerCodeSelector)
    let playerCode = await page.textContent(playerCodeSelector)
    return playerCode
  }

  const addPlayerBalance = async (amount) => {
    await gotoPlayerBalanceAdjustmentPage()

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

    let Selector = `#add-balance-dialog`
    await page.click(`${Selector}-disclosure`)
    await page.waitForSelector(Selector)

    await page.fill(`${Selector} input[name="amount"]`, `${amount}`)

    let expectedUrl = `/api/player/${player.code}/adjust`
    let [response] = await Promise.all([
      page.waitForResponse((response) => {
        return response.url().endsWith(expectedUrl) && response.status() === 200
      }),
      page.click(`${Selector} button[type="submit"]`)
    ])

    await page.waitForSelector(Selector, { state: "detached" })
  }

  const gotoPlayerListPage = async () => {
    await goto({ page, value: "/playermanagement/playerlist" })
    await selectPlatformByCode(page, brandCode)
  }

  const gotoPlayerBalanceAdjustmentPage = async () => {
    await goto({ page, value: "/playermanagement/balanceadjustment" })
    await selectPlatformByCode(page, brandCode)
  }

  const gotoGameRoundPage = async () => {
    await goto({ page, value: "/systemadmin/gameround" })
  }
})
