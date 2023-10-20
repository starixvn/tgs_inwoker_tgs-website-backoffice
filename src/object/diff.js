import { isArray, isObject, isNil, isString } from "lodash-es"
import { isEmpty, empty } from "ramda"

const isArrayOrObject = (target) => isObject(target) || isArray(target)

const isNilOrEmpty = (value) => isNil(value) || isEmpty(value)

export const toDiff = (target, origin) => {
  let accum = isArrayOrObject(target) ? empty(target) : null

  if (accum) {
    let diffs = Object.entries(target).reduce((accum, [key, value]) => {
      let originValue = Reflect.get(origin, key)

      let diff = isArrayOrObject(value)
        ? toDiff(value, originValue)
        : diffOrNil(value, originValue)

      if (isNilOrEmpty(diff)) {
        return accum
      }

      Reflect.set(accum, key, diff)
      return accum
    }, accum)

    //TODO: rm log
    console.log("diffs", diffs, "target", target, "origin", origin)
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
