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
  await deletePlatformSms({ page, backofficeApi, platform, sms })
  await deleteSms({ page, backofficeApi, sms })
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

  const halfSecond = 500
  await page.waitForTimeout(halfSecond)

  let submitButton = page.locator(
    `${AddSmsDialogSelector} button[type="submit"]`
  )
  await submitButton.focus()

  await Promise.all([
    page.waitForResponse(urlIncludes(`api/sms`)),
    submitButton.click()
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

const applyPlatformSms = async ({ page, platform, sms }) => {
  let DialogSelector = `#platform-sms-dialog`
  await openDialog(page, DialogSelector)

  await page
    .locator(`${DialogSelector} input[name="enableSms"] + .bb-SwitchIcon`)
    .click()

  await selectByValue(
    page,
    `${DialogSelector} select[name="smsSettingId"]`,
    sms.smsSettingId
  )

  let [statusResponse, applyResponse] = await Promise.all([
    page.waitForResponse(urlIncludes(`api/brand/enable-sms/${platform.id}`)),
    page.waitForResponse(urlIncludes(`api/brand/sms/apply/${platform.id}`)),
    page.locator(`${DialogSelector} button[type="submit"]`).click()
  ])

  expect(statusResponse.ok()).to.be.true
  expect(applyResponse.ok()).to.be.true
}

const deletePlatformSms = async ({ page, backofficeApi, platform, sms }) => {
  let DialogSelector = `#delete-platform-sms-dialog`
  await openDialog(
    page,
    DialogSelector,
    `[data-row-id="${sms.smsSettingId}"] ${DialogSelector}-disclosure`
  )

  await Promise.all([
    page.waitForResponse(
      urlIncludes(`api/brand/sms/${platform.id}/${sms.smsSettingId}`)
    ),
    page.locator(`${DialogSelector} button[type="submit"]`).click()
  ])

  let platfromSmsList = await backofficeApi.platform.sms.list(platform.id)
  let deletedPlatformSms = platfromSmsList.find(
    (item) => item.smsSettingId === sms.smsSettingId
  )
  expect(deletedPlatformSms).to.be.undefined
}

const deleteSms = async ({ page, backofficeApi, sms }) => {
  console.warn("TODO: delete Sms")
}
