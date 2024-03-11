import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectRandomPlatform, selectPlatformByCode } from "../page/content.js"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

console.warn("use LIVE_CHAT_DEL platform to test")
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

  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/BrandLiveChat/${brandId}`)),
    page.click(`${DeleteDialogSelector} button[type="submit"]`)
  ])
}

const gotoPlatformCustomerServicePage = async (page, code) => {
  await page.goto("/platform/imsettings", { waitUntil: "networkidle" })
  return await selectPlatformByCode(page, code)
}
