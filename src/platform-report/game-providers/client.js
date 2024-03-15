import useSWR, { cache } from "swr"
import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"
import { sortBy, groupBy } from "lodash"
import { groupWith, eqProps, propEq } from "ramda"
import clone from "clone-deep"
import { isDev } from "../../env"

//TODO: use new api instead
export const API = "/api/BrandGameProviderReport"

//TODO: use new api instead
export const useGameProviderReportList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, API) : ""
  let { data, ...rest } = useGet(url)
  /*
  if (data) {
    data = {
      items: [
        {
          gameProviderId: "b7b3d9b9-bc4c-4170-a37f-dceb08d403e7",
          gameProviderName: "365",
          currencyCode: "CNY",
          transactionCount: 1,
          betAmount: 10.0,
          validBetAmount: 9.7,
          originalTurnover: 9.7,
          companyWinLoss: -9.7
        },
        {
          gameProviderId: "1d7c7c2f-b996-42ac-83e0-a0c1a622e088",
          gameProviderName: "Endorphina",
          currencyCode: "CNY",
          transactionCount: 10,
          betAmount: 1.0,
          validBetAmount: 1.0,
          originalTurnover: 1.0,
          companyWinLoss: 1.0
        },
        {
          gameProviderId: "febf10f7-a217-4349-bcc6-38c46c230de6",
          gameProviderName: "JILI",
          currencyCode: "CNY",
          transactionCount: 6,
          betAmount: 255.4,
          validBetAmount: 255.4,
          originalTurnover: 255.4,
          companyWinLoss: -407.5
        },
        {
          gameProviderId: "a0f49ce0-2c1d-4f50-9fc5-58b610a30bf5",
          gameProviderName: "KY",
          currencyCode: "CNY",
          transactionCount: 4,
          betAmount: 351.0,
          validBetAmount: 351.0,
          originalTurnover: 351.0,
          companyWinLoss: 351.0
        },
        {
          gameProviderId: "6214260a-cf3c-4fb5-ba78-9214fe5608bf",
          gameProviderName: "PGSoft",
          currencyCode: "CNY",
          transactionCount: 838,
          betAmount: 440.0,
          validBetAmount: 440.0,
          originalTurnover: 440.0,
          companyWinLoss: 121.2
        },
        {
          gameProviderId: "e4ecfa98-b373-4123-87e0-cb9e883d0691",
          gameProviderName: "PragmaticPlay",
          currencyCode: "CNY",
          transactionCount: 24,
          betAmount: 133.0,
          validBetAmount: 133.0,
          originalTurnover: 133.0,
          companyWinLoss: 83.6
        },
        {
          gameProviderId: "710cfc5d-3e17-4092-b067-a690d9ec598c",
          gameProviderName: "Sexy Gaming",
          currencyCode: "CNY",
          transactionCount: 1,
          betAmount: 20.0,
          validBetAmount: 20.0,
          originalTurnover: 20.0,
          companyWinLoss: -20.0
        },
        {
          gameProviderId: "51b1411f-4460-4369-b552-9d2e31b598b4",
          gameProviderName: "Venus",
          currencyCode: "CNY",
          transactionCount: 1,
          betAmount: 20.0,
          validBetAmount: 20.0,
          originalTurnover: 20.0,
          companyWinLoss: -20.0
        }
      ],
      totalCount: 8,
      totals: [
        {
          currencyCode: "CNY",
          transactionCount: 885,
          betAmount: 1230.4,
          validBetAmount: 1230.1,
          originalTurnover: 1230.1,
          companyWinLoss: 99.6
        }
      ]
    }
  }
  */
  return {
    data,
    ...rest
  }
}
