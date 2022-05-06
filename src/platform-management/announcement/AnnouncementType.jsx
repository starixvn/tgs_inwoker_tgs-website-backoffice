import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Locales, Trans, useTrans } from "../../i18n"
import { Select } from "../../select/Select"

export const Marquee = "Marquee"
const MarqueeTrans = {
  zh: "首页跑马灯",
  en: "Main Marquee"
}

export const Main = "Main"
const MainTrans = {
  zh: "首页弹跳",
  en: "Main Popup"
}

export const Deposit = "Deposit"
const DepositTrans = {
  zh: "充值弹跳",
  en: "Deposit Popup"
}

export const AnnouncementTypeLabel = ({ value = "" }) => {
  switch (value) {
    case Marquee:
      return <Trans {...MarqueeTrans} />

    case Main:
      return <Trans {...MainTrans} />

    case Deposit:
      return <Trans {...DepositTrans} />

    default:
      return value
  }
}

export const AnnouncementTypeSelect = ({ ...props }) => {
  let options = [
    {
      label: useTrans(MarqueeTrans),
      value: Marquee
    },
    {
      label: useTrans(MainTrans),
      value: Main
    },
    {
      label: useTrans(DepositTrans),
      value: Deposit
    }
  ]

  return <Select options={options} {...props} />
}

export default {
  Marquee,
  Main,
  Deposit
}
