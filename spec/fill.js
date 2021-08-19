export const fillDatePicker = async ({ page, selector, value }) => {
  await page.click(selector)
  await page.fill(selector, value)
  await page.keyboard.press("Enter")
  await page.waitForTimeout(100)
}
