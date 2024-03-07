import { fetcher } from "../fetcher.js"
import { host } from "../host.js"

const API = "api/player/bucket"

export const amount = async (playerCode) => {
  if (!playerCode) {
    return null
  }
  let url = `${host}/${API}/amount/${playerCode}`
  let response = await fetcher.get(url)
  let result = await response.json()
  return result
}

export const list = async (playerCode) => {
  if (!playerCode) {
    return null
  }

  let url = `${host}/${API}/${playerCode}`
  let response = await fetcher.get(url)
  let result = await response.json()
  return result
}

export const history = async (bucketId) => {
  if (!bucketId) {
    return null
  }

  let url = `${host}/${API}/history/${bucketId}`
  let response = await fetcher.get(url)
  let result = await response.json()

  return result
}

export const firstHistory = async (playerCode) => {
  let items = await list(playerCode)
  let first = items?.[0]
  if (!first) {
    return null
  }

  let result = await history(first.id)
  return result
}

export const clear = async (playerCode) => {
  if (!playerCode) {
    return null
  }

  let url = `${host}/api/player/bucket/${playerCode}`
  let response = await fetcher.delete(url)
}

export default {
  amount,
  list,
  history,
  firstHistory,
  clear
}
