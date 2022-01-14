import fetcher from "./fetcher.js"
import { operatorApi } from "./env.js"
import FormData from "form-data"
import { fileURLToPath } from "url"
import fsExtra from "fs-extra"

const { createReadStream } = fsExtra

export const DefaultPassword = "TgsP@ssw0rd"

export const DefaultCurrencyCode = "CNY"

export const promotionList = async (platformToken, token, lang = "en-US") => {
  let url = `${operatorApi()}/playerpromotion/${lang}?all=true`

  let headers = {
    "Content-Type": "application/json",
    "brand-token": platformToken,
    Token: token
  }

  let result = await fetcher(url, {
    method: "GET",
    headers
  })
  return result && result.data
}
