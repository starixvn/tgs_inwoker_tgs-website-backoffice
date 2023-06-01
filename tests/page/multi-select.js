export const selectByValue = async (page, selectSelector, value) => {
  await page.click(`${selectSelector} #dropdown-indicator`)
  await page.click(
    `${selectSelector} [data-dialog] [data-option-value="${value}"]`
  )
}
