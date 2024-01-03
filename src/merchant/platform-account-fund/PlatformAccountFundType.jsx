import React, { useState, useEffect, useMemo } from "react"
import { Trans, useTrans } from "../../i18n"
import Select from "../../select/Select"

const Settled = "Settled"
const SettledTrans = {
  zh: "结算",
  en: "Settled"
}

const TopUp = "TopUp"
const TopUpTrans = {
  zh: "加值",
  en: "Top-up"
}

const Reset = "Reset"
const ResetTrans = {
  zh: "重置",
  en: "Reset"
}

//TODO: ?
export const PlatformAccountFundTypeSelect = ({ placeholder, ...props }) => {
  let defaultPlaceholder = useTrans({
    zh: "类型",
    en: "Type"
  })
  placeholder = placeholder ?? defaultPlaceholder

  let options = [
    {
      label: useTrans(SettledTrans),
      value: Settled
    },
    {
      label: useTrans(TopUpTrans),
      value: TopUp
    },
    {
      label: useTrans(ResetTrans),
      value: Reset
    }
  ]

  return <Select placeholder={placeholder} options={options} {...props} />
}
