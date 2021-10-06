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
import { register, login } from "../player"

let browser
let context
let page

let brandCode = "GPI"
let platformToken
let player

//TODO: test file upload
describe.skip("Admin user", () => {
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
    await verifyDeposit()
    await verifyWithdraw()
  })

  const verifyDeposit = async () => {
    //TODO:
    //1. player > deposit payment list
    //2. player > apply manualDeposit
    //3. get player balance
    await gotoFundDepositPage()
    //4. verify by player username
    //5. get player balance
  }

  const verifyPendingDeposit = async () => {}

  const verifyWithdraw = async () => {
    //TODO:
    //5. get player balance
    //6. player init bank card
    await gotoFundWithdraw()
    //8. bo > fund withdraw > verify
    //9. get player balance
  }

  const gotoFundDepositPage = async () => {
    await goto({ page, value: "/fundmanagement/deposit" })
    await platform.selectByCode({ page, brandCode })
  }

  const gotoFundWithdraw = async () => {
    await goto({ page, value: "/fundmanagement/withdraw" })
    await platform.selectByCode({ page, brandCode })
  }
})
