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
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

console.log("TODO: player bucket list")
test("view player bucket list", async ({
  page,
  platform,
  player,
  backofficeApi
}) => {
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
    page.waitForResponse((response) => {
      return (
        response
          .url()
          .includes(`/api/player/bucket/type/amount/${player.code}`) &&
        response.status() === 200
      )
    }),
    openDialog(page, BucketListDialogSelector)
  ])

  let mainBucketAmountLocator = page.locator(
    `${BucketListDialogSelector} table#bucket-list [data-column-id="amount"]`
  )

  let mainBucketAmountString = await mainBucketAmountLocator.textContent()
  let mainBucketAmount = numeral(mainBucketAmountString).value()
  expect(mainBucketAmount).to.equals(ExpectedWageringRequirementAmount)

  let BucketItemsDialogSelector = `#bucket-items-dialog`
  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/player/bucket/${player.code}`)),
    openDialog(page, BucketItemsDialogSelector)
  ])

  let wageringRequirementLocator = page.locator(
    `${BucketItemsDialogSelector} table#bucket-items [data-column-id="wageringRequirement"]`
  )

  let wageringRequirementString = await wageringRequirementLocator.textContent()
  let wageringRequirement = numeral(wageringRequirementString).value()
  expect(wageringRequirement).to.equals(ExpectedWageringRequirementAmount)

  let bucketHistory = await backofficeApi.player.bucket.firstHistory(
    player.code
  )

  let BucketHistoryDialogSelector = `#bucket-history-dialog`
  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/player/bucket/history/`)),
    openDialog(page, BucketHistoryDialogSelector)
  ])

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
})
