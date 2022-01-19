import { fetcher } from "../fetcher.js"
import { host } from "../host.js"

const API = "api/Round"
export const settleOpenRound = async (roundId, data) => {
  let response = await fetcher.put(`${host}/${API}/${roundId}/CloseGameRound`, {
    data,
    failOnStatusCode: true
  })
  return await response.json()
}
