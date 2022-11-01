import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import { list as listGameProviders } from "./list.js"
import { random as randomIndex } from "lodash-es"

const API = "api/GameProvider"

export const random = async () => {
  let items = await listGameProviders()
  let index = randomIndex(items.length - 1)
  return items?.[index]
}
