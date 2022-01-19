import fetcher from "../../fetcher.js"
import { host } from "./host.js"
import { prefix } from "./api.js"
import { nanoid } from "nanoid"
import { formatISO } from "date-fns"
import { CompanyKey } from "./key.js"
import { settleBet, SettleBetType } from "./settleBet.js"
import { random } from "lodash-es"

export const placeBet = async ({
  playerCode,
  amount,
  transferCode,
  transactionId,
  betTime = formatISO(new Date()),
  gameRoundId = "null",
  gamePeriodId,
  orderDetail,
  playerIp = "1.2.3.4",
  gameTypeName,
  productType = 1,
  gameType = 1,
  gpid = -1
} = {}) => {
  //TODO: use baseURL instead?
  let url = `${host}${prefix}/deduct`

  let id = nanoid()
  if (!transferCode) {
    transferCode = id
  }
  if (!transactionId) {
    transactionId = id
  }

  let payload = {
    amount,
    transferCode,
    transactionId,
    betTime,
    companyKey: CompanyKey,
    userName: playerCode,
    gameRoundId,
    gamePeriodId,
    orderDetail,
    playerIp,
    gameTypeName,
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

  return {
    ...result,
    externalRoundId: transferCode
  }
}

const WinLossStep = 0.01
export const placeWinBet = async ({
  amount,
  winloss,
  resultType = SettleBetType.Win,
  ...props
}) => {
  if (!Number.isFinite(winloss)) {
    winloss = random(amount + WinLossStep, amount * 10, true)
  }

  let placeBetResult = await placeBet({ amount, ...props })
  return settleBet({
    transferCode: placeBetResult.externalRoundId,
    winloss,
    resultType,
    ...props
  })
}

export const placeLoseBet = async ({
  amount,
  winloss,
  resultType = SettleBetType.Loss,
  ...props
}) => {
  if (!Number.isFinite(winloss)) {
    winloss = 0 //random(0, amount - WinLossStep, true)
  }

  let placeBetResult = await placeBet({ amount, ...props })
  return settleBet({
    transferCode: placeBetResult.externalRoundId,
    winloss,
    resultType,
    ...props
  })
}

export const placeTieBet = async ({
  amount,
  winloss,
  resultType = SettleBetType.Tie,
  ...props
}) => {
  if (!Number.isFinite(winloss)) {
    winloss = amount
  }

  let placeBetResult = await placeBet({ amount, ...props })
  return settleBet({
    transferCode: placeBetResult.externalRoundId,
    winloss,
    resultType,
    ...props
  })
}
