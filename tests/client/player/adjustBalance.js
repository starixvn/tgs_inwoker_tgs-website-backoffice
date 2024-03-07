import { fetcher } from "../fetcher.js"
import { host } from "../host.js"

const API = "api/player"
export const adjustBalance = async (playerCode, formData = {}) => {
  if (!formData.transactionType) {
    formData.transactionType = "Other"
  }

  let response = await fetcher.post(`${host}/${API}/${playerCode}/adjust`, {
    data: { playerCode, ...formData },
    failOnStatusCode: true
  })
  return await response.json()
}

export const addBalance = async (playerCode, { ...formData } = {}) => {
  if (!formData.transactionType) {
    formData.transactionType = "CompanyAdjust"
  }

  let response = await fetcher.post(
    `${host}/${API}/${playerCode}/adjust/increase`,
    {
      data: { playerCode, ...formData },
      failOnStatusCode: true
    }
  )
  let result = await response.json()
  if (!result.valid) {
    console.error(`player[code="${playerCode}"] addBalance:`, result)
    throw `addBalance ${playerCode} > ${result?.message}`
  }

  return result
}

export const deductBalance = async (playerCode, formData = {}) => {
  if (!formData.transactionType) {
    formData.transactionType = "CompanyAdjust"
  }

  let response = await fetcher.post(
    `${host}/${API}/${playerCode}/adjust/reduce`,
    {
      data: { playerCode, ...formData },
      failOnStatusCode: true
    }
  )

  let result = await response.json()
  if (!result.valid) {
    console.error(`deductBalance ${playerCode} >`, result)
    throw `deductBalance ${playerCode} > ${result?.message}`
  }

  return result
}
