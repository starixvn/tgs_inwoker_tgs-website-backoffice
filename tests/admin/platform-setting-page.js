import { openDialog } from "../page/dialog.js"
import { selectPlatformByCode } from "../page/content.js"

const DefaultProfitSharingSettings = [
  {
    activeNumber: 1,
    netProfit: 1,
    dividendPercentage: 1
  }
]

export const setPlatformProfitSharingSetting = async (
  page,
  settings = DefaultProfitSharingSettings
) => {
  let prefix = await openProfitSharingSettingDialog(page)
  for (let i = 0; i < settings.length; i++) {
    let setting = settings[i]
    await page.fill(`${prefix} ${activeNumber}`, `${setting.activeNumber}`)
    await page.fill(``)
  }
}

export const openProfitSharingSettingDialog = async (page) => {
  let dialogSelector = `#profit-sharing-setting-dialog`
  await openDialog(page, dialogSelector)
  return dialogSelector
}

export const gotoPlatformSettingPage = async (page, platformCode) => {
  await page.goto("/platform/imsettings", { waitUntil: "networkidle" })
  await selectPlatformByCode(platformCode)
}
