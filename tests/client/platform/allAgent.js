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
