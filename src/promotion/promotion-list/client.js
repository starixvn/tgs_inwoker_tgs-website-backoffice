import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  useDelete,
  usePostFormData,
  useHead,
  usePatchData
} from "../../client"
import {
  useSystemSetting,
  useSystemSettingValue
} from "../../system-admin/setting/client"

let API = "/api/promotion"

export const usePromotionList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}

export const usePromotionMainInfo = (id) => {
  let url = id ? `${API}/main/${id}` : ""
  return useGet(url)
}

export const useUpdatePromotionMainInfo = (promotionId, data) => {
  let url = promotionId && data ? `${API}/main/${promotionId}` : ""
  return usePatchData(url, data)
}

export const usePromotionContent = (id) => {
  let url = id ? `${API}/content/${id}` : ""
  return useGet(url)
}

export const useUpdatePromotionContent = (promotionId, data) => {
  let url = promotionId && data ? `${API}/content/${promotionId}` : ""
  return usePatchData(url, data)
}

export const usePromotionRule = (id) => {
  let url = id ? `${API}/rule/${id}` : ""
  return useGet(url)
}

export const useUpdatePromotionRule = (promotionId, data) => {
  let url = promotionId && data ? `${API}/rule/${promotionId}` : ""
  return usePatchData(url, data)
}

const OfflineLoginRewardApi = "/api/offline-login-reward"
export const useAddOfflineLoginRewardPromotion = (data) => {
  let url = data?.brandId
    ? `${OfflineLoginRewardApi}/${data.brandId}:create`
    : ""

  return usePutData(url, data)
}

const OfflineDepositRewardApi = "/api/offline-deposit-reward"
export const useAddOfflineDepositRewardPromotion = (data) => {
  let url = data?.brandId
    ? `${OfflineDepositRewardApi}/${data.brandId}:create`
    : ""
  return usePutData(url, data)
}

export const useAddPromotion = (data) => {
  switch (data?.promotionType) {
    case "OfflineLoginReward":
      return useAddOfflineLoginRewardPromotion(data)
    case "OfflineDepositReward":
      return useAddOfflineDepositRewardPromotion(data)
  }
  return usePostData(API, data)
}

export const useUpdatePromotion = (promotionId, data) => {
  /*
  let {
    isLoading: isLoadingMainInfo,
    error: mainInfoError,
    result: mainInfoResult,
    mutate: mutateMainInfo,
    deleteCache: deleteMainInfoCache
  } = useUpdatePromotionMainInfo(promotionId, data)
  let {
    isLoading: isLoadingContent,
    error: contentError,
    result: contentResult,
    mutate: mutateContent,
    deleteCache: deleteContentCache
  } = useUpdatePromotionContent(promotionId, data)
  let {
    isLoading: isLoadingRule,
    error: ruleError,
    result: ruleResult,
    mutate: mutateRule,
    deleteCache: deleteRuleCache
  } = useUpdatePromotionRule(promotionId, data)

  return {
    isLoading: isLoadingMainInfo || isLoadingContent || isLoadingRule,
    error: mainInfoError || contentError || ruleError,
    result: mainInfoResult && contentResult && ruleResult,
    mutate: (_, shouldRevalidate) => {
      mutateMainInfo(_, shouldRevalidate)
      mutateContent(_, shouldRevalidate)
      mutateRule(_, shouldRevalidate)
    },
    deleteCache: () => {
      deleteMainInfoCache()
      deleteContentCache()
      deleteRuleCache()
    }
  }
  */

  /*
  TODO: rm old update promotion api?
  */
  let url = promotionId ? `${API}/${promotionId}` : ""
  return usePutData(url, data)
}

export const useChangePromotionStatus = (id, status) => {
  let url = id && status ? `${API}/${id}/${status}` : ""

  return usePut(url)
}

export const useDeletePromotion = (id) => {
  return useChangePromotionStatus(id, "Archived")
}

export const useChangePromotionOrders = (data) => {
  let url = `${API}/changeorders`
  return usePutData(url, data)
}

export const useChangeLogList = (promotionId) => {
  let url = promotionId ? `${API}/history/${promotionId}` : ""

  return useGet(url)
}

export const useChangeLogDetail = (promotionId, eventId) => {
  let url =
    promotionId && eventId
      ? `${API}/history/detail/${promotionId}/${eventId}`
      : ""

  return useGet(url)
}

let OfflineApi = "/api/offline"
export const usePromotionBatchUploadPlayerList = (
  brandId,
  clientId,
  formData
) => {
  let url =
    brandId && clientId && formData
      ? `${OfflineApi}/${brandId}/${clientId}`
      : ""
  return usePostFormData(url, formData)
}

/*
export const PromotionBatchUploadPlayerListResult = {
  Done: "Done",
  Processing: "Processing"
}
*/

export const useIsPromotionBatchUploadPlayerListDone = (
  batchId,
  options = {}
) => {
  let url = batchId ? `${OfflineApi}/${batchId}` : ""
  return useHead(url, {
    toData: (data, response) => {
      let status = response.status
      if (status === 200) {
        //done
        return true
      }

      if (status === 202) {
        //processing
        return false
      }

      if (status === 204) {
        return null //no content
      }

      return data
    },
    ...options
  })
}
