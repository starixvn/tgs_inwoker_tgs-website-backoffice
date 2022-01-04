import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { format } from "date-fns"
import { fillDatePicker } from "../fill.js"
import { goto } from "../sidebar.js"
import { selectByValue } from "../page/select.js"
import { selectPlatformByCode } from "../page/content.js"
import { placeBet } from "../sbo-game-provider.js"
import faker from "faker"

const test = base.extend(Fixture)
const { lorem, phone, datatype, image, finance, internet, commerce } = faker

test("close open round", async ({
  page,
  platformCode,
  player,
  backofficeApi
}) => {
  //TODO: player code shall get from op api result
  let playerCode = await getPlayerCode(page, platformCode, player.username)
  player.code = playerCode

  let walletAmount = 100

  await backofficeApi.player.addBalance(playerCode, {
    amount: walletAmount
  })

  let amount = 10
  let { externalRoundId, ...result } = await placeBet({
    amount,
    playerCode: player.code
  })

  await gotoGameRoundPage(page)

  await closeGameRoundBy(page, externalRoundId)

  //TODO: search player balance change record by filter = UnsettledBetManual
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

  let DialogSelector = `#close-game-open-round-dialog`
  await page.click(`${DialogSelector}-disclosure`)

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

const getPlayerCode = async (page, platformCode, username) => {
  await gotoPlayerListPage(page, platformCode)

  await page.fill(`input[name="username"]`, username)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`username=${username}`) &&
        response.status() === 200
      )
    }),
    page.click(`button[type="submit"]`)
  ])

  let playerCodeSelector = `table [data-column-id="playerCode"]`
  await page.waitForSelector(playerCodeSelector)
  let playerCode = await page.textContent(playerCodeSelector)
  return playerCode
}

const gotoPlayerListPage = async (page, platformCode) => {
  await goto({ page, value: "/playermanagement/playerlist" })
  await selectPlatformByCode(page, platformCode)
}

const gotoGameRoundPage = async (page) => {
  await goto({ page, value: "/systemadmin/gameround" })
}
