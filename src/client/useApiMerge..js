import { isEmpty, isNil } from "lodash-es"
import { either } from "ramda"

let isNilOrEmpty = either(isNil, isEmpty)

//TODO: use hasUrl? able to rm hasUrl?
export const useApiMerge = (items = [], initResult) => {
  let isLoading = items.findIndex(({ isLoading }) => isLoading == true) >= 0

  let result = items.reduce((accum, item, index, list) => {
    if (isNil(accum)) {
      return accum
    }

    if (item.hasUrl) {
      accum = item.result
    }

    return accum
  }, initResult)

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
