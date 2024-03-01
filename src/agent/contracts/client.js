import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  useDelete,
  usePatchData
} from "../../client"

const API = "/api/BrandContract"

export const usePlatformContracts = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}

export const useAddPlatformContract = (formData) => {
  let url = formData ? API : ""
  return usePostData(url, formData)
}
