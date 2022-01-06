import fetcher from "../fetcher.js"
import { api } from "./api.js"

export const platformToken = async (brandCode = "GPI") => {
  let result = await fetcher(`${api()}/brand/token/${brandCode}`)
  return result
}

export default platformToken
