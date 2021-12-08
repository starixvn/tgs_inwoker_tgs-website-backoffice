import fetcher from "./fetcher"
import faker from "faker"
import { globalApi, operatorApi, sboApi } from "./env"
import { nanoid } from "nanoid"
import formatISO from "date-fns/formatISO"

const companyKey = "34B2C4ED616F4E7B965EAE0861A3F92E"

export const placeBet = async ({
  playerCode,
  amount,
  transferCode = nanoid(),
  transactionId = nanoid(),
  betTime = formatISO(new Date()),
  gameRoundId = "null",
  gamePeriodId,
  orderDetail,
  playerIp = "1.2.3.4",
  gameTypeName,
  productType = 1,
  gameType = 1,
  gpid = -1
}) => {
  let url = `${sboApi()}/deduct`

  let payload = {
    amount,
    transferCode,
    transactionId,
    betTime,
    companyKey,
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
