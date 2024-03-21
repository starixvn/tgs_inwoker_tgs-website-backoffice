import {
  urlWith,
  get,
  put,
  post,
  useGet,
  usePut,
  usePostData,
  usePutData,
  usePostFormData
} from "../../client"

let API = "/api/PlayerIp"

export const useSamePlayerIPAddressList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}

export const usePlayerIPAddressListByIP = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, `${API}/Ip`) : ""
  return useGet(url)
}

export const usePlayerIPAddressListByUsername = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, `${API}/UserName`) : ""
  return useGet(url)
}
