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
import platform, { selectFirst } from "../platform"
import { mapColumnCellTextContents } from "../page/table"

let browser
let context
let page

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

    await gotoPlatformGameProviderListPage()
  })

  afterEach(async () => {
    await page.close()
  })

  after(async () => {
    await browser.close()
  })

  it("should able to search, change status, edit and default maintananice", async () => {
    await searchRandomGameProvider()
    await changeRandomStatus()

    //TODO
    /*
    await editGameProvider()
    await editDefaultMaintenance()
    */
  })

  const GameProviderNameSelector = `[data-column-id="gameProviderName"]`
  const getGameProviderNames = async () =>
    await mapColumnCellTextContents(page, GameProviderNameSelector)

  const searchRandomGameProvider = async () => {
    let gameProviderNames = await getGameProviderNames()

    let gameProviderIndex = random(0, gameProviderNames.length - 1)
    let expectedGameProviderName = gameProviderNames[gameProviderIndex]

    let inputSelector = `input[name="keyword"]`
    await page.fill(inputSelector, expectedGameProviderName)

    await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().includes(`/api/brandgameprovider?`) &&
          response.status() === 200
        )
      }),
      page.click(`button[type="submit"]`)
    ])

    await page.waitForSelector(GameProviderNameSelector)
    let gameProviderName = await page.textContent(GameProviderNameSelector)
    expect(gameProviderName).to.equal(expectedGameProviderName)
  }

  const Status = {
    Inactive: "Inactive",
    Maintenance: "Maintenance",
    Active: "Active"
  }

  const changeRandomStatus = async (list = Object.values(Status)) => {
    if (list.length == 0) {
      return
    }

    let StatusSelector = `[data-column-id="status"] button`
    let status = await page.$eval(
      StatusSelector,
      ({ dataset }) => dataset.status
    )

    let restStatus = list.filter((item) => item != status)

    let randomIndex = random(0, restStatus.length - 1)
    let expectedStatus = restStatus[randomIndex]

    await page.click(StatusSelector)
    let MenuItemSelector = `.bb-DropdownMenuItem[data-status="${expectedStatus}"]`
    await page.waitForSelector(MenuItemSelector)

    await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().endsWith(`/${expectedStatus}`) &&
          response.status() === 200
        )
      }),
      page.click(MenuItemSelector)
    ])

    await page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/brandgameprovider?`) &&
        response.status() === 200
      )
    })
    await page.waitForSelector(StatusSelector)

    status = await page.$eval(StatusSelector, ({ dataset }) => dataset.status)
    expect(status).to.equal(expectedStatus)
  }

  const editGameProvider = async () => {}

  const editDefaultMaintenance = async () => {}

  const gotoPlatformGameProviderListPage = async () => {
    await goto({ page, value: "/game/brandproviders" })
    await selectFirst({ page })
  }
})
