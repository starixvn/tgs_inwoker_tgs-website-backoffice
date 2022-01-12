import { selectPlatformByCode } from "../page/content.js"

export const ViewPlayerDialogSelector = `#view-player-dialog`

export const searchPlayer = async (page, player) => {
  let usernameSelector = `input[name="username"]`
  await page.fill(usernameSelector, player.username)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/player?`) && response.status() === 200
      )
    }),
    page.click(`button[type="submit"]`)
  ])
}

export const gotoPlayerListPage = async (page, platformCode) => {
  await page.goto("/playermanagement/playerlist", { waitUntil: "networkidle" })
  return await selectPlatformByCode(page, platformCode)
}
