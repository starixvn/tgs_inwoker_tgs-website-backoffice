import fetch from "node-fetch"
import { globalApi, operatorApi } from "./env"

export const selectFirst = async ({ page }) => {
  await page.waitForSelector(
    `#page-merchant-bar select[name="brandId"] option[value*="-"]:not(:first-child)`,
    {
      state: "attached"
    }
  )
  let option = await page.$eval(
    `#page-merchant-bar select[name="brandId"] option[value*="-"]:not(:first-child)`,
    (element) => element.value
  )
  await Promise.all([
    page.selectOption(`#page-merchant-bar select[name="brandId"]`, option),
    page.waitForLoadState("networkidle")
  ])
  await page.waitForLoadState("domcontentloaded")
  return option
}

//TODO: rm page?
const apiKeys = async ({ page }) => {
  let response = await fetch(`${globalApi()}/brand/apikeys`)
  return await response.json()
}

//TODO: rm page?
export const apiKey = async ({ page, brandCode = "GPI" }) => {
  let response = await apiKeys({ page })
  let { items = [] } = response
  let item = items.find((item) => item.brandCode == brandCode)
  return item && item.apiKey
}

//TODO: rm page?
export const token = async ({
  page,
  brandCode = "GPI",
  apiKey: client,
  currency = "CNY"
}) => {
  if (!client) {
    client = await apiKey({ page, brandCode })
  }
  let payload = {
    client,
    currency
  }

  let response = await fetch(`${operatorApi()}/auth/jwt`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" }
  })
  let result = await response.json()
  return result.token
}

export default {
  selectFirst,
  apiKey,
  token
}
