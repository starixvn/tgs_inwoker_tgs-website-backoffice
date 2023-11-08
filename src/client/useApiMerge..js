import { isEmpty, isNil } from "lodash-es"
import { either, complement } from "ramda"

let isNilOrEmpty = either(isNil, isEmpty)
let notEmpty = complement(isNilOrEmpty)

const anyKey = (items = []) => notEmpty(items.find(({ key }) => notEmpty(key)))

export const useApiMerge = (items = []) => {
  let isLoading = items.findIndex(({ isLoading }) => isLoading == true) >= 0

  let hasKey = anyKey(items)
  let result = items.reduce((accum, item, index, list) => {
    if (isNil(accum)) {
      return accum
    }

    if (item.key) {
      accum = item.result
    }

    return accum
  }, hasKey)

  let error = items.find(({ error }) => !isNil(error))?.error

  let mutate = (_, shouldRevalidate) =>
    items.forEach(({ mutate }) => {
      mutate(_, shouldRevalidate)
    })

  let deleteCache = () =>
    items.forEach(({ deleteCache }) => {
      deleteCache()
    })

  return {
    isLoading,
    result,
    error,
    mutate,
    deleteCache
  }
}
