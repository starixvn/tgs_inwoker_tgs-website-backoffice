import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import { faker } from "@faker-js/faker"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

console.warn("use LIVE_CHAT_EDIT platform to test")
test("edit platform live chat", async ({
  page,
  platform,
  licensee,
  backofficeApi
}) => {
  let [liveChat] = await Promise.all([
    backofficeApi.platform.liveChat.get(platform.id),
    gotoPlatformCustomerServicePage(page, platform.code)
  ])
  if (liveChat) {
    await backofficeApi.platform.liveChat.deleteByPlatformId(platform.id)
  }

  await backofficeApi.platform.liveChat.add({ brandId: platform.id })

  let EditDialogSelector = `#edit-live-chat-dialog`
  await openDialog(page, EditDialogSelector, `#live-chat-dialog-disclosure`)

  let expected = {
    string: `${faker.lorem.word()}-${Date.now()}`
  }
  liveChat = {
    name: faker.lorem.word(),
    setting: JSON.stringify(expected)
  }

  await page.fill(`${EditDialogSelector} input[name="name"]`, liveChat.name)
  await page.click(
    `${EditDialogSelector} .monaco-editor .monaco-mouse-cursor-text`
  )
  await page.keyboard.press("Control+A")
  await page.keyboard.press("Backspace")
  await page.keyboard.type(liveChat.setting)

  const halfSecond = 500
  await page.waitForTimeout(halfSecond)

  let submitButtonSelector = `${EditDialogSelector} button[type="submit"]`
  await page.focus(submitButtonSelector)

  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/BrandLiveChat/${platform.id}`)),
    page.click(submitButtonSelector)
  ])

  let setting = await backofficeApi.platform.liveChat.get(platform.id)
  expect(setting.name).to.equals(liveChat.name)
  expect(setting.setting.string).to.equals(expected.string)
})

const gotoPlatformCustomerServicePage = async (page, code) => {
  await page.goto("/platform/imsettings", { waitUntil: "networkidle" })
  return await selectPlatformByCode(page, code)
}
