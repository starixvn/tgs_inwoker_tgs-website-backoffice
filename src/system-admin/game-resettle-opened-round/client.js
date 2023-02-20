import {
  urlWith,
  useGet,
  usePostData,
  usePutData,
  useDelete,
  usePostFormData
} from "../../client"

const ReportAPI = "/api/RoundReport"
export const useGameOpenedRoundList = (searchParams) => {
  let url = searchParams?.externalRoundId
    ? urlWith(searchParams, `${ReportAPI}/closedRounds`)
    : ""
  return useGet(url)
}

const RoundApi = "/api/round"
export const useResettleOpenedRound = (roundId, data) => {
  let url = roundId && data ? `${RoundApi}/${roundId}/adjustclosedround` : ""
  return usePutData(url, data)
}
