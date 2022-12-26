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

test("view player wagering requirement list", async ({
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

  //TODO: test player balance change with wagering requirement
  // let playerBucketAmount = await backofficeApi.player.bucket.amount(player.code)

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

  let bucketHistory = await backofficeApi.player.bucket.firstHistory(
    player.code
  )

  let WageringRequirementDialogSelector = `#wagering-requirement-dialog`
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/player/bucket/${player.code}`) &&
        response.status() === 200
      )
    }),
    openDialog(page, WageringRequirementDialogSelector)
  ])

  let wageringRequirementLocator = page.locator(
    `${WageringRequirementDialogSelector} table#wagering-requirement [data-column-id="wageringRequirement"]`
  )

  let wageringRequirementString = await wageringRequirementLocator.textContent()
  let wageringRequirement = numeral(wageringRequirementString).value()
  expect(wageringRequirement).to.equals(ExpectedWageringRequirementAmount)

  console.log("TODO: test completed wagering detail?")
})
