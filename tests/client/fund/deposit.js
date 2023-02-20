import { fetcher } from "../fetcher.js"
import { host } from "../host.js"

const API = "api/deposit"

const Type = {
  Approve: "Approve",
  Reject: "Reject"
}

export const review = async (formId, data) => {
  let response = await fetcher.post(`${host}/${API}/${formId}`, {
    data,
    failOnStatusCode: true
  })
  return await response.json()
}

export const approve = async (formId, formData) => {
  return review(formId, { ...formData, reviewResponse: Type.Approve })
}

export const reject = async (formId, formData) => {
  return review(formId, { ...formData, reviewResponse: Type.Reject })
}

export const form = async (platformId, formId) => {
  let url = `${host}/${API}/${platformId}/${formId}`
  let response = await fetcher.get(url)
  let result = await response.json()
  return result?.data
}
