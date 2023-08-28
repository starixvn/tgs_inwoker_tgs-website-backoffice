import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import {
  ViewPlayerDialogSelector,
  gotoPlayerListPage,
  searchPlayer
} from "./player-list-page.js"
import numeral from "numeral"

const test = base.extend(Fixture)

test.skip("view player bucket list", async ({
  page,
  platform,
  player,
  backofficeApi
}) => {
  console.log("player.code", player.code)
  let walletAmount = 100
  let ExpectedWageringRequirementAmount = 100
  await Promise.all([
    gotoPlayerListPage(page, platform.code),
    backofficeApi.player.addBalance(player.code, {
      amount: walletAmount,
      bucketAmount: ExpectedWageringRequirementAmount
    })
  ])

  await searchPlayer(page, player)

  await openDialog(page, ViewPlayerDialogSelector)

  let WaitSecond = 1000

  //Note. wait for backend api to write data into db for search
  let playerBucketList
  let MaxRetry = 5
  let retryCount = 0
  while (
    (!playerBucketList || playerBucketList.length === 0) &&
    retryCount++ < MaxRetry
  ) {
    playerBucketList = await backofficeApi.player.bucket.list(player.code)
    await page.waitForTimeout(WaitSecond)
  }

  playerBucketList = await backofficeApi.player.bucket.list(player.code)

  let BucketListDialogSelector = `#bucket-list-dialog`
  await Promise.all([
    /*
    TODO
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/player/bucket/${player.code}`) &&
        response.status() === 200
      )
    }),
    */
    openDialog(page, BucketListDialogSelector)
  ])

  /*
  TODO: check amount?
  let wageringRequirementLocator = page.locator(
    `${WageringRequirementDialogSelector} table#bucket-list [data-column-id="wageringRequirement"]`
  )

  let wageringRequirementString = await wageringRequirementLocator.textContent()
  let wageringRequirement = numeral(wageringRequirementString).value()
  expect(wageringRequirement).to.equals(ExpectedWageringRequirementAmount)
  */

  let BucketItemsDialogSelector = `#bucket-items-dialog`
  openDialog(
    page,
    BucketItemsDialogSelector,
    `[data-type="Main"]${BucketItemsDialogSelector}-disclosure`
  )
  //TODO: check amount

  let bucketHistory = await backofficeApi.player.bucket.firstHistory(
    player.code
  )

  let BucketHistoryDialogSelector = `#bucket-history-dialog`
  await Promise.all([
    /*
    TODO
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/player/bucket/history/`) &&
        response.status() === 200
      )
    }),
    */
    openDialog(page, BucketHistoryDialogSelector)
  ])
  /*
  TODO

  let changeAmountLocator = page.locator(
    `${BucketHistoryDialogSelector} table#bucket-history [data-column-id="changeAmount"]`
  )
  let changeAmountString = await changeAmountLocator.textContent()
  let changeAmount = numeral(changeAmountString).value()
  expect(changeAmount).to.equals(ExpectedWageringRequirementAmount)

  let type = await page
    .locator(
      `${BucketHistoryDialogSelector} table#bucket-history [data-column-id="type"] > span`
    )
    .getAttribute("data-type")

  expect(type).to.equals("Create")
  */
})
