import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  useDelete,
  usePatchData
} from "../../client"
import { useApiMerge } from "../../client/useApiMerge."
import { faker } from "@faker-js/faker"
import { isEmpty, isNil } from "lodash-es"
import { either } from "ramda"

const TransactionType = [
  "BonusAdjust",
  "CompanyAdjust",
  "AgentAdjust",
  "SystemAdjust",
  "TransferAdjust",
  "Deposit",
  "Withdrawal",
  "WithdrawLock",
  "WithdrawCommit",
  "Transfer",
  "TransferRollback",
  "ReceiveCommit",
  "ReceiveRollback"
]

const WalletApi = "/api/wallet"
export const usePlayerBalanceChangeUnsaved = (playerCode, searchParams) => {
  let url =
    playerCode && searchParams
      ? urlWith(
          searchParams,
          `${WalletApi}/account-changes/player/waiting/${playerCode}`
        )
      : ""
  let items = Array.from({ length: 20 }, (x, index) => {
    return {
      transactionId: faker.string.uuid(),
      amount: faker.number.int({ min: 0, max: 100 }),
      lockAmount: faker.number.int({ min: 0, max: 100 }),
      balance: faker.number.int({ min: 0, max: 100 }),
      lockedBalance: faker.number.int({ min: 0, max: 100 }),
      transactionType:
        TransactionType[
          faker.number.int({
            min: 0,
            max: TransactionType.length - 1
          })
        ],
      recordedOn: "2024-01-30T02:27:35.6137341Z",
      includeInNetProfit: faker.datatype.boolean(),
      externalTransactionId: faker.string.uuid()
    }
  })

  let { data, ...rest } = useGet(url)
  data = {
    items,
    totalCount: 35,
    errors: [],
    message: "",
    valid: true
  }

  return {
    data,
    ...rest
  }
}
