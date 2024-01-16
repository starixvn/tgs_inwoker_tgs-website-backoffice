import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { random } from "lodash-es"
import numeral from "numeral"
import { openDialog } from "../page/dialog.js"

const test = base.extend(Fixture)

console.warn("TODO: api not support search by licensee name?")
test.skip("search platform credit by licensee name", async ({
  page,
  licensee
}) => {
  await gotoPlatformCreditPage(page)

  await searchByInputNameValue(page, {
    name: "licenseeName",
    value: licensee.name
  })
  console.log("licensee.name", licensee.name)

  await page.waitForSelector(`[data-column-id="licenseeName"]`)
  let name = await page.$eval(
    `[data-column-id="licenseeName"]`,
    ({ textContent }) => textContent
  )
  expect(name).to.equal(licensee.name)

  await Promise.all([
    page.click(`#clear-licenseeName-button`),
    searchByInputNameValue(page, {
      name: "licenseeName",
      value: "something something not exist"
    })
  ])

  let rows = await page.$$(`[data-column-id="code"]`)
  expect(rows.length).to.equal(0)
})

const gotoPlatformCreditPage = async (page) => {
  await page.goto("/merchant/platformcredit", { waitUntil: "networkidle" })
}

const searchByInputNameValue = async (page, { name = "", value = "" }) => {
  await Promise.all([
    page.fill(`input[name="${name}"]`, value),
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/PlatformCredit?`) &&
        response.status() === 200
      )
    }),
    page.click(`button[type="submit"]`)
  ])

  await page.waitForSelector(`#platform-credit tbody`)
}
