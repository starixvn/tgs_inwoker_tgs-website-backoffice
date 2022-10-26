import { fetcher } from "../fetcher.js"
import { host } from "../host.js"

const API = "api/licensee"

export const getLicensee = async (id = "") => {
  let url = `${host}/${API}/${id}`

  let response = await fetcher.get(url)
  let result = await response.json()

  return result.licensee
}
