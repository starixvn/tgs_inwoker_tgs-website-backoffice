import useSWR, { cache } from "swr"
import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"
//TODO: rm
import faker from "@faker-js/faker"

export const API = "/api/MarketReport"

export const useMarketReportList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}

export const usePlatformMarketReportAdditionalExpenseList = (searchParams) => {
  let url = searchParams
    ? urlWith(searchParams, `${API}/additionalExpenses`)
    : ""
  return useGet(url)
}

export const useMarketReportAgentProfitList = () => {
  let data = Array.from({ length: 12 }, (_, index) => {
    return {
      agentName: faker.name.firstName(),
      agentProfitPercentage: faker.datatype.number({ min: 0, max: 60 }),
      directPlayerNetProfit: faker.datatype.number({ min: 100, max: 200 }),
      teamNetProfit: faker.datatype.number({ min: 100, max: 200 }),
      agentNetProfit: faker.datatype.number({ min: 100, max: 200 }),
      companyAdjustment: faker.datatype.number({ min: 100, max: 200 }),
      companyProfit: faker.datatype.number({ min: 100, max: 200 })
    }
  })
  return {
    data: {
      items: data,
      totalCount: data.length
    },
    isLoading: false,
    error: null
  }
}
