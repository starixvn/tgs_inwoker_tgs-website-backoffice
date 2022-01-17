import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import numeral from "numeral"
import { selectRandomPlatform } from "../page/content.js"

const test = base.extend(Fixture)

test.skip("platform game provider report", async ({
  page,
  player,
  backofficeApi,
  sboGameProviderApi
}) => {
  await page.goto("/report/gameproviderreport", { waitUntil: "networkidle" })
  let brandId = await selectRandomPlatform(page)
  let walletAmount = 100
  let addBalanceResult = await backofficeApi.player.addBalance(player.code, {
    amount: walletAmount
  })

  let betAmount = 10
  let winBetResult = await sboGameProviderApi.placeWinBet({
    amount: betAmount,
    playerCode: player.code
  })

  let loseBetResult = await sboGameProviderApi.placeLoseBet({
    amount: betAmount,
    playerCode: player.code
  })

  let tieBetResult = await sboGameProviderApi.placeTieBet({
    amount: betAmount,
    playerCode: player.code
  })
})
