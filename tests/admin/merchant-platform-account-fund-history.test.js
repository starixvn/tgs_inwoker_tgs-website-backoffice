import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { faker } from "@faker-js/faker"
import { openDialog } from "../page/dialog.js"
import { selectPlatformByCode } from "../page/content.js"
import numeral from "numeral"

const test = base.extend(Fixture)

test("platform account fund > add", async ({
  page,
  platform,
  backofficeApi
}) => {
  await gotoPlatformAccountFundPage(page, platform.code)

  let DialogSelector = `#fund-history-dialog`
  let [response] = await Promise.all([
    page.waitForResponse((response) => {
      let url = response.url()
      let isApi = url.includes(`/api/brandgamecredit/${platform.id}/histories`)
      if (isApi && !response.ok()) {
        throw Error("credit api error")
      }

      return isApi
    }),
    openDialog(page, DialogSelector)
  ])

  let result = await response.json()
})

const gotoPlatformAccountFundPage = async (page, platformCode) => {
  await page.goto("/merchant/platformaccountfund", { waitUntil: "networkidle" })
  await selectPlatformByCode(page, platformCode)
}
