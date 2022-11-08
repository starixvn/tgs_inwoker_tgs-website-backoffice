import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectRandomPlatform, selectPlatformByCode } from "../page/content.js"

const test = base.extend(Fixture)

test("edit live chat", async ({ page, licensee, backofficeApi }) => {
  let platform = await backofficeApi.platform.addPlatform({
    licenseeId: licensee.id
  })
  await backofficeApi.platform.liveChat.add({ brandId: platform.id })
  await gotoPlatformCustomerServicePage(page, platform.code)

  await editLiveChat(page)
})

const SettingType = {
  Url: "url",
  Script: "script"
}

const editLiveChat = async (page) => {
  await page.click(`#live-chat-dialog-disclosure`)

  let EditDialogSelector = `#edit-live-chat-dialog`
  await page.waitForSelector(EditDialogSelector)

  let liveChat = {
    name: SettingType.Script,
    setting: JSON.stringify({
      script:
        "<script id='ze-snippet' src='https://static.zdassets.com/ekr/snippet.js?key=c10e2fdd-7e45-4974-be42-38fb9a1b5ed3'></script>"
    })
  }

  await page.fill(`${EditDialogSelector} input[name="name"]`, liveChat.name)
  await page.click(
    `${EditDialogSelector} .monaco-editor .monaco-mouse-cursor-text`
  )
  await page.keyboard.press("Control+A")
  await page.keyboard.press("Backspace")
  await page.keyboard.type(liveChat.setting)

  let brandId = await page.inputValue(
    `${EditDialogSelector} input[name="brandId"]`
  )
  expect(brandId).to.not.be.empty

  let expectedUrl = `/api/BrandLiveChat/${brandId}`
  await Promise.all([
    page.waitForResponse((response) => {
      return response.url().endsWith(expectedUrl) && response.status() === 200
    }),
    page.click(`${EditDialogSelector} button[type="submit"]`)
  ])

  return liveChat
}

const gotoPlatformCustomerServicePage = async (page, code) => {
  await page.goto("/platform/imsettings", { waitUntil: "networkidle" })
  return await selectPlatformByCode(page, code)
}
