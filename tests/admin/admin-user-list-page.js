import { urlIncludes } from "../page/response.js"

export const gotoAdminUserListPage = async (page) => {
  await page.goto(`/system/admins`, { waitUntil: "networkidle" })
}

export const searchAdminUser = async (page, username) => {
  await page.fill(`input[name="username"]`, username)
  await Promise.all([
    page.waitForResponse(urlIncludes("/api/users")),
    page.click(`button[type="submit"]`)
  ])
}
