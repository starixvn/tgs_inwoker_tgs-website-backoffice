import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { format } from "date-fns"
import { fillDatePicker } from "../fill.js"
import { selectByValue, selectByLabel } from "../page/select.js"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test("platform report game open round", async ({
  page,
  player,
  backofficeApi,
  platform,
  sboGameProviderApi,
  sboGameProvider
}) => {
  let walletAmount = 100
  await backofficeApi.player.addBalance(player.code, {
    amount: walletAmount
  })

  let amount = 10
  let { externalRoundId, ...result } = await sboGameProviderApi.placeBet({
    amount,
    playerCode: player.code
  })

  await gotoOpenRoundPage(page)
  await selectPlatformByCode(page, platform.code)

  await findOpenRound(page, externalRoundId, sboGameProvider)

  let externalId = await page
    .locator(`table tbody tr td[data-column-id="externalRoundId"] span`)
    .textContent()
  expect(externalId).to.equals(externalRoundId)
})

const findOpenRound = async (page, externalRoundId, sboGameProvider) => {
  await page.fill(`input[name="externalRoundId"]`, externalRoundId)
  await selectByValue(page, `select[name="gameProviderId"]`, sboGameProvider.id)
  await Promise.all([
    page.waitForResponse(urlIncludes(`externalRoundId=${externalRoundId}`)),
    page.click(`button[type="submit"]`)
  ])
}

const gotoOpenRoundPage = async (page) => {
  await page.goto("/report/openround", { waitUntil: "networkidle" })
}
