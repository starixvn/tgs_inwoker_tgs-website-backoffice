import fetcher from "./fetcher"
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

export const selectByCode = async ({ page, brandCode }) => {
  await page.waitForSelector(
    `#page-merchant-bar select[name="brandId"] option[value*="-"]:not(:first-child)`,
    {
      state: "attached"
    }
  )
  await Promise.all([
    page.selectOption(`#page-merchant-bar select[name="brandId"]`, {
      label: brandCode
    }),
    page.waitForLoadState("networkidle")
  ])
  await page.waitForLoadState("domcontentloaded")
}

const apiKeys = async () => {
  return await fetcher(`${globalApi()}/brand/apikeys`)
}

export const apiKey = async (brandCode = "GPI") => {
  let response = await apiKeys()
  let { items = [] } = response
  let item = items.find((item) => item.brandCode == brandCode)
  return item && item.apiKey
}

export const token = async ({
  brandCode = "GPI",
  apiKey: client,
  currency = "CNY"
}) => {
  let result = await fetcher(`${globalApi()}/brand/token/${brandCode}`)
  return result
  /*
  if (!client) {
    client = await apiKey(brandCode)
  }
  let payload = {
    client,
    currency
  }

  let result = await fetcher(`${operatorApi()}/auth/jwt`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" }
  })

  return result.token
  */
}

export default {
  selectFirst,
  selectByCode,
  apiKey,
  token
}
