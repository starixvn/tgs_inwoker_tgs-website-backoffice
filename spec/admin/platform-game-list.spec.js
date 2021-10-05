import { chromium } from "playwright"
import { expect } from "chai"
import { StorageState } from "../auth"
import { host, headless } from "../env"
import { random, zip } from "lodash"
import numeral from "numeral"
import { startOfDay, endOfTomorrow, format } from "date-fns"
import { lorem, phone, datatype, image } from "faker"
import clone from "clone-deep"
import { fillDatePicker } from "../fill"
import { goto } from "../sidebar"
import platform from "../platform"
import select from "../select"

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

    await gotoPlatformGameListPage()
  })

  afterEach(async () => {
    await page.close()
  })

  after(async () => {
    await browser.close()
  })

  it("should able to search, edit game and toggle tags, status", async () => {
    let criteria = await randomGame()

    await search(criteria)

    await toggleField(Field.isHot)
    await toggleField(Field.isNew)
    await toggleField(Field.isRecommend)
    await toggleField(Field.status)

    if (!criteria.gameType.endsWith("Lobby")) {
      //no fields to update for lobby game type
      let record = await edit()
      await verifyUpdated(record)
    }
  })

  const getGames = async () => {
    await page.waitForSelector(`table#games tbody`)
    let gameProviders = await page.$$eval(
      `[data-column-id="gameProviderName"]`,
      (items) => items.map(({ textContent }) => textContent)
    )

    let gameTypes = await page.$$eval(
      `[data-column-id="gameType"] span`,
      (items) =>
        items.map(({ textContent, dataset }) => ({
          gameTypeName: textContent,
          gameType: dataset.gameType
        }))
    )

    let gameNames = await page.$$eval(`[data-column-id="gameName"]`, (items) =>
      items.map(({ textContent }) => textContent)
    )

    let games = zip(gameProviders, gameTypes, gameNames).map(
      ([gameProviderName, gameType, gameName]) => ({
        gameProviderName,
        ...gameType,
        gameName
      })
    )
    return games
  }

  const randomGame = async () => {
    let games = await getGames()

    let randomIndex = random(0, games.length - 1)
    let selected = games[randomIndex]
    return selected
  }

  const search = async (criteria) => {
    await page.selectOption(`select[name="gameProviderId"]`, {
      label: criteria.gameProviderName
    })
    await page.selectOption(`select[name="gameType"]`, criteria.gameType)
    await page.fill(`input[name="keyword"]`, criteria.gameName)

    await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().includes(`/api/brandgame?`) &&
          response.status() === 200
        )
      }),
      page.click(`button[type="submit"]`)
    ])

    const TableSelector = `table#games`
    await page.waitForSelector(`${TableSelector} tbody`)

    let gameProviderName = await page.textContent(
      `${TableSelector} [data-column-id="gameProviderName"]`
    )
    expect(gameProviderName).to.equal(criteria.gameProviderName)

    let gameName = await page.textContent(
      `${TableSelector} [data-column-id="gameName"]`
    )
    expect(gameName).to.includes(criteria.gameName)

    let gameTypeName = await page.textContent(
      `${TableSelector} [data-column-id="gameType"]`
    )
    expect(gameTypeName).to.equal(criteria.gameTypeName)
  }

  const Field = {
    isHot: "isHot",
    isNew: "isNew",
    isRecommend: "isRecommend",
    status: "status"
  }
  const toggleField = async (field) => {
    let FieldSelector = `[data-column-id="${field}"] label`
    let CheckboxSelector = `${FieldSelector} input[type="checkbox"]`
    await page.waitForSelector(FieldSelector)
    let expected = !(await page.isChecked(CheckboxSelector))

    await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().includes(`/api/brandgame?`) &&
          response.status() === 200
        )
      }),
      page.click(FieldSelector)
    ])

    await page.waitForLoadState("networkidle")
    await page.waitForSelector(FieldSelector)
    let checked = await page.isChecked(CheckboxSelector)
    expect(checked).to.equal(expected)
  }

  const editDialog = async () => {
    await page.click(`#edit-game-dialog-disclosure`)

    let DialogSelector = `#edit-game-dialog`
    await page.waitForSelector(DialogSelector)
    return DialogSelector
  }

  const edit = async () => {
    let DialogSelector = await editDialog()

    let EffectiveBettingPercentageInputSelector = `${DialogSelector} input[name="effectiveBettingPercentage"]`

    let effectiveBettingPercentage = random(0, 100)
    await page.fill(
      EffectiveBettingPercentageInputSelector,
      `${effectiveBettingPercentage}`
    )

    let RebateCheckboxSelector = `${DialogSelector} input[name="rebate"]`
    let rebate = !(await page.isChecked(RebateCheckboxSelector))
    await page.click(`${RebateCheckboxSelector} + div.bb-SwitchIcon`)

    let gameId = await page.inputValue(`${DialogSelector} input[name="id"]`)

    let expectedUrl = `/api/brandgame/${gameId}`
    await Promise.all([
      page.waitForResponse((response) => {
        return response.url().endsWith(expectedUrl) && response.status() === 200
      }),
      page.click(`${DialogSelector} button[type="submit"]`)
    ])

    return {
      effectiveBettingPercentage,
      rebate
    }
  }

  const verifyUpdated = async (game) => {
    let DialogSelector = await editDialog()

    let effectiveBettingPercentageString = await page.inputValue(
      `${DialogSelector} input[name="effectiveBettingPercentage"]`
    )
    let effectiveBettingPercentage = numeral(
      effectiveBettingPercentageString
    ).value()
    expect(effectiveBettingPercentage).to.equal(game.effectiveBettingPercentage)

    let rebate = await page.isChecked(`${DialogSelector} input[name="rebate"]`)
    expect(rebate).to.equal(game.rebate)
  }

  const gotoPlatformGameListPage = async () => {
    await goto({ page, value: "/game/brandgames" })
    await platform.selectFirst({ page })
  }
})
