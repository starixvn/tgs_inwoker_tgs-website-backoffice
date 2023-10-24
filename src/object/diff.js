import { isArray, isObject, isNil } from "lodash-es"
import { isEmpty, empty } from "ramda"

const isArrayOrObject = (target) => isObject(target) || isArray(target)

const isNilOrEmpty = (value) => isNil(value) || isEmpty(value)

//TODO: support array value change?
export const diff = (target, origin) => {
  let accum = isArrayOrObject(target) ? empty(target) : null

  if (accum) {
    let diffs = Object.entries(target).reduce((accum, [key, value]) => {
      let originValue = Reflect.get(origin, key)

      let diffs = isArrayOrObject(value)
        ? diff(value, originValue)
        : diffOrNil(value, originValue)

      if (isNilOrEmpty(diffs)) {
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
