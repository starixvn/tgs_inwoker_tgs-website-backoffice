import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { format } from "date-fns"
import { fillDatePicker } from "../fill.js"
import { selectByValue, selectByLabel } from "../page/select.js"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import { faker } from "@faker-js/faker"

const test = base.extend(Fixture)

test("settle game round", async ({
  page,
  player,
  backofficeApi,
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

  await gotoGameOpenRoundPage(page)
  await settleGameRoundBy(page, externalRoundId, sboGameProvider, OpenRound)

  await gotoGameResettleOpenedRoundPage(page)
  await settleGameRoundBy(
    page,
    externalRoundId,
    sboGameProvider,
    ResettleOpenedRound
  )
})

const OpenRound = "OpenRound"
const ResettleOpenedRound = "Resettle"

const isSettleOpenRound = (type) => type === OpenRound

const settleGameRoundBy = async (
  page,
  externalRoundId,
  sboGameProvider,
  type = Settle.OpenRound
) => {
  await page.fill(`input[name="externalRoundId"]`, externalRoundId)
  // await selectByLabel(page, `select[name="gameProviderId"]`, "SBOBET")
  await selectByValue(page, `select[name="gameProviderId"]`, sboGameProvider.id)
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`externalRoundId=${externalRoundId}`) &&
        response.status() === 200
      )
    }),
    page.click(`button[type="submit"]`)
  ])

  let DialogSelector = `#settle-game-round-dialog`
  await openDialog(page, DialogSelector)

  let round = {
    externalClosedOn: format(new Date(), "yyyy/MM/dd"),
    validBetAmount: 0,
    settleAmount: 0,
    commission: 0,
    turnover: 0,
    winLoss: 0,
    clientRoundStatus: "Win", // Win, Loss, Draw, or Void
    adjustAmount: 0,
    remark: faker.lorem.word()
  }

  await fillDatePicker({
    page,
    selector: `${DialogSelector} .react-datepicker-wrapper input`,
    value: round.externalClosedOn
  })

  await page.fill(
    `${DialogSelector} input[name="validBetAmount"]`,
    `${round.validBetAmount}`
  )

  await page.fill(
    `${DialogSelector} input[name="settleAmount"]`,
    `${round.settleAmount}`
  )

  await page.fill(
    `${DialogSelector} input[name="commission"]`,
    `${round.commission}`
  )

  await page.fill(
    `${DialogSelector} input[name="turnover"]`,
    `${round.turnover}`
  )

  await page.fill(`${DialogSelector} input[name="winLoss"]`, `${round.winLoss}`)

  await selectByValue(
    page,
    `${DialogSelector} select[name="clientRoundStatus"]`,
    round.clientRoundStatus
  )

  await page.fill(
    `${DialogSelector} input[name="adjustAmount"]`,
    `${round.adjustAmount}`
  )

  await page.fill(`${DialogSelector} [name="remark"]`, round.remark)

  await page.click(`${DialogSelector} button[data-type="confirm"]`)

  let expectedUrl = isSettleOpenRound(type)
    ? "/closegameround"
    : "/adjustclosedround"

  let [settleResponse] = await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().toLowerCase().endsWith(expectedUrl) &&
        response.status() === 200
      )
    }),
    page.click(`#confirm-dialog button[type="submit"]`)
  ])
  let result = await settleResponse.json()

  expect(result.valid).to.be.true
  return result
}

const gotoGameOpenRoundPage = async (page) => {
  await page.goto("/systemadmin/gameround", { waitUntil: "networkidle" })
}

const gotoGameResettleOpenedRoundPage = async (page) => {
  await page.goto("/systemadmin/resettlegameround", {
    waitUntil: "networkidle"
  })
}
