import { fetcher } from "../fetcher.js"
import { host } from "../host.js"

const API = "api/BrandAllAgent"

export const enable = async (brandId) => {
  let url = `${host}/${API}/switch`

  let response = await fetcher.put(url, {
    data: {
      brandId,
      switch: true
    }
  })

  let result = await response.json()
  if (!result.valid) {
    console.error("enable all agent failed", result)
    return null
  }

  return true
}

export const setValidBet = async ({
  brandId,
  allAgentGameType,
  conditions = []
}) => {
  let url = `${host}/${API}/validBet`
  let response = await fetcher.put(url, {
    data: {
      brandId,
      allAgentGameType,
      conditions
    }
  })

  let result = await response.json()
  if (!result.valid) {
    console.error("all agent set valid bet failed", result)
    return null
  }

  return true
}

export const getValidBet = async ({ brandId, allAgentGameType }) => {
  let url = `${host}/${API}/${brandId}/${allAgentGameType}/validBet`
  let response = await fetcher.get(url)
  return await response.json()
}
