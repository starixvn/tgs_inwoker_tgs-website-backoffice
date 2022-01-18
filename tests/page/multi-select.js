export const selectByValue = async (page, selectSelector, value) => {
  await page.click(`${selectSelector} #dropdown-indicator`)
  await page.click(
    `${selectSelector} #menu-list [data-option-value="${value}"]`
  )
}
