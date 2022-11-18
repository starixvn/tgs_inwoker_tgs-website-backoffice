import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import gameProvider from "../gameProvider/gameProvider.js"
import { random as randomIndex } from "lodash-es"

const API = "api/Game"

export const list = async (gameProviderId) => {
  if (!gameProviderId) {
    let gameProviderRecord = await gameProvider.random()
    gameProviderId = gameProviderRecord?.id
  }

  let response = await fetcher.get(
    `${host}/${API}?gameProviderId=${gameProviderId}`
  )

  let result = await response.json()
  if (!result.valid) {
    console.error("not able to list games", result)
    return null
  }

  let games = result?.items
  return games
}

export const random = async (gameProviderId) => {
  let games = await list(gameProviderId)

  let index = randomIndex(games.length - 1)
  return games?.[index]
}

export default {
  list,
  random
}
