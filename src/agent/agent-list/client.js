import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  useDelete
} from "../../client"

let API = "/api/agent"

export const useAgentList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}

export const useAgent = (id) => {
  let url = id ? `${API}/${id}` : ""
  let { data, ...rest } = useGet(url)
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

export const useAddAgentBank = (agentId, data) => {
  let url = agentId ? `${API}/${agentId}/bank` : ""
  return usePostData(url, data)
}

export const useUpdateAgentBank = (id, data) => {
  let url = id ? `${API}/bank/${id}` : ""
  return usePutData(url, data)
}

export const useDeleteAgentBank = (id) => {
  let url = id ? `${API}/bank/${id}` : ""
  return useDelete(url)
}

export const useAgentOperations = (agentId, searchParams) => {
  let url = agentId ? urlWith(searchParams, `${API}/${agentId}/operations`) : ""
  return useGet(url)
}

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
