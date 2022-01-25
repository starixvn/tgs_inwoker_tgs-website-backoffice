import {
  urlWith,
  useGet,
  usePostData,
  usePutData,
  useDelete,
  usePostFormData
} from "../../client"

const API = "/api/Round"

export const useOpenGameRoundList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, `${API}/openRounds`) : ""
  return useGet(url)
}

export const useCloseGameOpenRound = (roundId, data) => {
  let url = roundId && data ? `${API}/${roundId}/CloseGameRound` : ""
  return usePutData(url, data)
}
