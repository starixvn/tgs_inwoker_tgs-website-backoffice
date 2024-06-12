import base from "@playwright/test"
import { expect } from "chai"
import { Fixture } from "./auth.js"
import { selectByValue } from "../page/select.js"
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

  console.warn("TODO: apply platform sms")
})

const gotoPlatformOperationSettingsPage = async (page, platformCode) => {
  await page.goto("/platform/imsettings", { waitUntil: "networkidle" })
  await selectPlatformByCode(page, platformCode)
}
