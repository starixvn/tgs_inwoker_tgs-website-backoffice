import { fetcher } from "../fetcher.js"
import faker from "faker"
import { api } from "./api.js"
import FormData from "form-data"
import { fileURLToPath } from "url"
import fsExtra from "fs-extra"

const { createReadStream } = fsExtra

export const DefaultPassword = "TgsP@ssw0rd"

export const DefaultCurrencyCode = "CNY"

export const create = async (
  platformToken,
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

  let url = `${api()}/player/create`
  let headers = {
    "Content-Type": "application/json",
    "brand-token": platformToken
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

  let url = `${api()}/player/login`
  let headers = {
    "Content-Type": "application/json",
    "brand-token": platformToken
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

export const createAndLogin = async (
  platformToken,
  {
    username = `${faker.name.firstName()}${new Date().getTime()}`,
    currency = DefaultCurrencyCode,
    pwd = DefaultPassword,
    confirmpwd = DefaultPassword,
    password = DefaultPassword,
    invitationcode = "",
    testplayer = false,
    platformtype = Type.Desktop
  } = {}
) => {
  let player = await create(platformToken, {
    username,
    currency,
    pwd,
    confirmpwd,
    invitationcode,
    testplayer
  })

  player = {
    ...player,
    ...(await login(platformToken, { username, password, platformtype }))
  }

  player.playerCode = player.uid
  player.code = player.uid

  return player
}

export default {
  create,
  login,
  createAndLogin
}
