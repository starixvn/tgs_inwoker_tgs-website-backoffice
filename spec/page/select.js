import { mapValue } from "./map"
import { random } from "lodash"

const OptionValueNotEmptySelector = `option:not([value=""])`

export const selectRandomOption = async (page, selectSelector) => {
  let OptionSelector = `${selectSelector} ${OptionValueNotEmptySelector}`
  await page.waitForSelector(OptionSelector, { state: "attached" })

  let options = await optionValues(page, selectSelector)

  let randomIndex = random(0, options.length - 1)
  let option = options[randomIndex]

  await page.selectOption(selectSelector, option)
  return option
}

export const optionValues = async (page, selectSelector) => {
  let OptionSelector = `${selectSelector} ${OptionValueNotEmptySelector}`
  await page.waitForSelector(OptionSelector, { state: "attached" })
  return await page.$$eval(OptionSelector, mapValue)
}

export const optionLabelValuePairs = async (page, selectSelector) => {
  let OptionSelector = `${selectSelector} ${OptionValueNotEmptySelector}`
  await page.waitForSelector(OptionSelector, { state: "attached" })
  return await page.$$eval(OptionSelector, (elements) =>
    elements.map(({ value, textContent }) => [textContent, value])
  )
}
