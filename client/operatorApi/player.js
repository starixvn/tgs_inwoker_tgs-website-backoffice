import { fetcher } from "../fetcher.js"
import faker from "@faker-js/faker"
import { api } from "./api.js"
import FormData from "form-data"
import { fileURLToPath } from "url"
import fsExtra from "fs-extra"
import { findManualPaymentChannelId } from "./withdraw.js"

const { finance } = faker
const { createReadStream } = fsExtra

export const DefaultPassword = "TgsP@ssw0rd"

export const DefaultCurrencyCode = "CNY"

//TODO: add realName and phone?
//TODO: log error 'User Name' is not in the correct format."
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

  //TODO: catch error?
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

//TODO: able to cache result?
let cache = new Map()
export const bankInfoList = async (platformToken, playerToken) => {
  let url = `${api()}/bankinfo`
  let headers = {
    "Content-Type": "application/json",
    "brand-token": platformToken,
    Token: playerToken
  }

  let result = await fetcher(url, {
    headers,
    cache
  })
  return (result && result.data) || []
}

export const findBankInfoIdByType = async (
  platformToken,
  playerToken,
  type = "Bank"
) => {
  let list = await bankInfoList(platformToken, playerToken)
  let bankInfo = list.find(({ banktype }) => banktype === type)
  return bankInfo && bankInfo.id
}

export const addManualBankCard = async (
  platformToken,
  playerToken,
  {
    paymentchannelid,
    bankAccount = finance.account(),
    name = finance.accountName(),
    bankName = "bankName",
    bankBranch = "bankBranch"
  } = {}
) => {
  if (!paymentchannelid) {
    paymentchannelid = await findManualPaymentChannelId(
      platformToken,
      playerToken
    )
  }

  let url = `${api()}/bankinfo`
  let payload = {
    banktype: "Bank",
    paymentchannelid,
    detail: {
      bankName,
      bankBranch,
      name,
      bankAccount
    }
  }
  let headers = {
    "Content-Type": "application/json",
    "brand-token": platformToken,
    Token: playerToken
  }

  let result = await fetcher(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers
  })
  return result
}

export const addBankCard = async (
  platformToken,
  playerToken,
  {
    paymentchannelid,
    bankAccount = finance.account(),
    name = finance.accountName(),
    bankName = "bankName",
    bankBranch = "bankBranch"
  } = {}
) => {
  if (!paymentchannelid) {
    throw "paymentchannelid is required"
  }

  let url = `${api()}/bankinfo`
  let payload = {
    banktype: "Bank",
    paymentchannelid,
    detail: {
      bankName,
      bankBranch,
      name,
      bankAccount
    }
  }
  let headers = {
    "Content-Type": "application/json",
    "brand-token": platformToken,
    Token: playerToken
  }

  let result = await fetcher(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers
  })
  return result
}

const dummyImagePath = fileURLToPath(new URL("./dummy.png", import.meta.url))
export const uploadIdentity = async (platformToken, playerToken) => {
  const form = new FormData()
  let dummyImageStream = await createReadStream(dummyImagePath)
  form.append("file", dummyImageStream, "dummy.png")

  let formData = {
    realname: faker.name.firstName(),
    id: "53644419800101437X"
  }
  form.append("request", JSON.stringify(formData))

  let headers = {
    ...form.getHeaders(),
    "brand-token": platformToken,
    Token: playerToken
  }

  let url = `${api()}/player/identity/upload`
  let result = await fetcher(url, {
    method: "POST",
    body: form,
    headers
  })

  return formData
}

export const updateIdentity = async (platformToken, playerToken) => {
  let formData = {
    realname: faker.name.firstName(),
    id: "53644419800101437X"
  }

  let headers = {
    "Content-Type": "application/json",
    "brand-token": platformToken,
    Token: playerToken
  }

  let url = `${api()}/player/identity`
  let uploadResult = await uploadIdentity(platformToken, playerToken)
  /*
  let updateResult = await fetcher(url, {
    method: "PATCH",
    body: JSON.stringify(formData),
    headers
  })
  
  return formData
  */
  return uploadResult
}

export const sendLetter = async (
  platformToken,
  playerToken,
  formData = { subject: "subject", content: "content" }
) => {
  let headers = {
    "Content-Type": "application/json",
    "brand-token": platformToken,
    Token: playerToken
  }

  let url = `${api()}/station-letter`
  let result = await fetcher(url, {
    method: "PUT",
    body: JSON.stringify(formData),
    headers
  })

  return formData
}

export default {
  create,
  login,
  createAndLogin,
  addManualBankCard,
  addBankCard,
  findBankInfoIdByType,
  uploadIdentity,
  updateIdentity,
  sendLetter
}
