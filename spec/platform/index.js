import { selectRandomOption } from "../page/select"

export const PlatformSelectSelector = `select[name="brandId"]`

export const platformSelectSelectorOf = (prefix = "") =>
  `${prefix} ${PlatformSelectSelector}`

export const selectRandomPlatform = async (
  page,
  selectSelector = PlatformSelectSelector
) => selectRandomOption(page, selectSelector)

//TODO: select TGP platform?
export const selectPlatform = async () => {}
