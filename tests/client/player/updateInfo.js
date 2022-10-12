import { fetcher } from "../fetcher.js"
import { host } from "../host.js"

const API = "api/player"

export const getPlayer = async (playerCode) => {
  let response = await fetcher.get(`${host}/${API}/${playerCode}`, {
    failOnStatusCode: true
  })
  let result = await response.json()
  return result.player
}

export const updateInfo = async (playerCode, formData) => {
  let player = await getPlayer(playerCode)

  let response = await fetcher.put(`${host}/${API}/${playerCode}/info`, {
    data: { ...player, ...formData },
    failOnStatusCode: true
  })
  return await response.json()
}
