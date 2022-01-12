import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { format } from "date-fns"
import { fillDatePicker } from "../fill.js"
import { selectByValue } from "../page/select.js"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import faker from "faker"

const test = base.extend(Fixture)
const { lorem, phone, datatype, image, finance, internet, commerce } = faker

test("settle game round", async ({
  page,
  player,
  backofficeApi,
  sboGameProviderApi
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
  await closeGameRoundBy(page, externalRoundId)

  await gotoGameResettleOpenedRoundPage(page)
  console.warn("TODO: resettle opened round")
  // await closeGameRoundBy(page, externalRoundId)
})

const closeGameRoundBy = async (page, externalRoundId) => {
  await page.fill(`input[name="externalRoundId"]`, externalRoundId)

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
    remark: lorem.word()
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

  await page.fill(`${DialogSelector} [name="remark"]`, round.remark)

  await page.click(`${DialogSelector} button[data-type="confirm"]`)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().toLowerCase().endsWith("/closegameround") &&
        response.status() === 200
      )
    }),
    page.click(`#confirm-dialog button[type="submit"]`)
  ])
}

const gotoGameOpenRoundPage = async (page) => {
  await page.goto("/systemadmin/gameround", { waitUntil: "networkidle" })
}

const gotoGameResettleOpenedRoundPage = async (page) => {
  await page.goto("/systemadmin/resettlegameround", {
    waitUntil: "networkidle"
  })
}
