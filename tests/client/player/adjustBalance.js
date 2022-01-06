import { fetcher } from "../fetcher.js"
import { host } from "../host.js"

const API = "api/player"
export const adjustBalance = async (playerCode, formData) => {
  if (!formData.transactionType) {
    formData.transactionType = "Other"
  }

  let response = await fetcher.post(`${host}/${API}/${playerCode}/adjust`, {
    data: formData,
    failOnStatusCode: true
  })
  return await response.json()
}

export const addBalance = async (playerCode, { ...formData } = {}) =>
  await adjustBalance(playerCode, {
    playerCode,
    adjustType: "Add",
    ...formData
  })

export const deductBalance = async (playerCode, formData = {}) =>
  await adjustBalance(playerCode, {
    adjustType: "Subtract",
    ...formData
  })
