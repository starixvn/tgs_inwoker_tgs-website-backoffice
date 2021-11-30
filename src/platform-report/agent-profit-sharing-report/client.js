import useSWR, { cache } from "swr"
import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"
import { groupWith, eqProps, propEq, compose, flatten } from "ramda"
import clone from "clone-deep"

export const API = "/api/AgentReport"

export const useAgentDividendList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, `${API}/dividends`) : ""
  return useGet(url)
}

export const useAgentDividendDetailList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, `${API}/dividendDetails`) : ""
  return useGet(url)
}

export const useAgentWinLossList = (id, searchParams) => {
  let url =
    id && searchParams ? urlWith(searchParams, `${API}/${id}/winLoss`) : ""
  return useGet(url)
}

const usingSettlementDates = compose(
  eqProps("settlementDate"),
  eqProps("settlementDateFrom"),
  eqProps("settlementDateTo")
)

export const useAgentTeamContributionList = (searchParams) => {
  let url = searchParams ? `${API}/dividendTeamDetails` : ""
  

  //TODO: implement & test
  let { data, ...rest } = useGet(url)

  let items = data?.datas?.items
    ? groupWith(usingSettlementDates, data.datas.items)
    : undefined

  items = items?.reduce?.((acc, groupedItems = [], index) => {
    let [item] = groupedItems

    let group = {
      isGroup: true,
      settlementDate: clone(item.settlementDate),
      settlementDateFrom: clone(item.settlementDateFrom),
      settlementDateTo: clone(item.settlementDateTo)
    }

    acc.push(group)

    return acc.concat(groupedItems)
  }, [])

  return {
    data: items
      ? {
          ...data.datas,
          items
        }
      : undefined,
    ...rest
  }
}
