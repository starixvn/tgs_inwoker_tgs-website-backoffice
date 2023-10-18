import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { faker } from "@faker-js/faker"

const test = base.extend(Fixture)

test("add and edit platform, search platform", async ({ page }) => {
  await gotoPlatformListPage(page)

  let record = await editLogo(page)
  await editLogo(page, record)
})

//TODO: move to platform-page.js or use backofficeApi instead?
export const addPlatform = async (page) => {
  /*
  {
    "resellerId":"b5a2c708-ab70-4316-9f4d-5d2ad0e77460",
    "licenseeId":"66c5fef5-217b-4929-9a08-72c2479a8f4e",
    "code":"ONE",
    "name":"ONE",
    "description":"ONE",
    "operationalEmail":"ONE@mail.com",
    "agentDividendType":"OneLayer",
    "domains":["ONE.com"],
    "settlementIntervalType":"Daily",
    "platformCharge":"0",
    "languages":[{"cultureCode":"en-US","brandCultureCode":"en-US"}],"currencyCodes":["CNY"],
    "gameProviders":[{"gameProviderId":"630e822b-2635-4314-a7e4-5c7057c1a920","name":"365 Cards","configurationId":"5dd6c034-297a-4718-8d89-d6811a46abed","defaultLanguageCode":"","desktopQueryString":"","mobileQueryString":""}],
    "betLimits":[{"id":"15","currencyCode":"CNY","isDefault":true}]}
  */
  //TODO
  //1. select reseller, select licensee
  //2.
}

const editLogo = async (page, record = {}) => {
  let DialogSelector = `#platform-logo-dialog`
  await page.click(`${DialogSelector}-disclosure`)
  await page.waitForSelector(DialogSelector)

  if (record.mobile) {
    let url = await page.inputValue(`${DialogSelector} input[name="mobile"]`)
    expect(url).to.equal(record.mobile)
  }

  if (record.desktop) {
    let url = await page.inputValue(`${DialogSelector} input[name="desktop"]`)
    expect(url).to.equal(record.desktop)
  }

  if (record.loading) {
    let url = await page.inputValue(`${DialogSelector} input[name="loading"]`)
    expect(url).to.equal(record.loading)
  }

  let randomRecord = randomLogo()

  await page.fill(`${DialogSelector} input[name="mobile"]`, randomRecord.mobile)
  await page.fill(
    `${DialogSelector} input[name="desktop"]`,
    randomRecord.desktop
  )
  await page.fill(
    `${DialogSelector} input[name="loading"]`,
    randomRecord.loading
  )

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().endsWith(`/api/brand/logo`) && response.status() === 200
      )
    }),
    page.click(`${DialogSelector} button[type="submit"]`)
  ])

  return randomRecord
}

const randomLogo = () => ({
  desktop: faker.image.url(),
  mobile: faker.image.url(),
  loading: faker.image.url()
})

const gotoPlatformListPage = async (page) => {
  await page.goto("/merchant/brands", { waitUntil: "networkidle" })
}
