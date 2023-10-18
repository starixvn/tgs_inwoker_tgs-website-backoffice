import { selectPlatformByCode } from "../page/content.js"
import { selectByLabel, selectRandomOption } from "../page/select.js"
import { openDialog } from "../page/dialog.js"
import { faker } from "@faker-js/faker"

export const ViewPlayerDialogSelector = `#view-player-dialog`

export const searchPlatform = async (page, keyword) => {
  console.log("TODO: get platform by api")
  let inputSelector = `input[name="keyword"]`
  await page.fill(inputSelector, keyword)

  let [listResponse] = await Promise.all([
    page.waitForResponse((response) => {
      return response.url().includes(`/api/brand?`) && response.status() === 200
    }),
    page.click(`button[type="submit"]`)
  ])
  let listResult = await listResponse.json()
  return listResult.items[0].id
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
  let platformId = await platformIdLocator
    .first()
    .getAttribute("data-platform-id")
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

export const addPlatform = async (
  page,
  {
    resellerCode = "TGS",
    licenseeCode = "TGS",
    code = `${faker.string.alpha(1)}${faker.string.alphanumeric(5)}`,
    name = faker.string.alpha(5),
    operationalEmail = faker.internet.email(),
    agentDividendType = AgentDividendType.OneLayer,
    settlementIntervalType = SettlementIntervalType.Daily,
    currencyCode = "CNY",
    ...restForm
  } = {}
) => {
  let addPlatformSelector = `#add-platform-dialog`
  await openDialog(page, addPlatformSelector)

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

  await page.fill(`[name="code"]`, code, { force: true })
  await page.fill(`[name="name"]`, name, { force: true })
  await page.fill(`[name="operationalEmail"]`, operationalEmail, {
    force: true
  })

  await page.selectOption(`[name="agentDividendType"]`, agentDividendType)
  await page.selectOption(
    `[name="settlementIntervalType"]`,
    settlementIntervalType
  )

  await page.check(`#select-all-languages input`, { force: true })
  await page.check(`#${currencyCode}-checkbox input`, { force: true })
  await page.check(`#${currencyCode}-bet-limit-checkbox input`, { force: true })
  await page.check(`#gameProviders-checkbox-group input[type="checkbox"]`, {
    force: true
  })

  let gameProviderConfigDialogSelector = `#game-provider-config-dialog`
  await selectRandomOption(
    page,
    `${gameProviderConfigDialogSelector} [name="id"]`
  )

  await page.click(`${gameProviderConfigDialogSelector} button[type="submit"]`)

  await page.click(`${addPlatformSelector} button[type="submit"]`)
  await page.waitForSelector(addPlatformSelector, { state: "detached" })

  console.log("TODO: get platform data by api")
  let id = await searchPlatform(page, code)
  return {
    id,
    code,
    name,
    agentDividendType,
    settlementIntervalType
  }
}

export const gotoPlatformListPage = async (page) => {
  await page.goto("/merchant/brands", { waitUntil: "networkidle" })
}
