// import "./tracing"
import { toDataOrError } from "./response"
import useSWR, { cache } from "swr"
import { getAcceptLang, getAcceptLangCulture } from "../i18n"
import { isValid } from "date-fns"
import { isNil, isEmpty, either } from "ramda"

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

  headers = data
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
  }, {})
}

const DefaultUpdateOptions = {
  dedupingInterval: 100
}

const deleteCacheBy = (source = "") => {
  let [key, args, errorKey, isValidatingKey] = cache.serializeKey(source)

  if (key) {
    cache.delete(key)
  }
  if (errorKey) {
    cache.delete(errorKey)
  }
  if (isValidatingKey) {
    cache.delete(isValidatingKey)
  }
}

const deleteErrorCacheBy = (source = "") => {
  let [key, args, errorKey, isValidatingKey] = cache.serializeKey(source)

  if (errorKey) {
    cache.delete(errorKey)
  }
}

export const useGet = (url, options = DefaultUpdateOptions) => {
  let fetchData = !!url
  let key = fetchData ? url : null
  const { data, error, isValidating, mutate } = useSWR(key, get, options)

  return {
    key,
    data,
    isLoading: !error && isNil(data) && fetchData,
    isValidating,
    error,
    isError: error,
    mutate,
    deleteCache: () => deleteCacheBy(key),
    deleteErrorCache: () => deleteErrorCacheBy(key),
    clearCache: () => cache.clear()
  }
}

export const usePostData = (url, data, options = DefaultUpdateOptions) => {
  let fetchData = !!url && data !== undefined
  let key = fetchData ? [url, data] : null
  let {
    data: result,
    error,
    isValidating,
    mutate
  } = useSWR(key, (url, data) => post(url, { data }), options)

  return {
    key,
    result,
    isLoading: !error && !result && fetchData,
    isValidating,
    error,
    isError: error,
    mutate,
    deleteCache: () => deleteCacheBy(key),
    deleteErrorCache: () => deleteErrorCacheBy(key),
    clearCache: () => cache.clear()
  }
}

export const usePostFormData = (
  url,
  formData,
  options = DefaultUpdateOptions
) => {
  let fetchData = !!url && !!formData
  let key = fetchData ? [url, formData] : null
  let {
    data: result,
    error,
    isValidating,
    mutate
  } = useSWR(
    key,
    (url, formData) =>
      post(url, {
        body: formData
      }),
    options
  )

  return {
    key,
    result,
    isLoading: !error && !result && fetchData,
    isValidating,
    error,
    isError: error,
    mutate,
    deleteCache: () => deleteCacheBy(key),
    deleteErrorCache: () => deleteErrorCacheBy(key),
    clearCache: () => cache.clear()
  }
}

export const usePutData = (url, data, options = DefaultUpdateOptions) => {
  let fetchData = !!url && !!data
  let key = fetchData ? [url, data] : null
  let {
    data: result,
    error,
    isValidating,
    mutate
  } = useSWR(key, (url, data) => put(url, { data }), options)

  return {
    key,
    result,
    isLoading: !error && !result && fetchData,
    isValidating,
    error,
    isError: error,
    mutate,
    deleteCache: () => deleteCacheBy(key),
    deleteErrorCache: () => deleteErrorCacheBy(key),
    clearCache: () => cache.clear()
  }
}

export const usePut = (url, settings, options = DefaultUpdateOptions) => {
  let key = url ? [url, settings] : null
  let { data: result, error, isValidating, mutate } = useSWR(key, put, options)

  return {
    key,
    result,
    isLoading: key && !error && !result,
    isValidating,
    error,
    isError: error,
    mutate,
    deleteCache: () => deleteCacheBy(key),
    deleteErrorCache: () => deleteErrorCacheBy(key),
    clearCache: () => cache.clear()
  }
}

export const usePatchData = (
  url,
  data,
  { dropEmptyValuesDisabled = false, ...options } = DefaultUpdateOptions
) => {
  let key = url ? [url, data] : null
  let {
    data: result,
    error,
    isValidating,
    mutate
  } = useSWR(
    key,
    (url, data) =>
      patch(url, {
        data,
        dropEmptyValuesDisabled
      }),
    options
  )

  return {
    key,
    result,
    isLoading: !error && !result && key,
    isValidating,
    error,
    isError: error,
    mutate,
    deleteCache: () => deleteCacheBy(key),
    deleteErrorCache: () => deleteErrorCacheBy(key),
    clearCache: () => cache.clear()
  }
}

export const useDelete = (url, settings) => {
  let fetchData = !!url
  let key = fetchData ? [url, "DELETE"] : null
  const {
    data: result,
    error,
    isValidating,
    mutate
  } = useSWR(key, (url) => fetchApi("DELETE", url, settings))

  return {
    key,
    result,
    isLoading: !error && !result && fetchData,
    isValidating,
    error,
    isError: error,
    mutate,
    deleteCache: () => deleteCacheBy(key),
    deleteErrorCache: () => deleteErrorCacheBy(key),
    clearCache: () => cache.clear()
  }
}

export const useDeleteData = (url, data, options = DefaultUpdateOptions) => {
  let key = url ? [url, data] : null
  let {
    data: result,
    error,
    isValidating,
    mutate
  } = useSWR(key, (url, data) => fetchDelete(url, { data }), options)

  return {
    key,
    result,
    isLoading: !error && !result && key,
    isValidating,
    error,
    isError: error,
    mutate,
    deleteCache: () => deleteCacheBy(key),
    deleteErrorCache: () => deleteErrorCacheBy(key),
    clearCache: () => cache.clear()
  }
}

export const useHead = (url, settings) => {
  let fetchData = !!url
  let key = fetchData ? [url, "HEAD"] : null
  const {
    data: result,
    error,
    isValidating,
    mutate
  } = useSWR(key, (url) => fetchApi("HEAD", url, settings), settings)

  return {
    key,
    result,
    isLoading: !error && !result && fetchData,
    isValidating,
    error,
    isError: error,
    mutate,
    deleteCache: () => deleteCacheBy(key),
    deleteErrorCache: () => deleteErrorCacheBy(key),
    clearCache: () => cache.clear()
  }
}

const isEmptyString = (value) => typeof value == "string" && value === ""

const isNilOrUndefined = (value) =>
  typeof value === "undefined" || value === null

export default {
  get,
  put,
  post,
  delete: (url, options) => fetchApi("DELETE", url, options)
}
