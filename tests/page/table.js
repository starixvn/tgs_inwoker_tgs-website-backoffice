import { mapTextContent } from "./map.js"

export const mapColumnCells = (page, selector) => async (fn) => {
  await page.waitForSelector(selector)
  return await page.$$eval(selector, fn)
}

export const mapColumnCellTextContents = async (page, selector) => {
  let fn = mapColumnCells(page, selector)
  return await fn(mapTextContent)
}
