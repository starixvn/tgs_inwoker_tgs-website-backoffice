import { selectRandomOption, selectByLabel } from "./select.js"

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
