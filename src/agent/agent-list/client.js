import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  useDelete,
  usePatchData
} from "../../client"
import { isEmpty, isNil, isBoolean } from "lodash-es"
import { either } from "ramda"
import { useApiMerge } from "../../client/useApiMerge."
import {
  isAgentProfitSharingMultipleLayer,
  isAgentProfitSharingOneLayer
} from "../AgentProfitSharingType"

let isNilOrEmpty = either(isNil, isEmpty)

let API = "/api/agent"

export const useAgentList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}

export const useAgent = (id, options) => {
  let url = id ? `${API}/${id}` : ""
  let { data, ...rest } = useGet(url, options)
  return {
    data: data?.agent,
    ...rest
  }
}

export const useAgentOneLayerProfitSharingPercentage = (
  brandId,
  agentUsername
) => {
  let url =
    brandId && agentUsername
      ? `${API}/dividendPercentage/${brandId}/${agentUsername}`
      : ""
  return useGet(url)
}

export const useAddAgent = (formData) => {
  let url = formData ? API : ""
  return usePostData(url, formData)
}

export const useUpdateAgent = (agentId, data) => {
  let url = agentId ? `${API}/${agentId}` : ""
  return usePutData(url, data)
}

const UpdateAgentFormDataField = {
  Info: "info",
  Status: "status",
  NegativeDividend: "negativeAgentDividendCarryForward",
  OneLayer: "oneLayer",
  MultipleLayer: "multipleLayer"
}

export const useAgentUpdateFormData = (data, agentProfitSharingType) => {
  if (isNil(data)) {
    return data
  }

  //TODO: rm negativeAgentDividendCarryForward
  let {
    type,
    parentUsername,
    dividendPercentage,
    agentDividendConditions,
    status,

    negativeAgentDividendCarryForward,

    realName,
    remarks
  } = data

  let formData = {
    info: { realName, remarks },
    status: isNilOrEmpty(status) ? null : { status },
    negativeAgentDividendCarryForward: isBoolean(
      negativeAgentDividendCarryForward
    )
      ? { negativeAgentDividendCarryForward }
      : null
  }

  if (isAgentProfitSharingOneLayer(agentProfitSharingType)) {
    Reflect.set(formData, UpdateAgentFormDataField.OneLayer, {
      type,
      parentUsername,
      dividendPercentage
    })
  }

  if (isAgentProfitSharingMultipleLayer(agentProfitSharingType)) {
    Reflect.set(formData, UpdateAgentFormDataField.MultipleLayer, {
      type,
      parentUsername,
      agentDividendConditions
    })
  }

  return formData
}

export const useUpdateAgentV2 = (agentId, data) => {
  let items = [
    useUpdateAgentInfo(
      agentId,
      data && Reflect.get(data, UpdateAgentFormDataField.Info)
    ),
    useUpdateAgentStatus(
      agentId,
      data && Reflect.get(data, UpdateAgentFormDataField.Status)
    ),
    /*
    TODO: rm
    useUpdateAgentNegativeDividend(
      agentId,
      data && Reflect.get(data, UpdateAgentFormDataField.NegativeDividend)
    ),
    */
    useUpdateAgentOneLayer(
      agentId,
      data && Reflect.get(data, UpdateAgentFormDataField.OneLayer)
    ),
    useUpdateAgentMultipleLayer(
      agentId,
      data && Reflect.get(data, UpdateAgentFormDataField.MultipleLayer)
    )
  ]

  return useApiMerge(items)
}

export const useUpdateAgentInfo = (agentId, data) => {
  let url = agentId && data ? `${API}/info/${agentId}` : ""

  return usePatchData(url, data, {
    dropEmptyValuesDisabled: true
  })
}

export const useUpdateAgentStatus = (agentId, data) => {
  let url = agentId && data ? `${API}/status/${agentId}` : ""

  return usePatchData(url, data, {
    dropEmptyValuesDisabled: true
  })
}

export const useUpdateAgentNegativeDividend = (agentId, data, options) => {
  let url =
    agentId && data
      ? `${API}/negative-agent-dividend-carry-forward/${agentId}`
      : ""

  return usePatchData(url, data, {
    dropEmptyValuesDisabled: true,
    ...options
  })
}

export const useUpdateAgentOneLayer = (agentId, data) => {
  let url = agentId && data ? `${API}/one-layer/${agentId}` : ""

  return usePatchData(url, data, {
    dropEmptyValuesDisabled: true
  })
}

export const useUpdateAgentMultipleLayer = (agentId, data) => {
  let url = agentId && data ? `${API}/multiple-layer/${agentId}` : ""

  return usePatchData(url, data, {
    dropEmptyValuesDisabled: true
  })
}

export const useUpdateAgentContact = (agentId, data) => {
  let url = agentId && data ? `${API}/contact/${agentId}` : ""

  return usePatchData(url, data, {
    dropEmptyValuesDisabled: true
  })
}

export const useUpdateAgentLoginPassword = (agentId, password) => {
  let url = agentId && password ? `${API}/password/${agentId}/${password}` : ""
  return usePatchData(url)
}

export const useUpdateAgentWithdrawPassword = (data) => {
  let url = data ? `${API}/pay-password` : ""
  return usePatchData(url, data)
}

export const useAddAgentBank = (agentId, data) => {
  let url = agentId && data ? `${API}/${agentId}/bank` : ""
  return usePostData(url, data)
}

export const useUpdateAgentBank = (id, data) => {
  let url = id && data ? `${API}/bank/${id}` : ""
  return usePutData(url, data)
}

export const useDeleteAgentBank = (id) => {
  let url = id ? `${API}/bank/${id}` : ""
  return useDelete(url)
}

export const useAgentHistoryList = (agentId, searchParams) => {
  let url = agentId ? urlWith(searchParams, `${API}/histories/${agentId}`) : ""
  return useGet(url)
}

export const useAgentHistory = (eventId) => {
  let url = eventId ? `${API}/history/${eventId}` : ""
  return useGet(url)
}

export const useAgentOperations = (agentId, searchParams) => {
  let url = agentId ? urlWith(searchParams, `${API}/${agentId}/operations`) : ""
  return useGet(url)
}

//TODO: 1.40 use new api?
export const useAgentBalanceChanges = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, `${API}/accountChanges`) : ""
  return useGet(url)
}

export const useAgentDomainList = (brandId, agentId) => {
  let url = brandId && agentId ? `${API}/domain/${brandId}/${agentId}` : ""
  let { data, ...rest } = useGet(url)
  return {
    data: data?.data,
    ...rest
  }
}

export const useAddAgentDomain = (brandId, agentId, domain) => {
  let url =
    brandId && agentId && domain
      ? `${API}/domain/${brandId}/${agentId}?domain=${domain}`
      : ""
  return usePut(url)
}

export const useDeleteAgentDomain = (brandId, agentId, domain) => {
  let url =
    brandId && agentId && domain
      ? `${API}/domain/${brandId}/${agentId}?domain=${domain}`
      : ""
  return useDelete(url)
}

export const useClearAgentProfitShare = (id) => {
  let url = id ? `${API}/${id}/clear-negative-commission` : ""
  return usePut(url)
}

const DomainSettingApi = "/api/DomainSetting"
export const useApplyAgentIngress = (agentId) => {
  let url = agentId ? `${DomainSettingApi}/ingress/${agentId}` : ""
  return usePut(url)
}

export const useDeleteAgentIngress = (agentId) => {
  let url = agentId ? `${DomainSettingApi}/ingress/${agentId}` : ""
  return useDelete(url)
}

export const useCreateAgentDnsZone = (agentId) => {
  let url = agentId ? `${DomainSettingApi}/dns-zone/${agentId}` : ""
  return usePut(url)
}

export const useDeleteAgentDnsZone = (agentId) => {
  let url = agentId ? `${DomainSettingApi}/dns-zone/${agentId}` : ""
  return useDelete(url)
}
