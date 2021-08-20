export const selectFirst = async ({ page }) => {
  await page.waitForSelector(
    `#page-merchant-bar select[name="brandId"] option[value*="-"]:not(:first-child)`,
    {
      state: "attached"
    }
  )
  let option = await page.$eval(
    `#page-merchant-bar select[name="brandId"] option[value*="-"]:not(:first-child)`,
    (element) => element.value
  )
  await Promise.all([
    page.selectOption(`#page-merchant-bar select[name="brandId"]`, option)
  ])
}

export default {
  selectFirst
}
