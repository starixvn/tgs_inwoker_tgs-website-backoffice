import { isArray, isObject, isPlainObject, isNil } from "lodash-es"
import { isEmpty, empty, all } from "ramda"

const isArrayOrObject = (target) => isObject(target) || isArray(target)

const isNilOrEmpty = (value) => isNil(value) || isEmpty(value)

const isEmptyArray = (value, originArray) => {
  let isEmpty = isArray(value) && isEmpty(value)
  if (isEmpty) {
    return isEmpty
  }

  let isAllEmptyItems = isArray(value) && all(isNilOrEmpty, value)
  return isAllEmptyItems && value.length === originArray?.length
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
        : diffOrNil(value, originValue)

      if (isNil(diffs) || isEmptyArray(diffs)) {
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

    //TODO: use diffOrEmpty instead?
    return diffOrNil(target, origin)
  }
}

//TODO: support nil as valid value?
const diffOrNil = (target, origin) => {
  if (isNilOrEmpty(target) && isNilOrEmpty(origin)) {
    return null
  }

  let isDiff = target !== origin
  return isDiff ? target : null
}
