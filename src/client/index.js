// import "./tracing"
import { toDataOrError } from "./response"
import useSWR, { useSWRConfig } from "swr"
import { getAcceptLang, getAcceptLangCulture } from "../i18n"
import { isValid } from "date-fns"
import { isNil, isEmpty, either, empty, complement } from "ramda"
import { useEffectOnce } from "react-use"
import { isNull, isUndefined } from "lodash-es"

const notNil = complement(isNil)

export const urlWith = (searchParams = {}, url) => {
  let urlSearchParams = Object.entries(searchParams).reduce(
    (searchParams, [key, value]) => {
      if (isEmptyString(value) || isNilOrUndefined(value)) {
        return searchParams
      }

      if (Array.isArray(value)) {
        let result = value.reduce((result, item) => {
          //TODO: need to check `stringOf(item)` is not empty string?
          return result
            ? `${result}&${key}=${stringOf(item)}`
            : `${key}=${stringOf(item)}`
        }, "")
        return searchParams
          ? result
            ? `${searchParams}&${result}`
            : searchParams
          : result
      }

      return searchParams
        ? `${searchParams}&${key}=${stringOf(value)}`
        : `${key}=${stringOf(value)}`
    },
    ""
  )
  return urlSearchParams ? `${url}?${urlSearchParams}` : url
}

const stringOf = (value) => {
  if (value?.toISOString) {
    if (isValid(value)) {
      return value.toISOString()
    } else {
      //invalid date
      return ""
    }
  }
  return value
}

const FailedToFetchDefaultMessage = "Failed to fetch"
const FailedToFetchTrans = {
  zh: "获取数据失败",
  en: FailedToFetchDefaultMessage
}
const reject = (error) => {
  let locale = getAcceptLang()
  let title = error?.message ?? error?.toString?.() ?? "Error"
  if (title == "Failed to fetch") {
    title = FailedToFetchTrans?.[locale] ?? FailedToFetchDefaultMessage
  } else {
    console.warn(error)
  }
  return Promise.reject({ title })
}

export const get = (
  url = "",
  { searchParams = {}, headers = {}, ...options } = {}
) => {
  url = urlWith(searchParams, url)
  if (!headers["Accept-Language"]) {
    headers["Accept-Language"] = getAcceptLangCulture()
  }

  return fetch(url, { headers, ...options })
    .catch((error) => {
      console.warn(error)
      return reject(error)
    })
    .then(toDataOrError)
}

export const put = (url, options) => fetchApi("PUT", url, options)

export const post = (url, options) => fetchApi("POST", url, options)

export const patch = (url, options) => fetchApi("PATCH", url, options)

export const fetchDelete = (url, options) => fetchApi("DELETE", url, options)

const fetchApi = async (
  method = "",
  url,
  { headers = {}, body, data, ...options } = {}
) => {
  let dropEmptyValuesDisabled = options?.dropEmptyValuesDisabled ?? false
  if (!headers["Accept-Language"]) {
    headers["Accept-Language"] = getAcceptLangCulture()
  }
  //TODO: rm log
  // console.log("url[", url, "], method[", method, "], data", data)

  headers = notNil(data)
    ? {
        "Content-Type": "application/json",
        ...headers
      }
    : headers

  return fetch(url, {
    method,
    headers,
    body:
      body ??
      JSON.stringify(dropEmptyValuesDisabled ? data : dropEmptyValues(data)),
    ...options
  })
    .catch((error) => {
      console.warn(error)
      return reject(error)
    })
    .then((response) => toDataOrError(response, options))
}

//TODO: support array, nested object or array?
const dropEmptyValues = (record) => {
  if (record === null || typeof record != "object") {
    //Note. typeof null = "object"
    return record
  }

  return Object.entries(record).reduce((data, [key, value]) => {
    if (isEmptyString(value) || isNilOrUndefined(value)) {
      return data
    }

    data[key] = value
    return data
  }, empty(record))
}

export const useGet = (url, options) => {
  let key = url ? [url, "GET"] : null
  const { mutate, isLoading, data, error, ...rest } = useSWR(
    key,
    ([url]) => get(url),
    options
  )

  return {
    key,
    isLoading: (key && !error && isNil(data)) || isLoading,
    data,
    error,
    mutate,
    ...rest,
    deleteCache: () => {
      //TODO: seems not work well with: isLoading = (key && !error && isNil(data)) || isLoading
      mutate(undefined, false)
    },
    emptyData: () => {
      //TODO: use FP's Result or Just/Nothing instead?
      mutate({}, false)
    }
  }
}

export const usePost = (url, data, options) => {
  let key = url ? [url, data, "POST"] : null
  let {
    data: result,
    mutate,
    ...rest
  } = useSWR(key, ([url, data]) => post(url, { data, ...options }), options)

  return {
    key,
    result,
    mutate,
    ...rest,
    deleteCache: () => mutate(undefined, false)
  }
}

export const usePostData = (url, data, options) => {
  url = url && data ? url : ""
  return usePost(url, data, options)
}

export const usePostFormData = (url, formData, options) => {
  let key = !!url && !!formData ? [url, formData, "POST"] : null
  let {
    data: result,
    mutate,
    ...rest
  } = useSWR(
    key,
    ([url, formData]) =>
      post(url, {
        body: formData
      }),
    options
  )

  return {
    key,
    result,
    mutate,
    ...rest,
    deleteCache: () => mutate(undefined, false)
  }
}

export const usePut = (url, data, options) => {
  let key = url ? [url, data, "PUT"] : null
  let {
    data: result,
    mutate,
    ...rest
  } = useSWR(key, ([url, data]) => put(url, { data }), options)

  return {
    key,
    result,
    mutate,
    ...rest,
    deleteCache: () => mutate(undefined, false)
  }
}

export const usePutData = (url, data) => {
  url = url && data ? url : ""
  return usePut(url, data)
}

export const usePutData = (url, data, options) => {
  url = url && data ? url : ""
  return usePut(url, data, options)
}

export const usePatchData = (url, data, options) => {
  let key = url ? [url, data, "PATCH"] : null
  let {
    data: result,
    mutate,
    ...rest
  } = useSWR(
    key,
    ([url, data]) =>
      patch(url, {
        data,
        ...options
      }),
    options
  )

  return {
    key,
    result,
    mutate,
    ...rest,
    deleteCache: () => mutate(undefined, false)
  }
}

export const useDelete = (url, data, options) => {
  let key = url ? [url, data, "DELETE"] : null
  let {
    data: result,
    mutate,
    ...rest
  } = useSWR(key, ([url, data]) => fetchDelete(url, { data }), options)

  return {
    key,
    result,
    mutate,
    ...rest,
    deleteCache: () => mutate(undefined, false)
  }
}

export const useDeleteData = (url, data, options) => {
  url = url && data ? url : ""
  return useDelete(url, data, options)
}

export const useHead = (url, options) => {
  let key = url ? [url, "HEAD"] : null
  const {
    data: result,
    mutate,
    ...rest
  } = useSWR(key, ([url]) => fetchApi("HEAD", url, options), options)

  return {
    key,
    result,
    mutate,
    ...rest,
    deleteCache: () => mutate(undefined, false)
  }
}

const isEmptyString = (value) => typeof value == "string" && value === ""

const isNilOrUndefined = (value) =>
  typeof value === "undefined" || value === null

//TODO: rm default?
export default {
  get,
  put,
  post,
  delete: (url, options) => fetchApi("DELETE", url, options)
}
