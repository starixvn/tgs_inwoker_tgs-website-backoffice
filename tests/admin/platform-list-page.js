import { selectPlatformByCode } from "../page/content.js"
import { selectByLabel } from "../page/select.js"
import { openDialog } from "../page/dialog.js"
import faker from "@faker-js/faker"

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

export const AgentDividendType = {
  OneLayer: "OneLayer",
  MultipleLayer: "MultipleLayer"
}

export const SettlementIntervalType = {
  Daily: "Daily",
  Weekly: "Weekly",
  Monthly: "Monthly"
}

export const addPlatform = (
  page,
  {
    resellerCode = "TGS",
    licenseeCode = "TGS",
    code = faker.random.alphaNumeric(5),
    name = faker.random.alpha(5),
    operationalEmail = faker.internet.email(),
    agentDividendType = AgentDividendType.OneLayer,
    settlementIntervalType = SettlementIntervalType.Daily,
    ...restForm
  }
) => {
  let addPlatformSelector = `#add-platform-dialog`
  // await openDialog(page, addPlatformSelector)
  /*
  await selectByLabel(
    page,
    `${addPlatformSelector} [name="resellerId"]`,
    resellerCode
  )
  await selectByLabel(
    page,
    `${addPlatformSelector} [name="licenseeId"]`,
    licenseeCode
  )
  */
}

export const gotoPlatformListPage = async (page) => {
  await page.goto("/merchant/brands", { waitUntil: "networkidle" })
}
