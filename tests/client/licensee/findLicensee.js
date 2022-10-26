import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import { getLicensee } from "./getLicensee.js"

const API = "api/licensee"

export const findLicensee = async (value = "") => {
  let url = `${host}/${API}?keyword=${value}&showAll=true`
  let response = await fetcher.get(url)
  let result = await response.json()
  let filtered = result.items.find(({ code }) => code === value)

  let licenseeId = filtered?.id
  if (!licenseeId) {
    return null
  }

  return getLicensee(licenseeId)
}
