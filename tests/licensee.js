//TODO: rm
export const selectFirst = async ({ page }) => {
  let SelectOptionSelector = `#page-merchant-bar select[name="licenseeId"] option[value*="-"]:not(:first-child)`
  await page.waitForSelector(SelectOptionSelector, {
    state: "attached"
  })
  let option = await page.$eval(
    SelectOptionSelector,
    (element) => element.value
  )
  await Promise.all([
    page.selectOption(`#page-merchant-bar select[name="licenseeId"]`, option),
    page.waitForLoadState("networkidle")
  ])
  await page.waitForLoadState("domcontentloaded")
  return option
}

//TODO: rm
export const selectByCode = async ({ page, brandCode }) => {
  await page.waitForSelector(
    `#page-merchant-bar select[name="licenseeId"] option[value*="-"]:not(:first-child)`,
    {
      state: "attached"
    }
  )
  await Promise.all([
    page.selectOption(`#page-merchant-bar select[name="licenseeId"]`, {
      label: brandCode
    }),
    page.waitForLoadState("networkidle")
  ])
  await page.waitForLoadState("domcontentloaded")
}
