import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { faker } from "@faker-js/faker"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import { gotoAgentListPage } from "./agent-list-page.js"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test("platform product fee", async ({ page, backofficeApi, platform }) => {
  await gotoAgentListPage(page, platform.code)

  let DialogSelector = `#product-fee-dialog`
  await Promise.all([
    page.waitForResponse(`api/BrandProductFee/${platform.id}`),
    openDialog(page, DialogSelector)
  ])

  let productFee = {
    cardGamePercentage: faker.number.int({ min: 1, max: 20 }),
    liveDealerPercentage: faker.number.int({ min: 1, max: 20 }),
    lotteryPercentage: faker.number.int({ min: 1, max: 20 }),
    slotPercentage: faker.number.int({ min: 1, max: 20 }),
    sportsPercentage: faker.number.int({ min: 1, max: 20 }),
    virtualSportsPercentage: faker.number.int({ min: 1, max: 20 })
  }

  const fields = Object.entries(productFee).map(([name, value]) => ({
    name,
    value
  }))

  for (const field of fields) {
    await page
      .locator(`${DialogSelector} input[name="${field.name}"]`)
      .fill(`${field.value}`)
  }

  await Promise.all([
    page.waitForResponse(`api/BrandProductFee`),
    page.locator(`${DialogSelector} button[type="submit"]`).click()
  ])

  let updated = await backofficeApi.platform.productFee.get(platform.id)
  expect(updated.cardGamePercentage).equals(productFee.cardGamePercentage)
  expect(updated.liveDealerPercentage).equals(productFee.liveDealerPercentage)
  expect(updated.lotteryPercentage).equals(productFee.lotteryPercentage)
  expect(updated.slotPercentage).equals(productFee.slotPercentage)
  expect(updated.virtualSportsPercentage).equals(
    productFee.virtualSportsPercentage
  )
})
