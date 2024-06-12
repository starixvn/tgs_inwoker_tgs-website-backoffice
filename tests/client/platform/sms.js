import { fetcher } from "../fetcher.js"
import { host } from "../host.js"

const API = "api/brand"

export const add = async (brandId, smsSettingId) => {
  if (!brandId) {
    throw "brandId required"
  }
  if (!smsSettingId) {
    throw "smsSettingId required"
  }
  let url = `${host}/${API}/${brandId}/sms`

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
  let response = await fetcher.get(`${host}/${API}/sms/options/${brandId}`)
  let result = await response.json()
  return result
}

export const info = async (brandId) => {
  if (!brandId) {
    throw "brandId required"
  }
  let url = `${host}/${API}/sms/${brandId}`
  let response = await fetcher.get(url)
  let result = await response.json()
  return result
}

export const enable = async (brandId, bool) => {
  if (!brandId) {
    throw "brandId required"
  }

  let url = `${host}/${API}/enable-sms/${brandId}`

  let response = await fetcher.patch(url, {
    data: Boolean(bool).toString(),
    headers: {
      "Content-Type": "application/json"
    }
  })

  return response.ok()
}

export const apply = async (brandId, smsSettingId) => {
  if (!brandId) {
    throw "brandId required"
  }
  if (!smsSettingId) {
    throw "smsSettingId required"
  }

  let url = `${host}/${API}/sms/apply/${brandId}`
  let response = await fetcher.patch(url, {
    data: smsSettingId,
    failOnStatusCode: true,
    headers: {
      "Content-Type": "application/json"
    }
  })

  return response.ok()
}
