import {
  urlWith,
  useGet,
  usePostData,
  usePutData,
  useDelete,
  usePostFormData
} from "../../client"
import sortBy from "lodash-es/sortBy"

const API = "/api/GameProvider"

export const usePlatformGameProviderList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, `${API}/brands`) : ""
  let { data, ...rest } = useGet(url)

  return {
    data: data
      ? {
          gameProviders: sortBy(data.gameProviders, ["gameProviderCode"]),
          items: sortBy(data.gameProvidersBrands, ["brabdCode"])
        }
      : undefined,
    ...rest
  }
}
