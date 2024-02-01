import { selectRandomOption, selectByLabel, selectByValue } from "./select.js"

export const PlatformSelectSelector = `select[name="brandId"]`

export const platformSelectSelectorOf = (prefix = "") =>
  `${prefix} ${PlatformSelectSelector}`

export const selectRandomPlatform = async (
  page,
  selectSelector = PlatformSelectSelector
) => selectRandomOption(page, selectSelector)

export const selectPlatformByCode = async (
  page,
  code,
  selectSelector = PlatformSelectSelector
) => {
  return selectByLabel(page, selectSelector, code)
}

const LicenseeSelectSelector = `select[name="licenseeId"]`
export const selectLicenseeById = async (
  page,
  id,
  selectSelector = LicenseeSelectSelector
) => {
  return selectByValue(page, selectSelector, id)
}
