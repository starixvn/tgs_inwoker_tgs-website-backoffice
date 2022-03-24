import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"

export const ViewPlayerDialogSelector = `#view-player-dialog`

export const searchPlatform = async (page, keyword) => {
  let inputSelector = `input[name="keyword"]`
  await page.fill(inputSelector, keyword)

  await Promise.all([
    page.waitForResponse((response) => {
      return response.url().includes(`/api/brand?`) && response.status() === 200
    }),
    page.click(`button[type="submit"]`)
  ])
}

const EditPlatformDialogSelector = `#edit-platform-dialog`
export const openEditPlatformDialog = async (page) => {
  await openDialog(page, EditPlatformDialogSelector)
  return EditPlatformDialogSelector
}

export const updatePlatform = async (
  page,
  { enablePlayerIdentity, ...options }
) => {
  let platformIdLocator = page.locator(
    `${EditPlatformDialogSelector}-disclosure`
  )
  let platformId = await platformIdLocator.getAttribute("data-platform-id")
  let dialogSelector = await openEditPlatformDialog(page)

  if (enablePlayerIdentity !== null || enablePlayerIdentity !== undefined) {
    let checkboxSelector = `${dialogSelector} [name="enablePlayerIdentity"]`
    enablePlayerIdentity
      ? await page.check(checkboxSelector, { force: true })
      : await page.uncheck(checkboxSelector, { force: true })
  }

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/brand/${platformId}`) &&
        response.status() === 200
      )
    }),
    page.click(`${dialogSelector} button[type="submit"]`)
  ])
}

export const gotoPlatformListPage = async (page) => {
  await page.goto("/merchant/brands", { waitUntil: "networkidle" })
}
