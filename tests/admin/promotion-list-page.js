import { urlIncludes } from "../page/response"

export const searchPromotionByName = async (page, name) => {
  await page.fill(`input[name="name"]`, name)
  await Promise.all([
    page.waitForResponse(urlIncludes(`name=${name}`)),
    page.click(`button[type="submit"]`)
  ])
}
