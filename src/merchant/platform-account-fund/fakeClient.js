import useSWR, { cache } from "swr"
import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../../client"
import { isObject } from "lodash-es"
import { isAddFund, isDeductFund } from "./FundAction"
import { faker } from "@faker-js/faker"

const API = "/api/brandgamecredit"

export const usePlatformAccountFund = (brandId) => {
  let url = brandId ? `${API}/${brandId}/current` : ""
  let { isLoading, data, error, ...rest } = useGet(url)
  return {
    isLoading,
    data: isLoading
      ? null
      : {
          resellerId: "b5a2c708-ab70-4316-9f4d-5d2ad0e77460",
          resellerCode: "TGS",
          licenseeId: "66c5fef5-217b-4929-9a08-72c2479a8f4e",
          licenseeCode: "TGS",
          brandId: "4e86719f-243f-46f6-b010-5c758b7285af",
          brandCode: "GPI",
          month: "2023-12-01",
          initialAmount: 0,
          creditAmount: 1112,
          debitAmount: 1012,
          profitAmount: 0,
          creditLimit: 100,
          creditUsed: 0,
          creditUsedPer: 0,
          creditAvailable: 100,
          creditAvailablePer: 100,
          creditRiskType: "NormalRisk",
          createdOn: "2023-12-05T10:25:06.333385+00:00",
          updatedOn: "2023-12-15T09:25:10.592835+00:00"
        },
    error: null,
    ...rest
  }
}

export const usePlatformAccountFundHistory = (brandId) => {
  let { data, ...rest } = usePlatformAccountFund()
  if (isObject(data)) {
    data = [data]
  }
  return {
    data,
    ...rest
  }
}

export const useUpdatePlatformAccountFund = (brandId, type, formData) => {
  if (isAddFund(type)) {
    return useAddPlatformAccountFund(brandId, formData)
  } else if (isDeductFund(type)) {
    return useDeductPlatformAccountFund(brandId, formData)
  }

  let url = "" //empty
  return usePostData(url)
}

const TxApi = "/api/brandgamecredittxn"
export const useAddPlatformAccountFund = (brandId, formData) => {
  let url = brandId && formData ? `${TxApi}/${brandId}/credit` : ""
  return usePostData(url, formData)
}

export const useDeductPlatformAccountFund = (brandId, formData) => {
  let url = brandId && formData ? `${TxApi}/${brandId}/debit` : ""
  return usePostData(url, formData)
}

export const usePlatformAccountFundActionDetail = (brandId, searchParams) => {
  let url =
    brandId && searchParams
      ? urlWith(searchParams, `${TxApi}/${brandId}/query`)
      : ""
  let { data, error, ...rest } = useGet(url)
  data = {
    items: [
      {
        id: "018c7c56-1bdb-0000-0001-07e74458b267",
        resellerId: "b5a2c708-ab70-4316-9f4d-5d2ad0e77460",
        resellerCode: "TGS",
        licenseeId: "66c5fef5-217b-4929-9a08-72c2479a8f4e",
        licenseeCode: "TGS",
        brandId: "4e86719f-243f-46f6-b010-5c758b7285af",
        brandCode: "GPI",
        type: "Debit",
        money: 10.0,
        amount: 10.0,
        remark: "deduct 10",
        expansions: {},
        createdUserId: "50ce61eb-8c9d-4f84-3cf6-08d9262ce1a5",
        createdUsername: "admin.enabled",
        createdOn: "2023-12-18T09:51:07.228743+00:00"
      },
      {
        id: "018c7c4d-bd67-0000-0001-07e74458b267",
        resellerId: "b5a2c708-ab70-4316-9f4d-5d2ad0e77460",
        resellerCode: "TGS",
        licenseeId: "66c5fef5-217b-4929-9a08-72c2479a8f4e",
        licenseeCode: "TGS",
        brandId: "4e86719f-243f-46f6-b010-5c758b7285af",
        brandCode: "GPI",
        type: "Credit",
        money: 10.0,
        amount: 10.0,
        remark: "add 10",
        expansions: {},
        createdUserId: "50ce61eb-8c9d-4f84-3cf6-08d9262ce1a5",
        createdUsername: "admin.enabled",
        createdOn: "2023-12-18T09:41:58.761581+00:00"
      },
      {
        id: "018c62aa-8a07-0000-0001-07e752225b07",
        resellerId: "b5a2c708-ab70-4316-9f4d-5d2ad0e77460",
        resellerCode: "TGS",
        licenseeId: "66c5fef5-217b-4929-9a08-72c2479a8f4e",
        licenseeCode: "TGS",
        brandId: "4e86719f-243f-46f6-b010-5c758b7285af",
        brandCode: "GPI",
        type: "Credit",
        money: 1.0,
        amount: 1.0,
        remark: "test",
        expansions: {
          Name: "admin.enabled"
        },
        createdUserId: "50ce61eb-8c9d-4f84-3cf6-08d9262ce1a5",
        createdUsername: "admin.enabled",
        createdOn: "2023-12-13T10:13:12.839728+00:00"
      },
      {
        id: "018c62aa-5657-0000-0001-07e752225b07",
        resellerId: "b5a2c708-ab70-4316-9f4d-5d2ad0e77460",
        resellerCode: "TGS",
        licenseeId: "66c5fef5-217b-4929-9a08-72c2479a8f4e",
        licenseeCode: "TGS",
        brandId: "4e86719f-243f-46f6-b010-5c758b7285af",
        brandCode: "GPI",
        type: "Credit",
        money: 1.0,
        amount: 111.0,
        remark: "test",
        expansions: {
          Name: "admin.enabled"
        },
        createdUserId: "50ce61eb-8c9d-4f84-3cf6-08d9262ce1a5",
        createdUsername: "admin.enabled",
        createdOn: "2023-12-13T10:12:59.608391+00:00"
      },
      {
        id: "018c62aa-0a3f-0000-0001-07e752225b07",
        resellerId: "b5a2c708-ab70-4316-9f4d-5d2ad0e77460",
        resellerCode: "TGS",
        licenseeId: "66c5fef5-217b-4929-9a08-72c2479a8f4e",
        licenseeCode: "TGS",
        brandId: "4e86719f-243f-46f6-b010-5c758b7285af",
        brandCode: "GPI",
        type: "Debit",
        money: 1.0,
        amount: 11.0,
        remark: "test",
        expansions: {
          Name: "admin.enabled"
        },
        createdUserId: "50ce61eb-8c9d-4f84-3cf6-08d9262ce1a5",
        createdUsername: "admin.enabled",
        createdOn: "2023-12-13T10:12:40.12773+00:00"
      },
      {
        id: "018c62a8-ebd8-0000-0001-07e752225b07",
        resellerId: "b5a2c708-ab70-4316-9f4d-5d2ad0e77460",
        resellerCode: "TGS",
        licenseeId: "66c5fef5-217b-4929-9a08-72c2479a8f4e",
        licenseeCode: "TGS",
        brandId: "4e86719f-243f-46f6-b010-5c758b7285af",
        brandCode: "GPI",
        type: "Debit",
        money: 50.0,
        amount: 501.0,
        remark: "test",
        expansions: {
          Name: "admin.enabled"
        },
        createdUserId: "50ce61eb-8c9d-4f84-3cf6-08d9262ce1a5",
        createdUsername: "admin.enabled",
        createdOn: "2023-12-13T10:11:26.811099+00:00"
      },
      {
        id: "018c48ba-067d-0000-0001-07e789095d43",
        resellerId: "b5a2c708-ab70-4316-9f4d-5d2ad0e77460",
        resellerCode: "TGS",
        licenseeId: "66c5fef5-217b-4929-9a08-72c2479a8f4e",
        licenseeCode: "TGS",
        brandId: "4e86719f-243f-46f6-b010-5c758b7285af",
        brandCode: "GPI",
        type: "Debit",
        money: 5.0,
        amount: 500.0,
        remark: "test",
        expansions: {
          Name: "admin.enabled"
        },
        createdUserId: "50ce61eb-8c9d-4f84-3cf6-08d9262ce1a5",
        createdUsername: "admin.enabled",
        createdOn: "2023-12-08T09:20:00.126188+00:00"
      },
      {
        id: "018c48b9-9faa-0000-0001-07e789095d43",
        resellerId: "b5a2c708-ab70-4316-9f4d-5d2ad0e77460",
        resellerCode: "TGS",
        licenseeId: "66c5fef5-217b-4929-9a08-72c2479a8f4e",
        licenseeCode: "TGS",
        brandId: "4e86719f-243f-46f6-b010-5c758b7285af",
        brandCode: "GPI",
        type: "Credit",
        money: 10.0,
        amount: 1000.0,
        remark: "test",
        expansions: {
          Name: "admin.enabled"
        },
        createdUserId: "50ce61eb-8c9d-4f84-3cf6-08d9262ce1a5",
        createdUsername: "admin.enabled",
        createdOn: "2023-12-08T09:19:33.804044+00:00"
      }
    ],
    totalCount: 8,
    errors: [],
    message: "",
    valid: true
  }
  return {
    data,
    error: null,
    ...rest
  }
}

const ProfitApi = "/api/brandgamecreditprofit"
export const usePlatformAccountFundCreditUsedDetail = (
  brandId,
  searchParams
) => {
  let url =
    brandId && searchParams
      ? urlWith(searchParams, `${ProfitApi}/${brandId}/query`)
      : ""
  let { data, error, ...rest } = useGet(url)

  //TODO: fake data
  data = Array.from({ length: 100 }, () => ({
    gameProviderCode: faker.string.alpha({
      casing: "upper"
    }),
    profitAmount: faker.number.int({ min: -100, max: 100 })
  }))

  //TODO: need to process profitAmount?
  /*
  data = data?.map(({ profitAmount, ...item }) => ({
    ...item,
    profitAmount: profitAmount < 0 ? 0 : profitAmount
  }))
  */
  return {
    data,
    error: null,
    ...rest
  }
}

const AlertSettingApi = "/api/brandgamecreditsuspsetting"
export const usePlatformAccountFundAlertSetting = (brandId) => {
  let url = brandId ? `${AlertSettingApi}/${brandId}` : ""
  return useGet(url)
}

export const useUpdatePlatformAccountFundAlertSetting = (brandId, formData) => {
  let url = brandId ? `${AlertSettingApi}/${brandId}` : ""
  return usePostData(url, formData)
}
