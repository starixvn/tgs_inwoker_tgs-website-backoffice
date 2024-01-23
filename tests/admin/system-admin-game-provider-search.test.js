import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { random } from "lodash-es"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test("system game providers and able to search by code or name", async ({
  page,
  backofficeApi
}) => {
  await gotoSystemAdminGameProviderPage(page)

  let gameProvider = await backofficeApi.gameProvider.random()
  let gameProviderCode = gameProvider.code
  let gameProviderName = gameProvider.name

  await searchGameProviderByInputNameValue(page, {
    name: "code",
    value: gameProviderCode
  })

  let code = await page.locator(`[data-column-id="code"]`).first().textContent()
  expect(code).to.equal(gameProviderCode)

  await page.click("#clear-code-button")
  await searchGameProviderByInputNameValue(page, {
    name: "name",
    value: gameProviderName
  })

  code = await page.locator(`[data-column-id="code"]`).first().textContent()
  expect(gameProviderCode).to.includes(code)
})

const gotoSystemAdminGameProviderPage = async (page) => {
  await page.goto("/systemadmin/gameproviders", { waitUntil: "networkidle" })
  await page.waitForSelector("#game-provider tbody")
}

const searchGameProviderByInputNameValue = async (
  page,
  { name = "", value = "" }
) => {
  await page.fill(`input[name="${name}"]`, value)
  await Promise.all([
    page.waitForResponse(urlIncludes("/api/GameProvider?")),
    page.click(`button[type="submit"]`)
  ])
}
