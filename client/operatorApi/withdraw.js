import { fetcher } from "../fetcher.js"
import faker from "faker"
import { api } from "./api.js"
import FormData from "form-data"
import { fileURLToPath } from "url"
import fsExtra from "fs-extra"
import { bankInfoList, findBankInfoIdByType } from "./player.js"

const { finance } = faker

let cache = new Map()
//TODO: test if cache works?
export const paymentOptions = async (platformToken, playerToken) => {
  let url = `${api()}/withdraw`
  let headers = {
    "brand-token": platformToken,
    Token: playerToken
  }

  let result = await fetcher(url, { headers, cache })
  return result && result.data
}

const ManualPaymentCode = "Manual"
const findPaymentChannelIdByCode = async (
  platformToken,
  playerToken,
  paymentCode = ManualPaymentCode
) => {
  let payments = await paymentOptions(platformToken, playerToken)
  let payment = payments.find(({ paymentcode }) => paymentcode === paymentCode)
  return payment && payment.channelid
}

export const findManualPaymentChannelId = async (platformToken, playerToken) =>
  findPaymentChannelIdByCode(platformToken, playerToken, ManualPaymentCode)

/*
    Returns formId
*/
export const applyManualWithdraw = async (
  platformToken,
  playerToken,
  { bankinfoid, amount } = {}
) => {
  if (!bankinfoid) {
    bankinfoid = await findBankInfoIdByType(platformToken, playerToken)
  }

  let payload = {
    bankinfoid,
    amount
  }

  let url = `${api()}/withdraw`
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

  return result.data
}

export default {
  paymentOptions,
  findManualPaymentChannelId,
  applyManualWithdraw
}
