import fetcher from "../fetcher.js"
import { host } from "./host.js"
import { prefix } from "./api.js"
import { nanoid } from "nanoid"
import { formatISO, getHours, format } from "date-fns"
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

export const manualAggregateRound = async () => {
  //let url = `${host}${prefix}/RoundAggregate/manual`

  let now = new Date()
  let payload = {
    date: format(now, "yyyy-MM-dd"),
    hour: getHours(now)
  }
  let body = JSON.stringify(payload)

  let result = await fetcher(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body
  })

  return result
}
