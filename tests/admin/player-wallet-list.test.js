import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import numeral from "numeral"
import {
  gotoPlayerListPage,
  searchPlayer,
} from "./player-list-page.js"

const test = base.extend(Fixture)

const SecondInMilliseconds = 1000

test("view player wallet list", async ({
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

  const PlayerWalletBalanceDialogSelector = "#player-wallet-balance-dialog"
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
    openDialog(page, PlayerWalletBalanceDialogSelector)
  ])

  let MainWalletSelector = `${PlayerWalletBalanceDialogSelector} #main-wallet`
  let mainWalletString = await page.textContent(MainWalletSelector)
  let mainWallet = numeral(mainWalletString).value()
  expect(mainWallet).to.equal(ExpectedWalletAmount)
})
