import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import { nanoid } from "nanoid"
import GameProvider from "../gameProvider/gameProvider.js"
import Game from "./game.js"
import { startOfDay } from "date-fns"

const API = "api/RoundReport"

export const add = async ({
  playerCode,
  externalRoundId = nanoid(),
  gameProviderId,
  gameId,
  externalCreatedOn = startOfDay(new Date()).toISOString(),
  externalClosedOn = startOfDay(new Date()).toISOString(),
  betAmount = 1,
  validBetAmount = 1,
  settleAmount = 1,
  commission = 1,
  turnover = 1,
  companyWinLoss = 1,
  clientRoundStatus = "Win",
  ...data
} = {}) => {
  if (!playerCode) {
    console.error("playerCode is required")
    return null
  }

  if (!gameProviderId) {
    let gameProvider = await GameProvider.random()
    gameProviderId = gameProvider.id
    gameId = await randomGameIdOf(gameProviderId)
  }

  if (!gameId) {
    gameId = randomGameIdOf(gameProviderId)
  }

  let formData = {
    playerCode,
    externalRoundId,
    gameProviderId,
    gameId,
    externalCreatedOn,
    externalClosedOn,
    betAmount,
    validBetAmount,
    settleAmount,
    commission,
    turnover,
    companyWinLoss,
    clientRoundStatus,
    ...data
  }
  let response = await fetcher.put(`${host}/${API}/system/addround`, {
    data: formData
  })

  if (!response.ok()) {
    console.error(
      "failed to add game round with url",
      url,
      "formData",
      formData
    )
    return null
  }

  return {
    ...formData
  }
  //http://localhost:3000/api/RoundReport/system/addround
}

const randomGameIdOf = async (gameProviderId) => {
  let game = await Game.random(gameProviderId)
  return game.id
}

export const findByExternalRoundId = async (externalRoundId) => {}

export default {
  add
}
