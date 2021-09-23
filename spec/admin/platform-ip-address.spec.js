import { chromium } from "playwright"
import { expect } from "chai"
import { StorageState } from "../auth"
import { host, headless } from "../env"
import { random } from "lodash"
import numeral from "numeral"
import { startOfDay, endOfTomorrow, format } from "date-fns"
import { lorem } from "faker"
import clone from "clone-deep"
import { fillDatePicker } from "../fill"
import { goto } from "../sidebar"
import platform from "../platform"
import { register, login } from "../player"

let browser
let context
let page

let brandCode = "GPI"
let platformToken
let players = []

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

    players = await createPlayers(platformToken)
    await gotoPlatformIpAddressPage()
  })

  afterEach(async () => {
    await page.close()
  })

  after(async () => {
    await browser.close()
  })

  it("should able to search ip address", async () => {
    await findPlayerBySamePlayer()

    //TODO
  })

  const IpType = {
    RegisterIP: "RegisterIP",
    LoginIP: "LoginIP"
  }

  const IpTypes = [IpType.RegisterIP, IpType.LoginIP]

  const randomIpType = () => {
    let index = random(0, IpTypes.length - 1)
    return IpTypes[index]
  }

  const findPlayerBySamePlayer = async () => {
    await page.click(`button#SamePlayerIpAddress`)

    let SelectSelector = `select[name="ipType"]`
    let expectedIpType = randomIpType()
    await page.waitForSelector(SelectSelector)
    await page.selectOption(SelectSelector, expectedIpType)

    await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().includes(`/api/PlayerIp?`) && response.status() === 200
        )
      }),
      page.click(`button[type="submit"]`)
    ])

    let LinkSelector = `[data-column-id="ipAddress"] a`
    await page.waitForSelector(LinkSelector)
    let expectedIp = await page.textContent(LinkSelector)
    expect(expectedIp).to.be.a("string")

    await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().includes(`/api/PlayerIp/Ip?`) &&
          response.status() === 200
        )
      }),
      page.click(LinkSelector)
    ])

    let IpAddressInputSelector = `input[name="ipAddress"]`
    await page.waitForSelector(IpAddressInputSelector)

    let searchIp = await page.inputValue(IpAddressInputSelector)
    expect(searchIp).to.equal(expectedIp)

    await page.waitForSelector(SelectSelector)
    let searchIpType = await page.inputValue(SelectSelector)
    expect(searchIpType).to.equal(expectedIpType)

    let searchPlayerListResult = await page.$$eval(
      `[data-column-id="username"]`,
      (rows) => rows.map(({ textContent }) => textContent)
    )
    expect(searchPlayerListResult.length).above(0)

    let usernames = players.map(({ username }) => username)
    expect(searchPlayerListResult).to.include.members(usernames)
  }

  const findPlayerByUsername = async () => {}

  const createPlayers = async (platformToken, size = 2, list = []) => {
    if (size == 0) {
      return list
    }

    let player = await register(platformToken)
    player = {
      ...player,
      ...(await login(platformToken, player))
    }
    return createPlayers(platformToken, size - 1, [...list, player])
  }

  const gotoPlatformIpAddressPage = async () => {
    await goto({ page, value: "/platform/ipaddress" })
    await platform.selectByCode({ page, brandCode })
  }
})
