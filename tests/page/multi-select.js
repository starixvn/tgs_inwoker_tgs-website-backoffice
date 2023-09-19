export const selectByValue = async (page, selectSelector, value) => {
  await page.click(`${selectSelector} #dropdown-indicator`)
  await page.click(
    `${selectSelector} [data-dialog] [data-option-value="${value}"]`
  )
}

export const fillLabel = async (page, selectSelector, value) => {
  await page.click(`${selectSelector} [data-value] input`)
  await page.locator(`${selectSelector} [data-value] input`).fill(value)
  await page.click(
    `${selectSelector} [data-dialog] [data-option-label="${value}"]`
  )
}

export const selectByLabel = async (page, selectSelector, value) => {
  await page.click(`${selectSelector} #dropdown-indicator`)
  await page.click(
    `${selectSelector} [data-dialog] [data-option-label="${value}"]`
  )
}
