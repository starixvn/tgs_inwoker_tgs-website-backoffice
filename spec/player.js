import fetcher from "./fetcher"
import faker from "faker"
import { globalApi, operatorApi } from "./env"
// import { fileFromSync } from "fetch-blob/from.js"
// import { FormData } from "formdata-polyfill"

// const dummyImage = fileFromSync("./dummy.png")

export const DefaultPassword = "TgsP@ssw0rd"

export const DefaultCurrencyCode = "CNY"

export const register = async (
  token,
  {
    username = `${faker.name.firstName()}${new Date().getTime()}`,
    currency = DefaultCurrencyCode,
    pwd = DefaultPassword,
    confirmpwd = DefaultPassword,
    invitationcode = "",
    testplayer = false
  } = {}
) => {
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

  //TODO: check err = 0?
  //{"uid":"4ueulel28rd6","isnew":true,"err":0,"errmsg":"","errmsgid":null}
  let result = await fetcher(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers
  })

  return {
    username,
    currency,
    password: pwd,
    ...result
  }
}

const Type = {
  Desktop: 0,
  Mobile: 1
}

export const login = async (
  platformToken,
  { username, password = DefaultPassword, platformtype = Type.Desktop }
) => {
  let payload = {
    username,
    password,
    platformtype
  }

  let url = `${operatorApi()}/player/login`
  let headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${platformToken}`
  }

  //TODO: check err = 0?
  //{"token":"x.x.x","logintime":1632375453014,"err":0,"errmsg":"","errmsgid":null}
  let result = await fetcher(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers
  })

  return result
}

export const depositPaymentList = async (platformToken, token) => {
  let url = `${operatorApi()}/deposit`
  let headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${platformToken}`,
    Token: token
  }

  let result = await fetcher(url, {
    headers
  })

  return result && result.data
}

//TODO: auto upload proof
//TODO: auto get manual payment id?
export const manualDeposit = async (
  platformToken,
  token,
  { paymentid, account, amount }
) => {
  let payload = {
    paymentid,
    account,
    amount
  }

  let url = `${operatorApi()}/deposit/manual`
  let headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${platformToken}`,
    Token: token
  }

  //TODO: FormData in node.js?
  //TODO: get data -> /api/deposit/manual/43e8e093-962d-48fc-9435-0c6a8fd37f39 POST & FormData
  //{"data":"43e8e093-962d-48fc-9435-0c6a8fd37f39","err":0,"errmsg":"","errmsgid":null}
  let result = await fetcher(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers
  })
}
