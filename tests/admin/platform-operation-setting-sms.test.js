import base from "@playwright/test"
import { expect } from "chai"
import { Fixture } from "./auth.js"
import { selectByLabel, selectByValue } from "../page/select.js"
import { selectPlatformByCode } from "../page/content.js"
import { faker } from "@faker-js/faker"
import { urlIncludes } from "../page/response.js"
import { openDialog } from "../page/dialog.js"

const test = base.extend(Fixture)

test("apply platform sms", async ({
  page,
  backofficeApi,
  smsPlatform,
  smsList
}) => {
  await gotoPlatformOperationSettingsPage(page, smsPlatform.code)

  let smsInfo = await backofficeApi.platform.sms.info(smsPlatform.id)
  let currentSmsCode = smsInfo?.smsVendorCode

  let sms = smsPlatform.smsList.find((item) => item.name != currentSmsCode)

  let DialogSelector = `#sms-provider-dialog`
  await openDialog(page, DialogSelector)

  await selectByLabel(
    page,
    `${DialogSelector} select[name="smsSettingId"]`,
    sms.name
  )

  await Promise.all([
    page.waitForResponse(
      urlIncludes(`api/brand/sms/apply/${smsPlatform.id}`),
      page.locator(`${DialogSelector} button[type="submit"]`).click()
    )
  ])

  smsInfo = await backofficeApi.platform.sms.info(smsPlatform.id)
  expect(smsInfo.smsVendorCode).equals(sms.name)
})

const gotoPlatformOperationSettingsPage = async (page, platformCode) => {
  await page.goto("/platform/imsettings", { waitUntil: "networkidle" })
  await selectPlatformByCode(page, platformCode)
}
