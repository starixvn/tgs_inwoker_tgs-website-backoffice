import useSWR, { cache } from "swr"
import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"

const API = "/api/GameProvider"

export const useGameProviderList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}

export const useSubGameProviderList = (gameProviderId, searchParams) => {
  return useGameProviderList(searchParams)

  let url =
    gameProviderId && searchParams
      ? urlWith(searchParams, `API/${gameProviderId}`)
      : ""
  return useGet(url)
}

export const useGameProvider = (id) => {
  let url = id ? `${API}/${id}` : undefined
  let { data, ...rest } = useGet(url)
  return {
    data: data?.gameProvider,
    ...rest
  }
}

export const useAddGameProvider = (data) => {
  return usePostData(API, data)
}

export const useAddSubGameProvider = (gameProviderId, data) => {
  let url = gameProviderId ? `${API}/${gameProviderId}` : ""
  return usePostData(url, data)
}

export const useUpdateGameProvider = (id, data) => {
  let url = id ? `${API}/${id}` : ""
  return usePutData(url, data)
}

export const useUpdateSubGameProvider = (id, data) => {
  let url = id ? `${API}/subGameProvider/${id}` : ""
  return usePutData(url, data)
}

export const useChangeGameProviderStatus = (id, status) => {
  let url = id && status ? `${API}/${id}/${status}` : ""
  return usePut(url)
}

export const useUploadGameProviderLocalizationList = (body) => {
  let url = body ? `${API}/localization/upload` : undefined
  return usePostFormData(url, body)
}
