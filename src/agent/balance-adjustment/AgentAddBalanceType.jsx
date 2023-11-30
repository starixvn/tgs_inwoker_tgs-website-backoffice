import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { useTrans } from "../../i18n"
import Select from "../../select/Select"
import { useTransactionTypeTrans } from "../../trans/Action"

export const Bonus = "Bonus"
const BonusTrans = {
  zh: "红利",
  en: "Bonus"
}

export const Deposit = "Recharge"
const DepositTrans = {
  zh: "存款",
  en: "Deposit"
}

export const Dividend = "Dividend"
const DividendTrans = {
  zh: "分紅",
  en: "Profit sharing"
}

export const Other = "Other"
const OtherTrans = {
  zh: "其他",
  en: "Other"
}

export const AddBalanceTypeSelect = ({ placeholder, ...props }) => {
  let defaultPlaceholder = useTransactionTypeTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let options = [
    {
      label: useTrans(BonusTrans),
      value: Bonus
    },
    {
      label: useTrans(DepositTrans),
      value: Deposit
    },
    {
      label: useTrans(DividendTrans),
      value: Dividend
    },
    {
      label: useTrans(OtherTrans),
      value: Other
    }
  ]

  return <Select placeholder={placeholder} options={options} {...props} />
}

export default AddBalanceTypeSelect
