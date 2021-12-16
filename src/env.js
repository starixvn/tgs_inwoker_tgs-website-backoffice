import { set } from "lodash-es"
import { boolean } from "boolean"

/**
 * env =
 * {
 *  mode: "production" | "development",
 *  loginButtonColor: "#ffffff" | "#212121",
 *  loginButtonBackground: "#1e417b" | "#f7f7fa",
 *  headerBackground: "#1e417b" | "#f7f7fa"
 *  headerButtonColor: "#ffffff" | "#212121",
 *  headerButtonBackground: "transparent" | ""
 * }
 *
 * Note: env declared in public/env.html
 *
 * ref:
 * https://caddyserver.com/docs/modules/http.handlers.templates
 */

const Development = "development"

const Production = "production"

export const isDev = () => window?.env?.mode === Development

export const isProduction = () => window?.env?.mode === Production

export const getLoginImageUrl = () => window?.env?.loginImageUrl || ""

export const getLoginTitle = () => window?.env?.loginTitle || ""

export const getLoginTitleColor = () => window?.env?.loginTitleColor || "#000"

export const getLoginTitleFontSize = () =>
  window?.env?.loginTitleFontSize || "5rem"

export const getLoginTitleFontWeight = () =>
  window?.env?.loginTitleFontWeight || "800"

export const getLoginSubTitle = () => window?.env?.loginSubTitle || ""

export const getLoginSubTitleFontSize = () =>
  window?.env?.loginSubTitleFontSize || "1.7rem"

export const getHeaderImageUrl = () => window?.env?.headerImageUrl || ""

export const getHeaderTitle = () => window?.env?.headerTitle || ""

export const getHeaderTitleColor = () => window?.env?.headerTitleColor || "#FFF"

export const getHeaderTitleFontSize = () =>
  window?.env?.headerTitleFontSize || "2rem"

export const getHeaderTitleFontWeight = () =>
  window?.env?.headerTitleFontWeight || "800"

export const getLoginButtonColor = () =>
  window?.env?.loginButtonColor || "#ffffff"

export const getLoginButtonBackground = () =>
  window?.env?.loginButtonBackground || "#1e417b"

export const getHeaderBackground = () =>
  window?.env?.headerBackground || "#1e417b"

export const getHeaderButtonColor = () =>
  window?.env?.headerButtonColor || "#ffffff"

export const getHeaderButtonBackground = () =>
  window?.env?.loginButtonBackground || "transparent"

const AgentMonthlyProfitSharingSetting = "AgentMonthlyProfitSharingSetting" //TODO: remove env.html -> env.features.AgentMonthlyProfitSharingSetting & isAgentMonthlyProfitSharingSettingEnabled
const SystemTimezone = "SystemTimezone"
const AllAgent = "AllAgent"
export const Features = {
  AgentMonthlyProfitSharingSetting,
  SystemTimezone,
  AllAgent
}

export const isAgentMonthlyProfitSharingSettingEnabled = () => {
  return boolean(window?.env?.features?.[AgentMonthlyProfitSharingSetting])
}

const listFeatures = () => {
  let features = Object.entries(Features ?? {})
  if (features.length > 0) {
    console.group("Features: ")
    features.map(([feature]) => {
      console.log(`${feature}`)
    })
    console.groupEnd()
  }
}

const enableFeatures = (...features) => {
  if (features.length > 0) {
    console.group("Enable: ")
    features.map((feature) => {
      let path = `env.features.${feature}`
      set(window, path, true)
      console.log(path)
    })
    console.groupEnd()
  }
}

window.featureX = {
  list: listFeatures,
  enableAll: () => enableFeatures(...Object.values(Features)),
  enableFeatures
}

export const isFeatureEnabled = (feature = "") => {
  return boolean(window?.env?.features?.[feature])
}

export default {
  Development,
  Production,
  isDev,
  isProduction,
  getLoginButtonColor,
  getLoginButtonBackground,
  getHeaderBackground,
  getHeaderButtonColor,
  getHeaderButtonBackground,
  isFeatureEnabled,
  Features
}
