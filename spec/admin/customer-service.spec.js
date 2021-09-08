import { chromium } from "playwright"
import { expect } from "chai"
import { StorageState } from "../auth"
import { host, headless } from "../env"
import { random } from "lodash"
import numeral from "numeral"
import { startOfDay, endOfTomorrow, format } from "date-fns"
import { lorem, phone, datatype } from "faker"
import clone from "clone-deep"
import { fillDatePicker } from "../fill"
import { goto } from "../sidebar"
import platform from "../platform"
import select from "../select"

let browser
let context
let page

describe("Admin user", () => {
  before(async () => {
    browser = await chromium.launch({ headless: headless() })
    context = await browser.newContext({ storageState: StorageState.Admin })
  })

  beforeEach(async () => {
    page = await context.newPage()

    await page.goto(host(), {
      waitUntil: "networkidle0"
    })

    await gotoPlatformCustomerServicePage()
  })

  afterEach(async () => {
    await page.close()
  })

  after(async () => {
    await browser.close()
  })

  it("should able to add, edit and remove instant messaging", async () => {
    await page.click("#instant-messaging-dialog-disclosure")

    await addInstantMessaging()
    await editInstantMessaging()
    await deleteInstantMessaging()
  })

  it("should able to add, edit and remove live chat provider", async () => {
    let hasSetting = await hasLiveChat()
    if (hasSetting) {
      await deleteLiveChat()
    }

    await addLiveChat()
    await editLiveChat()
    await deleteLiveChat()
  })

  const addInstantMessaging = async () => {
    let AddDialogSelector = `#add-instant-messaging-dialog`
    await page.click(`${AddDialogSelector}-disclosure`)
    await page.waitForSelector(AddDialogSelector)

    let options = await getTypeOptions()
    let type = await select.randomOption({
      page,
      selectSelector: `${AddDialogSelector} ${InstantMessagingSelectSelector}`,
      options
    })

    let instantMessaging = {
      type,
      phone: phone.phoneNumber(),
      appId: datatype.uuid()
    }

    await page.fill(
      `${AddDialogSelector} input[name="phone"]`,
      instantMessaging.phone
    )
    await page.fill(
      `${AddDialogSelector} input[name="appId"]`,
      instantMessaging.appId
    )

    await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().endsWith(`/api/BrandCommunication`) &&
          response.status() === 200
        )
      }),
      page.click(`${AddDialogSelector} button[type="submit"]`)
    ])
  }

  const editInstantMessaging = async () => {
    let EditDialogSelector = `#edit-instant-messaging-dialog`
    await page.click(`${EditDialogSelector}-disclosure`)
    await page.waitForSelector(EditDialogSelector)

    let options = await getTypeOptions()
    let type = await select.randomOption({
      page,
      selectSelector: `${EditDialogSelector} ${InstantMessagingSelectSelector}`,
      options
    })

    let instantMessaging = {
      type,
      phone: phone.phoneNumber(),
      appId: datatype.uuid()
    }

    await page.fill(
      `${EditDialogSelector} input[name="phone"]`,
      instantMessaging.phone
    )
    await page.fill(
      `${EditDialogSelector} input[name="appId"]`,
      instantMessaging.appId
    )

    let id = await page.inputValue(`${EditDialogSelector} input[name="id"]`)
    let expectedUrl = `/api/BrandCommunication/${id}`

    await Promise.all([
      page.waitForResponse((response) => {
        return response.url().endsWith(expectedUrl) && response.status() === 200
      }),
      page.click(`${EditDialogSelector} button[type="submit"]`)
    ])
  }

  const deleteInstantMessaging = async () => {
    let DeleteDialogSelector = `#delete-instant-messaging-dialog`
    await page.click(`${DeleteDialogSelector}-disclosure`)
    await page.waitForSelector(DeleteDialogSelector)

    let id = await page.inputValue(`${DeleteDialogSelector} input[name="id"]`)
    let expectedUrl = `/api/BrandCommunication/${id}`

    await Promise.all([
      page.waitForResponse((response) => {
        return response.url().endsWith(expectedUrl) && response.status() === 200
      }),
      page.click(`${DeleteDialogSelector} button[type="submit"]`)
    ])
  }

  let InstantMessagingSelectSelector = `select[name="type"]`
  const getTypeOptions = async (
    selectSelector = InstantMessagingSelectSelector
  ) => select.optionValue.allExceptFirst({ page, selectSelector })

  const SettingType = {
    Url: "url",
    Script: "script"
  }

  const addLiveChat = async () => {
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

    let expectedUrl = `/api/BrandLiveChat`
    await Promise.all([
      page.waitForResponse((response) => {
        return response.url().endsWith(expectedUrl) && response.status() === 200
      }),
      page.click(`${AddDialogSelector} button[type="submit"]`)
    ])

    return liveChat
  }

  const editLiveChat = async () => {
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

  const deleteLiveChat = async () => {
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

  const hasLiveChat = async () => {
    return page.isVisible(`#delete-live-chat-dialog-disclosure`)
  }

  const gotoPlatformCustomerServicePage = async () => {
    await goto({ page, value: "/platform/imsettings" })
    await platform.selectFirst({ page })
  }
})
