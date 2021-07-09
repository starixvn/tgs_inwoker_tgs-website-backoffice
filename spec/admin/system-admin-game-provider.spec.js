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
    context = await browser.newContext({ storageState: StorageState.Admin })
    page = await context.newPage()

    await page.goto(host(), {
      waitUntil: "networkidle0"
    })
  })

  after(async () => {
    if (!page.isClosed()) {
      await browser.close()
    }
  })

  it("should list system game providers and able to search by code or name", async () => {
    await gotoSystemAdminGameProviderPage()
    let gameProviderCodes = await getGameProviderCodes()
    expect(gameProviderCodes).to.not.be.empty

    let index = random(gameProviderCodes.length - 1)
    let gameProviderCode = gameProviderCodes[index]
    let gameProviderName = await page.$eval(
      `[data-row-index="${index}"] [data-column-id="name"]`,
      ({ textContent }) => textContent
    )

    await searchByInputNameValue({
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
      await searchByInputNameValue({
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
    await gotoSystemAdminGameProviderPage()
    let gameProviderCodes = await getGameProviderCodes()

    let index = random(gameProviderCodes.length - 1)
    let gameProviderCode = gameProviderCodes[index]
    await showGameListDialog(gameProviderCode)

    let gameCodes = await getGameListCodes()
    expect(gameCodes).to.be.not.empty

    //TODO: test search by game code
    let gameCode = gameCodes[index]
  })

  //TODO
  it("shold able to download and update game provider game localization list", async () => {})

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

  const getGameListCodes = async () =>
    await page.evaluate(() =>
      Array.from(
        window.document.querySelectorAll(
          `#game-list-dialog #game-list [data-column-id="code"]`
        )
      ).map(({ textContent }) => textContent)
    )

  const showGameListDialog = async (gameProviderCode) =>
    await Promise.all([
      await page.click(`#${gameProviderCode}-game-list-dialog-disclosure`),
      page.waitForLoadState("networkidle"),
      page.waitForSelector(`#game-list-dialog #game-list tbody`)
    ])

  const searchByInputNameValue = async ({ name = "", value = "", page }) =>
    await Promise.all([
      await page.fill(`input[name="${name}"]`, value),
      await page.click(`button[type="submit"]`),
      page.waitForLoadState("networkidle"),
      page.waitForSelector("#game-provider tbody")
    ])
})
