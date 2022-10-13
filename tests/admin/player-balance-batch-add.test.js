import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { random } from "lodash-es"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import { searchPlayer } from "./player-list-page.js"

const test = base.extend(Fixture)

test("batch add player balance", async ({ page, player, platformCode }) => {
  await gotoPlayerBalanceAdjustmentPage(page, platformCode)

  //TOOD:
  // 1. open dialog
  // 2. select type
  // 3. gen excel file
  // 4. upload excel file
  // 5. submit
  // 6. compare with get player balance api
})

const gotoPlayerBalanceAdjustmentPage = async (page, platformCode) => {
  await page.goto("/playermanagement/balanceadjustment", {
    waitUntil: "networkidle"
  })
  return await selectPlatformByCode(page, platformCode)
}
