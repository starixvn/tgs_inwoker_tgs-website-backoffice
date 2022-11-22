import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectRandomPlatform, selectPlatformByCode } from "../page/content.js"

const test = base.extend(Fixture)

test("remove live chat", async ({ page, licensee, backofficeApi }) => {
  let platform = await backofficeApi.platform.addPlatform({
    licenseeId: licensee.id
  })
  await backofficeApi.platform.liveChat.add({ brandId: platform.id })
  await gotoPlatformCustomerServicePage(page, platform.code)

  await deleteLiveChat(page)
})

const deleteLiveChat = async (page) => {
  let DeleteDialogSelector = `#delete-live-chat-dialog`
  await page.click(`${DeleteDialogSelector}-disclosure`)
  await page.waitForSelector(DeleteDialogSelector)

  let brandId = await page.inputValue(
    `${DeleteDialogSelector} input[name="brandId"]`
  )
  expect(brandId).to.not.be.empty

  let expectedUrl = `/api/BrandLiveChat/${brandId}`
  await Promise.all([
    page.waitForResponse((response) => {
      return response.url().endsWith(expectedUrl) && response.status() === 200
    }),
    page.click(`${DeleteDialogSelector} button[type="submit"]`)
  ])
}

const gotoPlatformCustomerServicePage = async (page, code) => {
  await page.goto("/platform/imsettings", { waitUntil: "networkidle" })
  return await selectPlatformByCode(page, code)
}
