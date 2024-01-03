import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import { faker } from "@faker-js/faker"

const AlertSettingApi = "/api/brandgamecreditsuspsetting"

export const getAlertSetting = async (brandId) => {
  let url = `${host}${AlertSettingApi}/${brandId}`
  let response = await fetcher.get(url)
  return await response.json()
}
