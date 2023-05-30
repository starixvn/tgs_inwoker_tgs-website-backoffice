import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import { gotoPlayerListPage, searchPlayer } from "./player-list-page.js"
import numeral from "numeral"

const test = base.extend(Fixture)

test("clear player wagering requirement", async ({
  page,
  platform,
  player,
  backofficeApi
}) => {
  let ExpectedWageringRequirementAmount = 100
  await Promise.all([
    gotoPlayerListPage(page, platform.code),
    backofficeApi.player.addBalance(player.code, {
      bucketAmount: ExpectedWageringRequirementAmount
    })
  ])

  await searchPlayer(page, player)

  let EditPlayerDialogSelector = `#edit-player-dialog`
  await openDialog(page, EditPlayerDialogSelector)

  let ClearWageringRequirementDialogSelector = `#clear-player-wagering-requirement-dialog`
  await openDialog(page, ClearWageringRequirementDialogSelector)

  await Promise.all([
    page
      .locator(`${ClearWageringRequirementDialogSelector}[role="dialog"]`)
      .waitFor({ state: "detached" }),
    page.click(
      `${ClearWageringRequirementDialogSelector} button[type="submit"]`
    )
  ])
})
