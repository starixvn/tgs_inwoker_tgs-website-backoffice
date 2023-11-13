import { isArray, isObject, isPlainObject, isNil, isUndefined } from "lodash-es"
import { isEmpty, empty, all } from "ramda"

const isArrayOrObject = (target) => isObject(target) || isArray(target)

const isNilOrEmpty = (value) => isNil(value) || isEmpty(value)

const isEmptyArray = (value, originArray) => {
  let empty = isArray(value) && isEmpty(value)
  if (empty) {
    return empty
  }

  let isAllEmptyObject = isArray(value) && all(isNilOrEmpty, value)
  return isAllEmptyObject && value.length === originArray?.length
}

const isEmptyObject = (value) => isPlainObject(value) && isEmpty(value)

export const diff = (target, origin) => {
  if (isNil(origin)) {
    return target
  }

  let accum = isArrayOrObject(target) ? empty(target) : null

  if (accum) {
    let diffs = Object.entries(target).reduce((accum, [key, value]) => {
      let originValue = isObject(origin) ? Reflect.get(origin, key) : null

      let diffs = isArrayOrObject(value)
        ? diff(value, originValue)
        : diffOrUndefined(value, originValue)

      if (isUndefined(diffs) || isEmptyArray(diffs, originValue)) {
        return accum
      }

      if (isPlainObject(target) && isEmptyObject(diffs)) {
        return accum
      }

      Reflect.set(accum, key, diffs)
      return accum
    }, accum)

    return diffs
  } else {
    //not array or object
    return diffOrUndefined(target, origin)
  }
}

const diffOrUndefined = (target, origin) => {
  const NoDiffs = undefined
  if (isNilOrEmpty(target) && isNilOrEmpty(origin)) {
    return NoDiffs
  }

  let isDiff = target !== origin
  return isDiff ? target : NoDiffs
}
