import { chromium } from "playwright"
import { expect } from "chai"
import { StorageState, PlatformCode } from "../auth"
import { host, headless } from "../env"
import { random } from "lodash"
import numeral from "numeral"
import { startOfDay, endOfTomorrow, format } from "date-fns"
import { lorem } from "faker"
import clone from "clone-deep"
import { fillDatePicker } from "../fill"
import { goto } from "../sidebar"
import platform from "../platform"
import { selectPlatformByCode, selectRandomPlatform } from "../platform/index"
import {
  register,
  login,
  manualDeposit,
  applyManualDepositForm,
  wallet,
  addManualBankCard,
  applyManualWithdrawForm
} from "../player"

let browser
let context
let page

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

    platformToken = await platform.token({ brandCode: PlatformCode })
    player = await register(platformToken)
    player = {
      ...player,
      ...(await login(platformToken, player))
    }

    await gotoPlayerListPage()
  })

  afterEach(async () => {
    await page.close()
  })

  after(async () => {
    await browser.close()
  })

  it("should able to search, view and edit player", async () => {
    await page.fill(`input[name="username"]`, player.username)
    
    await Promise.all(
      [
        page.waitForResponse((response) => {
          return response.url().includes(`username=${player.username}`) && response.status() === 200
        }),
        page.click(`button[type="submit"]`)
      ]
    )

    let UsernameSelector = `[data-column-id="username"]`
    let username = await page.textContent(UsernameSelector)
    expect(username).to.equal(player.username)

    //TODO: view & edit
  })

  const gotoPlayerListPage = async () => {
    await goto({ page, value: "/playermanagement/playerlist" })

    await selectPlatformByCode(page, PlatformCode)
  }
})
