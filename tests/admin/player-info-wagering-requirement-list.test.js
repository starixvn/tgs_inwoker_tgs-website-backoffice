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
  platformCode,
  player,
  backofficeApi,
  sboGameProviderApi,
  reportAggregateApi
}) => {
  let walletAmount = 100
  let ExpectedWageringRequirementAmount = 100
  await Promise.all([
    gotoPlayerListPage(page, platformCode),
    backofficeApi.player.addBalance(player.code, {
      amount: walletAmount,
      bucketAmount: ExpectedWageringRequirementAmount
    })
  ])

  let BetAmount = 10
  let [betResult] = await Promise.all([
    sboGameProviderApi.placeLoseBet({
      amount: BetAmount,
      playerCode: player.code
    }),
    searchPlayer(page, player)
  ])

  await reportAggregateApi.aggregateRound()
  await reportAggregateApi.aggregatePlayer()

  await openDialog(page, ViewPlayerDialogSelector)

  let WageringRequirementDialogSelector = `#wagering-requirement-dialog`
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/player/${player.code}/playerBuckets`) &&
        response.status() === 200
      )
    }),
    openDialog(page, WageringRequirementDialogSelector)
  ])

  let wageringRequirementLocator = page.locator(
    `${WageringRequirementDialogSelector} [data-column-id="wageringRequirement"]`
  )
  let wageringRequirementString = await wageringRequirementLocator.textContent()
  let wageringRequirement = numeral(wageringRequirementString).value()
  expect(wageringRequirement).to.equals(ExpectedWageringRequirementAmount)

  //TODO: how to test completed wagering
})
