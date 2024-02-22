import { boolean } from "boolean"
import {
  urlWith,
  useGet,
  usePostData,
  usePost,
  usePut,
  usePutData,
  useDelete,
  usePatchData
} from "../../client"
import { useApiMerge } from "../../client/useApiMerge."
import { isEmpty, isNil, isBoolean } from "lodash-es"
import { either } from "ramda"

let isNilOrEmpty = either(isNil, isEmpty)

export let API = "/api/player"

export const usePlayerList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}

export const usePlayer = (playerCode) => {
  let url = playerCode ? `${API}/${playerCode}` : ""
  let { data, ...rest } = useGet(url)
  return {
    data: data?.player,
    ...rest
  }
}

export const useEditPlayerInfo = (playerCode, data) => {
  let url = playerCode ? `${API}/${playerCode}/info` : ""
  return usePutData(url, data)
}

const UpdatePlayerFormDataField = {
  Info: "info",
  Status: "status",
  Agent: "agent",
  AllAgentPlayer: "allAgentPlayer"
}

export const toUpdatePlayerFormData = (data) => {
  if (isNil(data)) {
    return data
  }

  let {
    status,
    agentUsername,
    parentUsername: parentPlayerUsername,
    ...info
  } = data

  if (isBoolean(info.vipLevelAutoState)) {
    info.vipLevelAutoState = info.vipLevelAutoState?.toString()
  }

  return {
    info,
    status: isNilOrEmpty(status) ? null : { status },
    agent: isNil(agentUsername) ? null : { agentUsername },
    allAgentPlayer: isNilOrEmpty(parentPlayerUsername)
      ? null
      : { parentPlayerUsername }
  }
}

export const useUpdatePlayer = (playerCode, data) => {
  let items = [
    useUpdatePlayerInfo(
      playerCode,
      data && Reflect.get(data, UpdatePlayerFormDataField.Info)
    ),
    useUpdatePlayerStatus(
      playerCode,
      data && Reflect.get(data, UpdatePlayerFormDataField.Status)
    ),
    useUpdatePlayerAgent(
      playerCode,
      data && Reflect.get(data, UpdatePlayerFormDataField.Agent)
    ),
    useUpdatePlayerAllAgentPlayer(
      playerCode,
      data && Reflect.get(data, UpdatePlayerFormDataField.AllAgentPlayer)
    )
  ]

  return useApiMerge(items)
}

export const useUpdatePlayerInfo = (playerCode, data) => {
  let url = playerCode && data ? `${API}/info/${playerCode}` : ""

  return usePatchData(url, data, {
    dropEmptyValuesDisabled: true,
    dedupingInterval: 100
  })
}

export const useUpdatePlayerStatus = (playerCode, data) => {
  let url = playerCode && data ? `${API}/status/${playerCode}` : ""
  return usePatchData(url, data, {
    dropEmptyValuesDisabled: true,
    dedupingInterval: 100
  })
}

export const useUpdatePlayerAgent = (playerCode, data) => {
  let url = playerCode && data ? `${API}/agent/${playerCode}` : ""
  return usePatchData(url, data, {
    dropEmptyValuesDisabled: true,
    dedupingInterval: 100
  })
}

export const useUpdatePlayerAllAgentPlayer = (playerCode, data) => {
  let url = playerCode && data ? `${API}/parent-player/${playerCode}` : ""
  return usePatchData(url, data, {
    dropEmptyValuesDisabled: true,
    dedupingInterval: 100
  })
}

export const useUpdatePlayerContact = (playerCode, data) => {
  let url = playerCode && data ? `${API}/contact/${playerCode}` : ""
  return usePatchData(url, data, {
    dropEmptyValuesDisabled: true,
    dedupingInterval: 100
  })
}

export const useAddPlayerBank = (playerCode, data) => {
  let url = playerCode ? `${API}/${playerCode}/bank` : ""
  return usePostData(url, data)
}

export const useEditPlayerBank = ({ playerCode, id } = {}, data) => {
  let url = playerCode && id ? `${API}/${playerCode}/bank/${id}` : ""
  return usePutData(url, data)
}

export const useDeletePlayerBank = (playerCode, id) => {
  let url = playerCode && id ? `${API}/${playerCode}/bank/${id}` : ""
  return useDelete(url)
}

export const useSetDefaultPlayerBank = (playerCode, id) => {
  let url = playerCode && id ? `${API}/${playerCode}/bank/${id}/default` : ""
  return usePut(url)
}

export const useUpdatePlayerPassword = (playerCode, password) => {
  let url =
    playerCode && password ? `${API}/password/${playerCode}/${password}` : ""
  return usePatchData(url)
}

export const useOperations = (playerCode, searchParams) => {
  let url = playerCode
    ? urlWith(searchParams, `${API}/${playerCode}/operations`)
    : ""
  return useGet(url)
}

export const usePlayerHistoryList = (playerCode, searchParams) => {
  let url = playerCode
    ? urlWith(searchParams, `${API}/histories/${playerCode}`)
    : ""
  return useGet(url)
}

export const usePlayerHistory = (eventId) => {
  let url = eventId ? `${API}/history/${eventId}` : ""
  return useGet(url)
}

export const useBettings = (playerCode, searchParams) => {
  let url = playerCode
    ? urlWith(searchParams, `${API}/${playerCode}/bettings`)
    : ""
  return useGet(url)
}

//TODO:1.41 use new api?
export const usePlayerBalanceChanges = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, `${API}/accountChanges`) : ""
  return useGet(url)
}

const WalletApi = "/api/wallet"
export const usePlayerBalanceChangeUnsaved = (playerCode, searchParams) => {
  let url =
    playerCode && searchParams
      ? urlWith(
          searchParams,
          `${WalletApi}/account-changes/player/waiting/${playerCode}`
        )
      : ""
  return useGet(url)
}

export const usePlayerBalanceChangeTotalAmount = (searchParams) => {
  let url = searchParams
    ? urlWith(searchParams, `${API}/accountChanges/totalAmount`)
    : ""
  return useGet(url)
}

export const usePlayerPromotions = (playerCode, searchParams) => {
  let url =
    playerCode && searchParams
      ? urlWith(searchParams, `${API}/${playerCode}/joinedPromotions`)
      : ""
  return useGet(url)
}

export const usePlayerTransferWalletList = (playerCode) => {
  let url = playerCode ? `${API}/${playerCode}/transferwallet` : ""

  return useGet(url)
}

export const usePlayerTransferAllToMainWallet = (playerCode) => {
  let url = playerCode ? `${API}/${playerCode}/fundin/all` : ""
  return usePostData(url, !!playerCode)
}

export const usePlayerTransferToMainWallet = (formData) => {
  let url = formData?.playerCode ? `${API}/${formData?.playerCode}/fundin/` : ""
  return usePostData(url, formData)
}

export const usePlayerMainWallet = (playerCode) => {
  let url = playerCode ? `${API}/${playerCode}/mainwallet` : ""

  return useGet(url)
}

const PlayerIdentityApi = "/api/playeridentity"
export const usePlayerIdentity = (playerCode) => {
  let url = playerCode ? `${PlayerIdentityApi}/${playerCode}/identity` : ""
  return useGet(url)
}

export const useVerifyPlayerID = (formId, data) => {
  let url = formId ? `${PlayerIdentityApi}/${formId}` : ""
  return usePostData(url, data)
}

const PlayerBucketApi = "/api/player/bucket"
export const useClearPlayerWageringRequirement = (playerCode) => {
  let url = playerCode ? `${PlayerBucketApi}/${playerCode}` : ""
  return useDelete(url)
}

export const usePlayerBucketList = (playerCode) => {
  let url = playerCode ? `${PlayerBucketApi}/type/amount/${playerCode}` : ""
  return useGet(url)
}

export const usePlayerBucketAmount = (playerCode) => {
  let url = playerCode ? `${PlayerBucketApi}/amount/${playerCode}` : ""
  return useGet(url)
}

export const usePlayerBucketItems = (
  playerCode,
  bucketType = "",
  searchParams
) => {
  let url = playerCode
    ? urlWith(
        searchParams,
        `${PlayerBucketApi}/${playerCode}${bucketType ? `/${bucketType}` : ""}`
      )
    : ""
  return useGet(url)
}

export const usePlayerWageringRequirementList = (playerCode, searchParams) => {
  let url =
    playerCode && searchParams
      ? urlWith(searchParams, `${PlayerBucketApi}/${playerCode}`)
      : ""
  return useGet(url)
}

export const usePlayerCompletedWageringList = (bucketId, searchParams) => {
  let url =
    bucketId && searchParams
      ? urlWith(searchParams, `${PlayerBucketApi}/history/${bucketId}`)
      : ""
  return useGet(url)
}

export const usePlayerAutoClearBucketList = (playerCode, status, options) => {
  let url = ""
  if (playerCode) {
    url = `${PlayerBucketApi}/clean-form/${playerCode}`

    if (status) {
      url = `${url}/${status}`
    }
  }

  return useGet(url, options)
}

const PlayerManualDepositApi = "/api/ManualDeposit"
export const useApplyPlayerManualDeposit = (bankType, data) => {
  let url = bankType && data ? `${PlayerManualDepositApi}/${bankType}` : ""
  return usePutData(url, data)
}

const PlayerPromotionApi = "/api/Promotion"
export const usePlayerPromotionList = (searchParams) => {
  let url = searchParams
    ? urlWith(searchParams, `${PlayerPromotionApi}/player`)
    : ""
  return useGet(url)
}

const PlayerWithdrawApi = "/api/Withdraw"
export const useApplyPlayerWithdraw = (data) => {
  let url = data ? `${PlayerWithdrawApi}/player` : ""
  return usePostData(url, data)
}

export const usePlayerVipChangeList = (playerCode, searchParams) => {
  let url =
    playerCode && searchParams?.brandId
      ? urlWith(searchParams, `${API}/vipAdjustInfos/${playerCode}`)
      : ""
  return useGet(url)
}

export const usePlayerPayment = (playerCode) => {
  let url = playerCode ? `${API}/payment/${playerCode}` : ""
  return useGet(url)
}

export const useUpgradePlayerToAgent = (playerCode) => {
  let url = playerCode ? `${API}/upgrade/${playerCode}/agent` : ""
  return usePost(url)
}
