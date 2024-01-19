import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { random } from "lodash-es"
import numeral from "numeral"
import { openDialog } from "../page/dialog.js"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test("edit platform credit", async ({
  page,
  host,
  licensee,
  backofficeApi
}) => {
  let [platform] = await Promise.all([
    backofficeApi.platform.addPlatform({
      licenseeId: licensee.id
    }),
    gotoPlatformCreditPage(page, host)
  ])

  await page.fill(`input[name="keyword"]`, platform.code)
  await Promise.all([
    page.waitForResponse(urlIncludes(`keyword=${platform.code}`)),
    page.click(`button[type="submit"]`)
  ])

  let DialogSelector = `#platform-credit-dialog`
  await openDialog(page, DialogSelector)

  let creditInputLocator = page.locator(
    `${DialogSelector} input[name="credit"]`
  )
  let inputValueInString = await creditInputLocator.inputValue()
  let platformCredit = numeral(inputValueInString).value()
  let expectedValue = platformCredit + 10
  await page.fill(`${DialogSelector} input[name="credit"]`, `${expectedValue}`)

  let id = await page.inputValue(`${DialogSelector} input[name="id"]`)

  await Promise.all([
    page.waitForResponse(
      urlIncludes(`/api/PlatformCredit/${id}/${expectedValue}`)
    ),
    page.waitForResponse(urlIncludes(`/api/PlatformCredit?`)),
    page.click(`${DialogSelector} button[type="submit"]`)
  ])

  let creditLocator = page.locator(`[data-column-id="credit"]`).first()
  let creditString = await creditLocator.textContent()
  let credit = numeral(creditString).value()
  expect(credit).to.equal(expectedValue)
})

const gotoPlatformCreditPage = async (page) => {
  await page.goto("/merchant/platformcredit", { waitUntil: "networkidle" })
}
