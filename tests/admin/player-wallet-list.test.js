import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import numeral from "numeral"
import {
  gotoPlayerListPage,
  searchPlayer,
  ViewPlayerDialogSelector
} from "./player-list-page.js"

const test = base.extend(Fixture)

const SecondInMilliseconds = 1000

console.warn("*** TODO: set timeout not work?")
test.skip("view player wallet list", async ({
  page,
  platformCode,
  player,
  backofficeApi
}) => {
  let ExpectedWalletAmount = 100
  await Promise.all([
    backofficeApi.player.addBalance(player.code, {
      amount: ExpectedWalletAmount
    }),
    gotoPlayerListPage(page, platformCode)
  ])

  await searchPlayer(page, player)
  await openDialog(page, ViewPlayerDialogSelector)

  let WalletTabSelector = `${ViewPlayerDialogSelector} button#wallet-list`
  await Promise.all([
    page.waitForResponse(
      (response) => {
        return (
          response
            .url()
            .includes(`/api/player/${player.code}/transferwallet`) &&
          response.status() === 200
        )
      },
      { timeout: 120 * SecondInMilliseconds }
    ),
    page.click(WalletTabSelector)
  ])

  let MainWalletSelector = `${ViewPlayerDialogSelector} #main-wallet`
  let mainWalletString = await page.textContent(MainWalletSelector)
  let mainWallet = numeral(mainWalletString).value()
  expect(mainWallet).to.equal(ExpectedWalletAmount)
})
