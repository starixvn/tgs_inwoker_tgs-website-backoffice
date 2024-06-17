import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { faker } from "@faker-js/faker"
import { openDialog } from "../page/dialog.js"
import { urlIncludes } from "../page/response.js"
import { selectByValue } from "../page/select.js"

const test = base.extend(Fixture)

test("system admin sms settings", async ({
  page,
  backofficeApi,
  adminSmsPlatform: platform
}) => {
  await page.goto("/systemadmin/sms", { waitUntil: "networkidle" })

  await searchPlatfromSmsList({ page, platform })

  let sms = await addSms({ page, backofficeApi, platform })

  await addPlatformSms({ page, backofficeApi, platform, sms })
  await applyPlatformSms({ page, backofficeApi, platform, sms })
})

const searchPlatfromSmsList = async ({ page, platform }) => {
  await selectByValue(page, `select[name="brandId"]`, platform.id)

  await Promise.all([
    page.waitForResponse(urlIncludes(`api/brand/sms/options/${platform.id}`)),
    page.locator(`button[type="submit"]`).click()
  ])
}

const addSms = async ({ page, backofficeApi }) => {
  let code = `${faker.string.alpha(1)}${faker.string.alphanumeric(
    5
  )}`.toUpperCase()
  let name = code
  let setting = JSON.stringify({
    a: faker.number.int(100)
  })

  let SmsListDialogSelector = `#sms-list-dialog`
  await openDialog(page, SmsListDialogSelector)

  let AddSmsDialogSelector = `#add-sms-dialog`
  await openDialog(page, AddSmsDialogSelector)

  await page.locator(`${AddSmsDialogSelector} input[name="name"]`).fill(name)
  await page.locator(`${AddSmsDialogSelector} input[name="code"]`).fill(code)

  await page.click(
    `${AddSmsDialogSelector} .monaco-editor .monaco-mouse-cursor-text`
  )
  await page.keyboard.press("Control+A")
  await page.keyboard.press("Backspace")
  await page.keyboard.type(setting)

  await Promise.all([
    page.waitForResponse(urlIncludes(`api/sms`)),
    page.locator(`${AddSmsDialogSelector} button[type="submit"]`).click()
  ])

  let smsList = await backofficeApi.system.admin.sms.list()
  let sms = smsList.find((item) => item.name === name)
  expect(sms.smsSettingId).not.empty

  await page.locator(`${SmsListDialogSelector} .bb-DialogClose`).click()
  return sms
}

const addPlatformSms = async ({ page, backofficeApi, platform, sms }) => {
  let DialogSelector = `#add-platform-sms-dialog`

  await Promise.all([
    page.waitForResponse(urlIncludes(`api/sms`)),
    page.waitForResponse(urlIncludes(`api/brand/sms/options/${platform.id}`)),
    openDialog(page, DialogSelector)
  ])

  await selectByValue(
    page,
    `${DialogSelector} select[name="smsSettingId"]`,
    sms.smsSettingId
  )

  await Promise.all([
    page.waitForResponse(urlIncludes(`api/brand/sms/${platform.id}`)),
    page.locator(`${DialogSelector} button[type="submit"]`).click()
  ])

  let platformSmsList = await backofficeApi.platform.sms.list(platform.id)
  let platformSms = platformSmsList.find(
    (item) => item.smsSettingId === sms.smsSettingId
  )
  expect(platformSms).not.empty
}

const applyPlatformSms = async ({ page, backofficeApi, platform, sms }) => {
  console.warn("TODO: system admin sms > apply platform sms")
}
