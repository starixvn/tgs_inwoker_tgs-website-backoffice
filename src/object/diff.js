import { isArray, isObject, isPlainObject, isNil } from "lodash-es"
import { isEmpty, empty } from "ramda"

const isArrayOrObject = (target) => isObject(target) || isArray(target)

const isNilOrEmpty = (value) => isNil(value) || isEmpty(value)

//TODO: check every item in array
const isEmptyArray = (value) => isArray(value) && isEmpty(value)

const isEmptyObject = (value) => isPlainObject(value) && isEmpty(value)

export const diff = (target, origin) => {
  if (isNil(origin)) {
    return target
  }

  let accum = isArrayOrObject(target) ? empty(target) : null

  if (accum) {
    let diffs = Object.entries(target).reduce((accum, [key, value]) => {
      let originValue = Reflect.get(origin, key)

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

const diffOrNil = (target, origin) => {
  if (isNilOrEmpty(target) && isNilOrEmpty(origin)) {
    return null
  }

  let isDiff = target !== origin
  return isDiff ? target : null
}
