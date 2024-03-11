import { fetcher } from "../fetcher.js"
import { host } from "../host.js"

const API = "api/player"

export const upgradeToAgent = async (playerCode) => {
  let response = await fetcher.post(
    `${host}/${API}/upgrade/${playerCode}/agent`
  )
}
