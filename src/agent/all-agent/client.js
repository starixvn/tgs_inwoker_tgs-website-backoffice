import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  useDelete
} from "../../client"

let API = "/api/BrandAllAgent"

export const useAllAgentSetting = (brandId) => {
  let url = brandId ? urlWith(searchParams, `${API}/${brandId}`) : ""
  return useGet(url)
}
