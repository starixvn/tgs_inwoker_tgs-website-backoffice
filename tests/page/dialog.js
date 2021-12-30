export const openDialog = async (
  page,
  dialogSelector,
  disclosureSelector = ""
) => {
  if (!disclosureSelector) {
    disclosureSelector = `${dialogSelector}-disclosure`
  }
  await page.click(disclosureSelector)
  await page.waitForSelector(dialogSelector)
}
