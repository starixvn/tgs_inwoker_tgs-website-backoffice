import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { random, zip } from "lodash-es"
import numeral from "numeral"
import { selectRandomPlatform } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test("search, edit game and toggle tags, status", async ({ page }) => {
  let brandId = await gotoPlatformGameListPage(page)
  let criteria = await randomGame(page)
  await search(page, criteria)

  await toggleField(page, Field.isHot)
  await toggleField(page, Field.isNew)
  await toggleField(page, Field.isRecommend)
  await toggleField(page, Field.status)

  if (!criteria.gameType.endsWith("Lobby")) {
    //no fields to update for lobby game type
    let record = await edit(page)
    await verifyUpdated(page, record)
  }
})

const getGames = async (page) => {
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

const randomGame = async (page) => {
  let games = await getGames(page)

  let randomIndex = random(0, games.length - 1)
  let selected = games[randomIndex]
  return selected
}

const search = async (page, criteria) => {
  await page.selectOption(`select[name="gameProviderId"]`, {
    label: criteria.gameProviderName
  })
  await page.selectOption(`select[name="gameType"]`, criteria.gameType)
  await page.fill(`input[name="keyword"]`, criteria.gameName)

  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/brandgame?`)),
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
const toggleField = async (page, field) => {
  let FieldSelector = `[data-column-id="${field}"] label`
  let CheckboxSelector = `${FieldSelector} input[type="checkbox"]`
  await page.waitForSelector(FieldSelector)
  let expected = !(await page.isChecked(CheckboxSelector))

  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/brandgame?`)),
    page.click(FieldSelector)
  ])

  await page.waitForLoadState("networkidle")
  await page.waitForSelector(FieldSelector)
  let checked = await page.isChecked(CheckboxSelector)
  expect(checked).to.equal(expected)
}

const openEditDialog = async (page) => {
  let DialogSelector = `#edit-game-dialog`
  await openDialog(page, DialogSelector)
  return DialogSelector
}

const edit = async (page) => {
  let DialogSelector = await openEditDialog(page)

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

const verifyUpdated = async (page, game) => {
  let DialogSelector = await openEditDialog(page)

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

const gotoPlatformGameListPage = async (page) => {
  await page.goto("/game/brandgames", { waitUntil: "networkidle" })
  return await selectRandomPlatform(page)
}
