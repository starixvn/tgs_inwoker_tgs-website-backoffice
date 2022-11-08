import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"

const test = base.extend(Fixture)

test("add live chat", async ({ page, licensee, backofficeApi }) => {
  let platform = await backofficeApi.platform.addPlatform({
    licenseeId: licensee.id
  })
  await gotoPlatformCustomerServicePage(page, platform.code)

  await addLiveChat(page)
  await backofficeApi.platform.liveChat.deleteByPlatformId(platform.id)
})

const SettingType = {
  Url: "url",
  Script: "script"
}

const addLiveChat = async (page) => {
  await page.click(`#live-chat-dialog-disclosure`)

  let AddDialogSelector = `#add-live-chat-dialog`
  await page.waitForSelector(AddDialogSelector)

  let liveChat = {
    name: SettingType.Url,
    setting: JSON.stringify({
      url: "https://direct.lc.chat/12646566/?website_id=c6b30737-09e4-468d-a001-7541371e82df&user_nickname=name"
    })
  }

  await page.fill(`${AddDialogSelector} input[name="name"]`, liveChat.name)
  await page.click(
    `${AddDialogSelector} .monaco-editor .monaco-mouse-cursor-text`
  )

  await page.keyboard.press("Control+A")
  await page.keyboard.press("Backspace")
  await page.keyboard.type(liveChat.setting)
  const halfSecond = 500
  await page.waitForTimeout(halfSecond)

  let submitButtonSelector = `${AddDialogSelector} button[type="submit"]`
  await page.focus(submitButtonSelector)

  let expectedUrl = `/api/BrandLiveChat`
  await Promise.all([
    page.waitForResponse((response) => {
      return response.url().endsWith(expectedUrl) && response.status() === 200
    }),
    page.click(submitButtonSelector)
  ])

  return liveChat
}

const gotoPlatformCustomerServicePage = async (page, code) => {
  await page.goto("/platform/imsettings", { waitUntil: "networkidle" })
  return await selectPlatformByCode(page, code)
}
