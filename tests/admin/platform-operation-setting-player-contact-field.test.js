import base from "@playwright/test"
import { expect } from "chai"
import { Fixture } from "./auth.js"
import { selectByLabel, selectByValue } from "../page/select.js"
import { selectPlatformByCode } from "../page/content.js"
import { faker } from "@faker-js/faker"
import { urlIncludes } from "../page/response.js"
import { openDialog } from "../page/dialog.js"

const test = base.extend(Fixture)

test("platform player contact field setting dialog", async ({
  page,
  backofficeApi,
  platform
}) => {
  await gotoPlatformOperationSettingsPage(page, platform.code)

  let DialogSelector = `#player-contact-field-dialog`
  await openDialog(page, DialogSelector)

  const MessengerField = "FacebookMessenger"
  let hasMessengerField = await page
    .locator(`${DialogSelector} [data-type="${MessengerField}"] > input`)
    .isChecked()

  await page
    .locator(`${DialogSelector} [data-type="${MessengerField}"] .bb-SwitchIcon`)
    .click()
  const ExpectedChecked = !hasMessengerField

  await Promise.all([
    page.waitForResponse(
      urlIncludes(`api/brand/player-contract/${platform.id}`),
      page.locator(`${DialogSelector} button[type="submit"]`).click()
    )
  ])

  let result = await backofficeApi.platform.playerContactField.has(
    platform.id,
    MessengerField
  )
  expect(result).equals(ExpectedChecked)
})

const gotoPlatformOperationSettingsPage = async (page, platformCode) => {
  await page.goto("/platform/imsettings", { waitUntil: "networkidle" })
  await selectPlatformByCode(page, platformCode)
}
