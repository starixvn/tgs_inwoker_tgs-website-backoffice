import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { random } from "lodash-es"
import { selectRandomPlatform } from "../page/content.js"
import { mapColumnCellTextContents } from "../page/table.js"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test("search, change status, edit and default maintananice", async ({
  page
}) => {
  let brandId = await gotoPlatformGameProviderListPage(page)

  await searchRandomGameProvider(page)
  await changeRandomStatus(page)

  //TODO
  // await editGameProvider()
  // await editDefaultMaintenance()
})

const GameProviderNameSelector = `[data-column-id="gameProviderName"]`
const getGameProviderNames = async (page) =>
  await mapColumnCellTextContents(page, GameProviderNameSelector)

const searchRandomGameProvider = async (page) => {
  let gameProviderNames = await getGameProviderNames(page)

  let gameProviderIndex = random(0, gameProviderNames.length - 1)
  let expectedGameProviderName = gameProviderNames[gameProviderIndex]

  let inputSelector = `input[name="keyword"]`
  await page.fill(inputSelector, expectedGameProviderName)

  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/brandgameprovider?`)),
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

const changeRandomStatus = async (page, list = Object.values(Status)) => {
  if (list.length == 0) {
    return
  }

  let StatusSelector = `[data-column-id="status"] button`
  let statusLocator = page.locator(StatusSelector)
  let status = await statusLocator.getAttribute("data-status")

  let restStatus = list.filter((item) => item != status)

  let randomIndex = random(0, restStatus.length - 1)
  let expectedStatus = restStatus[randomIndex]

  await page.click(StatusSelector)
  let MenuItemSelector = `.bb-DropdownMenuItem[data-status="${expectedStatus}"]`
  await page.waitForSelector(MenuItemSelector)

  await Promise.all([
    page.waitForResponse(urlIncludes(`/${expectedStatus}`)),
    page.waitForResponse(urlIncludes(`/api/brandgameprovider?`)),
    page.click(MenuItemSelector)
  ])

  status = await statusLocator.getAttribute("data-status")
  expect(status).to.equal(expectedStatus)
}

const gotoPlatformGameProviderListPage = async (page) => {
  await page.goto("/game/brandproviders", { waitUntil: "networkidle" })
  return await selectRandomPlatform(page)
}
