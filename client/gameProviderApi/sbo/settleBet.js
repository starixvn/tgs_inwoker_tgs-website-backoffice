import fetcher from "../../fetcher.js"
import { host } from "./host.js"
import { prefix } from "./api.js"
import { nanoid } from "nanoid"
import { formatISO } from "date-fns"
import { CompanyKey } from "./key.js"

const Win = 0
const Loss = 1
const Tie = 2

export const SettleBetType = {
  Win,
  Loss,
  Tie
}

export const settleBet = async ({
  playerCode,
  transferCode,
  winloss,
  resultType,
  resultTime = formatISO(new Date()),
  commissionStake = 0,
  gameResult = null,
  productType = 1,
  gameType = 1,
  gpid = -1
} = {}) => {
  //TODO: use baseURL instead?
  let url = `${host}${prefix}/settle`

  let payload = {
    transferCode,
    winloss,
    resultType,
    resultTime,
    commissionStake,
    gameResult,
    companyKey: CompanyKey,
    userName: playerCode,
    productType,
    gameType,
    gpid
  }

  let result = await fetcher(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    }
  })

  return result
}
