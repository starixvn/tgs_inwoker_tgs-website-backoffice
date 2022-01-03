import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { goto } from "../sidebar.js"
import { selectRandomOption } from "../page/select.js"
import { selectRandomPlatform } from "../page/content.js"

const test = base.extend(Fixture)

test("add, edit and remove live chat provider", async ({ page }) => {
  let brandId = await gotoPlatformCustomerServicePage(page)

  let expectedUrl = `/api/BrandLiveChat/${brandId}`
  let brandLiveChatResponse = await page.waitForResponse((response) => {
    return response.url().endsWith(expectedUrl) && response.status() === 200
  })
  let brandLiveChatSetting = await brandLiveChatResponse.json()
  let hasSetting = !!(brandLiveChatSetting && brandLiveChatSetting.data)
  console.log("hasLiveChatSetting", hasSetting)
  if (hasSetting) {
    await deleteLiveChat(page)
  }

  await addLiveChat(page)
  await editLiveChat(page)
  await deleteLiveChat(page)
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

const hasLiveChat = async (page) => {
  return page.isVisible(`#delete-live-chat-dialog-disclosure`)
}

const gotoPlatformCustomerServicePage = async (page) => {
  await goto({ page, value: "/platform/imsettings" })
  return await selectRandomPlatform(page)
}
