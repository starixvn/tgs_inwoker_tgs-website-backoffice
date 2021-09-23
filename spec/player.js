import fetch from "node-fetch"
import faker from "faker"
import { globalApi, operatorApi } from "./env"

export const DefaultPassword = "TgsP@ssw0rd"

export const DefaultCurrencyCode = "CNY"

export const register = async ({
  username = `${faker.internet.userName()}-${new Date().getTime()}`,
  currency = DefaultCurrencyCode,
  pwd = DefaultPassword,
  confirmpwd = DefaultPassword,
  invitationcode = "",
  testplayer = false
}) => {
  let payload = {
    username,
    currency,
    pwd,
    confirmpwd,
    invitationcode,
    testplayer
  }

  let url = `${operatorApi()}/player/create`
  let headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  }

  let response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers
  })

  let result = await response.json()
  return result
}
