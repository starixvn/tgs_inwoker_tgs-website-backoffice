import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import { getPlayer } from "./getPlayer.js"

const API = "api/player"

export const updateContact = async (playerCode, formData) => {
  let player = await getPlayer(playerCode)

  let response = await fetcher.put(`${host}/${API}/${playerCode}/contact`, {
    data: { ...player, ...formData },
    failOnStatusCode: true
  })
  return await response.json()
}
