import { chromium } from "playwright"
import { expect } from "chai"
import { StorageState, UserName } from "../auth"
import { host, headless } from "../env"
import { random } from "lodash"

let browser
let context
let page

describe("Admin user", () => {
  before(async () => {
    browser = await chromium.launch({ headless: headless() })
    context = await browser.newContext({
      acceptDownloads: true,
      storageState: StorageState.Admin
    })
  })

  beforeEach(async () => {
    page = await context.newPage()

    await page.goto(host(), {
      waitUntil: "networkidle0"
    })
    await gotoSystemAdminGameProviderPage()
  })

  afterEach(async () => {
    await page.close()
  })

  after(async () => {
    await browser.close()
  })

  it("should list system game providers and able to search by code or name", async () => {
    let gameProviderCodes = await getGameProviderCodes()
    expect(gameProviderCodes).to.not.be.empty

    let index = random(gameProviderCodes.length - 1)
    let gameProviderCode = gameProviderCodes[index]
    let gameProviderName = await page.$eval(
      `[data-row-index="${index}"] [data-column-id="name"]`,
      ({ textContent }) => textContent
    )

    await searchGameProviderByInputNameValue({
      name: "code",
      value: gameProviderCode,
      page
    })

    let code = await page.$eval(
      `[data-column-id="code"]`,
      ({ textContent }) => textContent
    )
    expect(code).to.equal(gameProviderCode)

    await Promise.all([
      await page.click("#clear-code-button"),
      await searchGameProviderByInputNameValue({
        name: "name",
        value: gameProviderName,
        page
      })
    ])

    code = await page.$eval(
      `[data-column-id="code"]`,
      ({ textContent }) => textContent
    )
    expect(code).to.equal(gameProviderCode)
  })

  it("should list system game provider games and able to search by code", async () => {
    let gameProviderCodes = await getGameProviderCodes()

    let gameProviderIndex = random(gameProviderCodes.length - 1)
    let gameProviderCode = gameProviderCodes[gameProviderIndex]
    await showGameListDialog(gameProviderCode)

    let gameCodes = await getGameListCodes()
    expect(gameCodes).to.be.not.empty

    let gameIndex = random(gameCodes.length - 1)
    let gameCode = gameCodes[gameIndex]
    await searchGameByInputNameValue({
      name: "code",
      value: gameCode,
      page
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

  it("shold able to download and update game provider game localization list", async () => {
    await showRandomGameProviderGameList()

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

  const gotoSystemAdminGameProviderPage = async () => {
    let SideMenuSelector = `#sidebar a[href="/systemadmin/gameproviders"]`
    await Promise.all([
      page.waitForNavigation(),
      page.click(SideMenuSelector),
      page.waitForLoadState("networkidle"),
      page.waitForSelector("#game-provider tbody")
    ])
  }

  const getGameProviderCodes = async () =>
    await page.evaluate(() =>
      Array.from(
        window.document.querySelectorAll(`[data-column-id="code"]`)
      ).map(({ textContent }) => textContent)
    )

  const getGameListCodes = async () => {
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

  const showRandomGameProviderGameList = async () => {
    let gameProviderCodes = await getGameProviderCodes()

    let index = random(gameProviderCodes.length - 1)
    let gameProviderCode = gameProviderCodes[index]

    await showGameListDialog(gameProviderCode)
  }

  const showGameListDialog = async (gameProviderCode) =>
    await Promise.all([
      await page.click(`#${gameProviderCode}-game-list-dialog-disclosure`),
      page.waitForLoadState("networkidle"),
      page.waitForSelector(`#game-list-dialog #game-list tbody`)
    ])

  const searchGameByInputNameValue = async ({
    name = "",
    value = "",
    page
  }) => {
    await page.fill(`#game-list-dialog input[name="${name}"]`, value)
    await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().includes("/api/Game?") && response.status() === 200
        )
      }),
      page.click(`#game-list-dialog button[type="submit"]`)
    ])
  }

  const searchGameProviderByInputNameValue = async ({
    name = "",
    value = "",
    page
  }) =>
    await Promise.all([
      await page.fill(`input[name="${name}"]`, value),
      await page.click(`button[type="submit"]`),
      page.waitForLoadState("networkidle"),
      page.waitForSelector("#game-provider tbody")
    ])
})
