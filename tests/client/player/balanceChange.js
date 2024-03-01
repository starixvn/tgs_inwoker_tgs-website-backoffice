import { fetcher } from "../fetcher.js"
import { host } from "../host.js"

const WalletApi = "/api/wallet"

export const list = async (playerCode) => {
  let url = `${WalletApi}/account-changes/player/${playerCode}?&page=1&rows=20`
  let response = await fetcher.get(url)
  let result = await response.json()
  return result
}

export const unsaved = async (playerCode) => {
  let url = `${WalletApi}/account-changes/player/waiting/${playerCode}?&page=1&rows=20`

  let response = await fetcher.get(url)
  let result = await response.json()
  return result
}
