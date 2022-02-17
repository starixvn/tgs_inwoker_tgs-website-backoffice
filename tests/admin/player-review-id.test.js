import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import { gotoPlayerListPage, searchPlayer } from "./player-list-page.js"

const test = base.extend(Fixture)

test.skip("review player id", async ({
  page,
  platformCode,
  platformToken,
  player,
  operatorApi
}) => {
  await Promise.all([
    operatorApi.player.uploadIdentity(platformToken, player.token),
    gotoPlayerListPage(page, platformCode)
  ])

  //TODO: 2. open verify dialog
  let ReviewDialogSelector = "review-player-id-dialog"
  await openDialog(page, ReviewDialogSelector)
  //TODO: 3. submit form to server
  //TODO: 4. close verify dialog
  //TODO: 5.
})
