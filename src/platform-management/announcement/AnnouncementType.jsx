import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Locales, Trans, useTrans } from "../../i18n"
import { Select } from "../../select/Select"
import {
  AnnouncementDepositPopupTrans,
  AnnouncementMainMarqueeTrans,
  AnnouncementMainPopupTrans,
  useAnnouncementDepositPopupTrans,
  useAnnouncementMainMarqueeTrans,
  useAnnouncementMainPopupTrans
} from "../../trans/Platform"

export const Marquee = "Marquee"

export const Main = "Main"

export const Deposit = "Deposit"

export const AnnouncementTypeLabel = ({ value = "" }) => {
  switch (value) {
    case Marquee:
      return <AnnouncementMainMarqueeTrans />

    case Main:
      return <AnnouncementMainPopupTrans />

    case Deposit:
      return <AnnouncementDepositPopupTrans />

    default:
      return value
  }
}

export const AnnouncementTypeSelect = ({ ...props }) => {
  let options = [
    {
      label: useAnnouncementMainMarqueeTrans(),
      value: Marquee
    },
    {
      label: useAnnouncementMainPopupTrans(),
      value: Main
    },
    {
      label: useAnnouncementDepositPopupTrans(),
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
