import {
  urlWith,
  useGet,
  usePostData,
  usePutData,
  useDelete,
  usePostFormData
} from "../../client"

const API = "/api/RoundReport"

export const useGameOpenedRoundList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, `${API}/closedRounds`) : ""
  return useGet(url)
}

export const useSettleOpendRound = (roundId, data) => {
  let url = roundId && data ? `${API}/${roundId}/CloseGameRound` : ""
  return usePutData(url, data)
}
