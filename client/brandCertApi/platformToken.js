import fetcher from "../fetcher.js"
import { api } from "./api.js"

export const platformToken = async (brandCode = "GPI") => {
  let brand = await fetcher(`${api()}/brand/${brandCode}`)

  let brandId = brand.id
  let result = await fetcher(`${api()}/cert/${brandId}`, {
    method: "POST"
  })
  return result
}

export default platformToken
