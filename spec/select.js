import { random } from "lodash"

const allExceptFirst = async ({ page, selectSelector = "" }) => {
  let Selector = `${selectSelector} option:not(:first-child)`
  await page.waitForSelector(Selector, { state: "attached" })
  return page.$$eval(Selector, (options) => options.map(({ value }) => value))
}

export const optionValue = {
  allExceptFirst: allExceptFirst
}

export const randomOption = async ({
  page,
  selectSelector = "",
  options = []
}) => {
  let option = options.length > 0 ? options[random(0, options.length - 1)] : ""
  await page.selectOption(selectSelector, option)
  return option
}

export default {
  optionValue,
  randomOption
}
