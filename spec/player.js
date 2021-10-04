import fetcher from "./fetcher"
import faker from "faker"
import { globalApi, operatorApi } from "./env"

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
  token,
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
    Authorization: `Bearer ${token}`
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

//TODO: get payment list
export const depositPaymentList = () => {}

//TODO
export const manualDeposit = (token, data) => {}
