import fetcher from "../fetcher.js"
import { host } from "./host.js"
import { prefix } from "./api.js"
import { nanoid } from "nanoid"
import { formatISO } from "date-fns"
import { random } from "lodash-es"

export const aggregateRound = async () => {
  let url = `${host}${prefix}/RoundAggregate`

  let result = await fetcher(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  })

  return result
}
