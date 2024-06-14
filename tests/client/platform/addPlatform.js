import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import { faker } from "@faker-js/faker"
import { findPlatform } from "./findPlatform.js"
import { getLicensee } from "../licensee/getLicensee.js"
import { getConfigs } from "../gameProvider/getConfigs.js"

const API = "api/brand"

export const addPlatform = async ({
  licenseeId = "",
  code = `${faker.string.alpha(1)}${faker.string.alphanumeric(
    5
  )}`.toUpperCase(),
  name,
  operationalEmail = faker.internet.email(),
  settlementIntervalType = "Daily",
  currencyCodes = ["CNY"],
  agentDividendType = "OneLayer",
  languages = [{ cultureCode: "zh-CN" }],
  domains = [],
  ...formData
} = {}) => {
  name = name ?? code
  if (!licenseeId) {
    console.error("licenseeId is required")
    return null
  }

  let licensee = await getLicensee(licenseeId)
  if (!licensee) {
    console.error("licensee not found")
    return null
  }

  let [currencyCode] = currencyCodes
  let betLimit = licensee.betLimits.find(
    (betLimit) => betLimit.currencyCode === currencyCode
  )
  if (!betLimit) {
    console.error("betLimit not found")
    return null
  }

  let [gameProvider] = licensee.gameProviders
  let configs = await getConfigs(gameProvider.gameProviderId)
  if (!configs) {
    console.error("configs required")
    return null
  }
  let [config] = configs

  let [language] = languages

  let url = `${host}/${API}`
  let data = {
    licenseeId,
    code,
    name,
    operationalEmail,
    settlementIntervalType,
    currencyCodes,
    agentDividendType,
    gameProviders: [{ ...gameProvider, configurationId: config.id }],
    languages: [{ ...language, brandCultureCode: language.cultureCode }],
    betLimits: [{ ...betLimit, isDefault: true }],
    domains,
    ...formData
  }
  console.log("add platform payload", data)
  let response = await fetcher.post(url, {
    data
    /*
    failOnStatusCode: true
    */
  })

  let result = await response.json()
  if (!result.valid) {
    console.error("addPlatform failed", result)
    return null
  }

  let platform = await findPlatform(code)
  return platform
}
