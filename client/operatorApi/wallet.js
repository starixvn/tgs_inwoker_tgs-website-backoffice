import { fetcher } from "../fetcher.js"
import faker from "faker"
import { api } from "./api.js"
import FormData from "form-data"
import { fileURLToPath } from "url"
import fsExtra from "fs-extra"

export const wallet = async (platformToken, playerToken) => {
  let url = `${api()}/wallet`
  let headers = {
    "brand-token": platformToken,
    Token: playerToken
  }

  let result = await fetcher(url, { headers })
  return result && result.data && result.data.main
}
