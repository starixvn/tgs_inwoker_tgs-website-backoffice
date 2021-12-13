import fetcher from "../fetcher"
import { api } from "./api"

export const platformToken = async (brandCode = "GPI") => {
  let result = await fetcher(`${api()}/brand/token/${brandCode}`)
  return result
}

export default platformToken
