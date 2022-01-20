import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import { startOfToday, endOfToday, formatISO } from "date-fns"

const API = "api/Round"
export const findOpenRound = async ({
  externalRoundId,
  start = startOfToday(),
  to = endOfToday()
}) => {
  let url = `${host}/${API}/openRounds?from=${start.toISOString()}&to=${to.toISOString()}&externalRoundId=${externalRoundId}&page=1&rows=1`

  let response = await fetcher.get(url, {
    failOnStatusCode: true
  })

  let result = await response.json()
  return result.items[0]
}

export const findOpenRoundId = async (params) => {
  let round = await findOpenRound(params)
  return round && round.id
}
