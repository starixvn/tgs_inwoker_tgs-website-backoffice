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
import { selectRandomOption } from "../page/select"
import { selectRandomPlatform } from "./index"


let browser
let context
let page

let platformToken
let player

describe.skip("Platform user", () => {
  before(async () => {
    browser = await chromium.launch({ headless: headless() })
    context = await browser.newContext({ storageState: StorageState.Platform })
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

  it("should show deposit and withdraw alarm on header", async () => {

  })

  const depositAlarm = async () => {

  }

  const withdrawAlarm = async () => {

  }
})
