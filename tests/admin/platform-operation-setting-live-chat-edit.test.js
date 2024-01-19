import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import { faker } from "@faker-js/faker"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test("edit platform live chat", async ({ page, licensee, backofficeApi }) => {
  let platform = await backofficeApi.platform.addPlatform({
    licenseeId: licensee.id
  })
  await backofficeApi.platform.liveChat.add({ brandId: platform.id })
  await gotoPlatformCustomerServicePage(page, platform.code)

  let EditDialogSelector = `#edit-live-chat-dialog`
  await openDialog(page, EditDialogSelector, `#live-chat-dialog-disclosure`)

  let expected = {
    string: `${faker.lorem.word()}-${Date.now()}`
  }
  let liveChat = {
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

  let liveChatSetting = await backofficeApi.platform.liveChat.get(platform.id)
  expect(liveChatSetting.name).to.equals(liveChat.name)
  expect(liveChatSetting.setting.string).to.equals(expected.string)
})

const gotoPlatformCustomerServicePage = async (page, code) => {
  await page.goto("/platform/imsettings", { waitUntil: "networkidle" })
  return await selectPlatformByCode(page, code)
}
