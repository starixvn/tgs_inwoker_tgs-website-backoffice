import { fetcher } from "../fetcher.js"
import { host } from "../host.js"

const API = "api/brand/sms"

export const add = async (brandId, smsSettingId) => {
  if (!brandId) {
    throw "brandId required"
  }
  if (!smsSettingId) {
    throw "smsSettingId required"
  }
  let url = `${host}/${API}/${brandId}`

  let response = await fetcher.post(url, {
    data: smsSettingId,
    failOnStatusCode: true,
    headers: {
      "Content-Type": "application/json"
    }
  })

  return response.ok()
}

export const list = async (brandId) => {
  let response = await fetcher.get(`${host}/${API}/options/${brandId}`)
  let result = await response.json()
  return result
}
