import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { random } from "lodash-es"
import { selectPlatformByCode } from "../page/content.js"
import operatorApi from "../../client/operatorApi/index.js"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test("search ip address", async ({ page, platformCode, platformToken }) => {
  let players = ([] = await createPlayers(platformToken))

  let brandId = await gotoPlatformIpAddressPage(page, platformCode)
  await findPlayerBySamePlayer(page)
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

const findPlayerBySamePlayer = async (page) => {
  await page.click(`button#SamePlayerIpAddress`)

  let SelectSelector = `select[name="ipType"]`
  let expectedIpType = randomIpType()
  await page.waitForSelector(SelectSelector)
  await page.selectOption(SelectSelector, expectedIpType)

  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/PlayerIp?`)),
    page.click(`button[type="submit"]`)
  ])

  let LinkSelector = `[data-column-id="ipAddress"] a`
  await page.waitForSelector(LinkSelector)
  let expectedIp = await page.textContent(LinkSelector)
  expect(expectedIp).to.be.a("string")

  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/PlayerIp/Ip?`)),
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
}

const createPlayers = async (platformToken, size = 2, list = []) => {
  if (size == 0) {
    return list
  }

  let player = await operatorApi.player.create(platformToken)
  player = {
    ...player,
    ...(await operatorApi.player.login(platformToken, player))
  }
  return createPlayers(platformToken, size - 1, [...list, player])
}

const gotoPlatformIpAddressPage = async (page, platformCode) => {
  await page.goto("/platform/ipaddress", { waitUntil: "networkidle" })
  return await selectPlatformByCode(page, platformCode)
}
