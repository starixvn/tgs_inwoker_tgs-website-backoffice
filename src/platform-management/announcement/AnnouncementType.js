import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Locales, Trans, useTrans } from "../../i18n"
import { Select } from "../../select/Select"

export const Deposit = "Deposit"
const DepositTrans = {
  zh: "充值",
  en: "Deposit"
}

export const AnnouncementTypeLabel = ({ value = "" }) => {
  switch (value) {
    case Deposit:
      return <Trans {...DepositTrans} />

    default:
      return value
  }
}

export const AnnouncementTypeSelect = ({ ...props }) => {
  let options = [
    {
      label: useTrans(DepositTrans),
      value: Deposit
    }
  ]

  return <Select options={options} {...props} />
}
