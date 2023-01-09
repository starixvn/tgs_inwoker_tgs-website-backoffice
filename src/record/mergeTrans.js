import {
  isObject,
  isArray,
  isString,
  isNumber,
  isBoolean,
  get,
  set,
  unset
} from "lodash-es"
import { isNil } from "ramda"
import clone from "clone-deep"

//TODO: better name? replaceSpec? evolve? mergeWithSpec?
export const mergeTrans = ({ accum, lang = "zh", settings, target } = {}) => {
  if (isNil(accum)) {
    accum = isArray(target) ? [] : {}
  }

  return Object.entries(target).reduce((accum, [key, value]) => {
    //TODO: if value is a record or array?
    let clonedValue = clone(value)

    let settingRecord = get(settings, key)
    let trans = settingRecord?.key
    let tran = trans?.[lang]
    if (tran) {
      unset(accum, key)
      set(accum, tran, clonedValue)
    } else {
      set(accum, key, clonedValue)
    }

    let isDeep = !(isString(value) || isNumber(value) || isBoolean(value))
    if (isDeep) {
      if (isArray(value)) {
        value.map((target, index) => {
          let accum = clonedValue[index]
          let settings = settingRecord

          mergeTrans({
            accum,
            settings,
            target
          })
        })
      } else {
        mergeTrans({
          accum: clonedValue,
          settings: settingRecord,
          target: value
        })
      }
    }

    return accum
  }, accum)
}
