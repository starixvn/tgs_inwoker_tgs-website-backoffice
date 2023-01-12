import { isArray, reduce } from "lodash-es"
import { isNil, isEmpty, either, complement } from "ramda"

const isNilOrEmpty = either(isNil, isEmpty)
const notNilOrEmpty = complement(isNilOrEmpty)

//TODO: support list?
export const cloneNotEmpty = (value) => {
  let result = reduce(
    value,
    (accum, value, key) => {
      if (typeof value === "object") {
        let reducedObject = cloneNotEmpty(value)
        return {
          ...accum,
          ...reducedObject
        }
      }

      if (notNilOrEmpty(value)) {
        Reflect.set(accum, key, value)
      }
      return accum
    },
    isArray(value) ? [] : {}
  )

  return result
}
