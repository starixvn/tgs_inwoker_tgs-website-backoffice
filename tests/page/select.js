import { mapValue } from "./map.js"
import { random } from "lodash-es"

const ValidOptionValueSelector = `option:not([value=""]):not([disabled])`

export const selectFirstValidOption = async (page, selectSelector) => {
  const ValidOption = `${selectSelector} ${ValidOptionValueSelector}`
  let locator = await page.locator(ValidOption).first()
  let value = await locator.getAttribute("value")
  await page.selectOption(selectSelector, value)
}

export const selectRandomOption = async (page, selectSelector) => {
  let OptionSelector = `${selectSelector} ${ValidOptionValueSelector}`
  await page.waitForSelector(OptionSelector, { state: "attached" })

  let options = await optionValues(page, selectSelector)

  let randomIndex = random(0, options.length - 1)
  let option = options[randomIndex]

  await page.selectOption(selectSelector, option)
  return option
}

export const selectByValue = async (page, selectSelector, value) => {
  let OptionSelector = `${selectSelector} ${ValidOptionValueSelector}`
  await page.waitForSelector(OptionSelector, { state: "attached" })

  await page.selectOption(selectSelector, value)
  return value
}

export const selectByLabel = async (page, selectSelector, label) => {
  let OptionSelector = `${selectSelector} ${ValidOptionValueSelector}`
  await page.waitForSelector(OptionSelector, { state: "attached" })

  await page.selectOption(selectSelector, { label })
  let value = await page.inputValue(selectSelector)
  return value
}

export const optionValues = async (page, selectSelector) => {
  let OptionSelector = `${selectSelector} ${ValidOptionValueSelector}`
  await page.waitForSelector(OptionSelector, { state: "attached" })
  return await page.$$eval(OptionSelector, mapValue)
}

export const optionLabelValuePairs = async (page, selectSelector) => {
  let OptionSelector = `${selectSelector} ${ValidOptionValueSelector}`
  await page.waitForSelector(OptionSelector, { state: "attached" })
  return await page.$$eval(OptionSelector, (elements) =>
    elements.map(({ value, textContent }) => [textContent, value])
  )
}
