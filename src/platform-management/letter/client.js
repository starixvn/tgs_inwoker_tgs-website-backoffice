import useSWR, { cache } from "swr"
import client, {
  urlWith,
  get,
  put,
  post,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"

const API = "/api/station-letter"

export const useLetterList = ({ brandId, ...searchParams } = {}) => {
  let url = brandId ? urlWith(searchParams, `${API}/${brandId}`) : ""
  return useGet(url)
}
