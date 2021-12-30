import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { random } from "lodash-es"

const test = base.extend(Fixture)

test("system game providers and able to search by code or name", async ({
  page
}) => {
  await gotoSystemAdminGameProviderPage(page)

  let gameProviderCodes = await getGameProviderCodes(page)
  expect(gameProviderCodes).to.not.be.empty

  let index = random(gameProviderCodes.length - 1)
  let gameProviderCode = gameProviderCodes[index]
  let gameProviderName = await page.$eval(
    `[data-row-index="${index}"] [data-column-id="name"]`,
    ({ textContent }) => textContent
  )

  await searchGameProviderByInputNameValue(page, {
    name: "code",
    value: gameProviderCode
  })

  let code = await page.$eval(
    `[data-column-id="code"]`,
    ({ textContent }) => textContent
  )
  expect(code).to.equal(gameProviderCode)

  await Promise.all([
    await page.click("#clear-code-button"),
    await searchGameProviderByInputNameValue(page, {
      name: "name",
      value: gameProviderName
    })
  ])

  code = await page.$eval(
    `[data-column-id="code"]`,
    ({ textContent }) => textContent
  )
  expect(code).to.equal(gameProviderCode)
})

test("system game provider games and able to search by code", async ({
  page,
  adminUser
}) => {
  await gotoSystemAdminGameProviderPage(page)

  let gameProviderCodes = await getGameProviderCodes(page)

  let gameProviderIndex = random(gameProviderCodes.length - 1)
  let gameProviderCode = gameProviderCodes[gameProviderIndex]
  await showGameListDialog(page, gameProviderCode)

  let gameCodes = await getGameListCodes(page)
  expect(gameCodes).to.be.not.empty

  let gameIndex = random(gameCodes.length - 1)
  let gameCode = gameCodes[gameIndex]
  await searchGameByInputNameValue(page, {
    name: "code",
    value: gameCode
  })
  await page.waitForLoadState("networkidle")
  await page.waitForLoadState("domcontentloaded")
  await page.waitForSelector(
    `#game-list tbody [data-row-id="0"] [data-column-id="code"]`
  )

  let code = await page.$eval(
    `#game-list [data-row-id="0"] [data-column-id="code"]`,
    ({ textContent }) => textContent
  )
  expect(code).to.equal(gameCode)
})

test("shold able to download and update game provider game localization list", async ({
  page,
  adminUser
}) => {
  await gotoSystemAdminGameProviderPage(page)
  await showRandomGameProviderGameList(page)

  let [download] = await Promise.all([
    page.waitForEvent("download"),
    page.click(`#game-localization-menu`),
    page.click(`#export-game-localization`)
  ])

  let path = await download.path()
  expect(path).to.be.not.empty

  /* TODO: playwright's issue?
  await Promise.all([
    page.click(`#game-localization-menu`),
    page.click("#upload-game-localization-dialog-disclosure"),
    page.waitForEvent("filechooser", async (fileChooser) => {
      await fileChooser.setFiles(path)
    }),
    page.click(
      `#upload-game-localization-dialog #file-upload-dropzone .bb-Box`
    )
  ])

  let [uplaodResponse] = await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().endsWith("/api/Game/localization/upload") &&
        response.status() === 200
      )
    })
  ])

  let result = await uplaodResponse.json()
  expect(result.valid).to.equal(true)
   */
})

const gotoSystemAdminGameProviderPage = async (page) => {
  let SideMenuSelector = `#sidebar a[href="/systemadmin/gameproviders"]`
  await Promise.all([
    page.waitForNavigation(),
    page.click(SideMenuSelector),
    page.waitForLoadState("networkidle"),
    page.waitForSelector("#game-provider tbody")
  ])
}

const getGameProviderCodes = async (page) =>
  await page.evaluate(() =>
    Array.from(window.document.querySelectorAll(`[data-column-id="code"]`)).map(
      ({ textContent }) => textContent
    )
  )

const getGameListCodes = async (page) => {
  await page.waitForSelector(
    `#game-list-dialog #game-list [data-column-id="code"]`
  )
  return await page.evaluate(() =>
    Array.from(
      window.document.querySelectorAll(
        `#game-list-dialog #game-list [data-column-id="code"]`
      )
    ).map(({ textContent }) => textContent)
  )
}

const showRandomGameProviderGameList = async (page) => {
  let gameProviderCodes = await getGameProviderCodes(page)

  let index = random(gameProviderCodes.length - 1)

  let gameProviderCode = gameProviderCodes[index]
  await showGameListDialog(page, gameProviderCode)
}

const showGameListDialog = async (page, gameProviderCode) =>
  await Promise.all([
    await page.click(
      `#game-list-dialog-disclosure[data-game-provider-code="${gameProviderCode}"]`
    ),
    page.waitForLoadState("networkidle"),
    page.waitForSelector(`#game-list-dialog #game-list tbody`)
  ])

const searchGameByInputNameValue = async (page, { name = "", value = "" }) => {
  await page.fill(`#game-list-dialog input[name="${name}"]`, value)
  await Promise.all([
    page.waitForResponse((response) => {
      return response.url().includes("/api/Game?") && response.status() === 200
    }),
    page.click(`#game-list-dialog button[type="submit"]`)
  ])
}

const searchGameProviderByInputNameValue = async (
  page,
  { name = "", value = "" }
) =>
  await Promise.all([
    await page.fill(`input[name="${name}"]`, value),
    await page.click(`button[type="submit"]`),
    page.waitForLoadState("networkidle"),
    page.waitForSelector("#game-provider tbody")
  ])
