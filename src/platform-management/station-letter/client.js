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

const API = "/api/stationletter"

export const useStationLetterList = (searchParams = {}) => {
  let url = urlWith(searchParams, API)
  return useGet(url)
}

export const useVerifyStationLetter = ({ id, type, data } = {}) => {
  let url = id && type ? `${API}/${id}/${type}` : undefined
  return usePutData(url, data)
}

export const useAddStationLetter = (data) => {
  return usePostData(API, data)
}

export const useStationLetterUpload = (body) => {
  let url = body ? `${API}/upload` : ""
  return usePostFormData(url, body)
}

export const useChangeStationLetterStatus = (id, status) => {
  let url = id && status ? `${API}/${id}/status/${status}` : ""

  return usePut(url)
}

export const useDeleteStationLetter = (id) => {
  return useChangeStationLetterStatus(id, "Archived")
}
