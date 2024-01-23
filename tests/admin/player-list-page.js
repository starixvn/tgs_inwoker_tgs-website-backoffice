import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import { urlIncludes } from "../page/response.js"

export const ViewPlayerDialogSelector = `#view-player-dialog`

export const searchPlayer = async (page, player) => {
  let usernameSelector = `input[name="username"]`
  await page.fill(usernameSelector, player.username)

  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/player?`)),
    page.click(`button[type="submit"]`)
  ])
}

export const openViewPlayerDialog = async (page, player) => {
  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/player/${player.code}`)),
    openDialog(page, ViewPlayerDialogSelector)
  ])
  return ViewPlayerDialogSelector
}

export const openEditPlayerDialog = async (page) => {
  let dialogSelector = `#edit-player-dialog`
  await openDialog(page, dialogSelector)
  return dialogSelector
}

export const gotoPlayerListPage = async (page, platformCode) => {
  await page.goto("/playermanagement/playerlist", { waitUntil: "networkidle" })
  return await selectPlatformByCode(page, platformCode)
}
