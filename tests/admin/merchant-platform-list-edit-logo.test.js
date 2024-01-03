import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { faker } from "@faker-js/faker"
import { openDialog } from "../page/dialog.js"
import { selectLicenseeById } from "../page/content.js"

const test = base.extend(Fixture)

test("add and edit platform, search platform", async ({ page, platform }) => {
  await gotoPlatformListPage(page, platform.licenseeId)

  let record = await editLogo(page)
  await editLogo(page, record)
})

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

const gotoPlatformListPage = async (page, licenseeId) => {
  await page.goto("/merchant/brands", { waitUntil: "networkidle" })
  await selectLicenseeById(page, licenseeId)
}
