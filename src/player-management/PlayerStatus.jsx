import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Text } from "bumbag"
import { useTrans, Trans } from "../i18n"
import Select from "../select/Select"
import {
  useInBlacklistTrans,
  useStatusTrans,
  InBlacklistTrans
} from "../trans/Status"

const Enabled = "Enabled"
const EnabledTrans = {
  zh: "活跃",
  en: "Enabled",
  vi: "Hoạt động"
}

const Disabled = "Disabled"
const DisabledTrans = {
  zh: "封锁",
  en: "Disabled",
  vi: "Bị khóa"
}

const InBlacklist = "InBlacklist"

const RegisterUndone = "RegisterUndone"
const RegisterUndoneTrans = {
  zh: "注册中",
  en: "Under Registration",
  vi: "Đang đăng ký"
}

export const PlayerStatus = {
  Enabled,
  RegisterUndone,
  Disabled,
  InBlacklist
}

export const PlayerStatusSelect = ({ placeholder, ...props }) => {
  let defaultPlaceholder = useStatusTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let options = [
    {
      label: useTrans(EnabledTrans),
      value: Enabled
    },
    {
      label: useTrans(RegisterUndoneTrans),
      value: RegisterUndone
    },
    {
      label: useTrans(DisabledTrans),
      value: Disabled
    },
    {
      label: useInBlacklistTrans(),
      value: InBlacklist
    }
  ]

  return <Select placeholder={placeholder} options={options} {...props} />
}

export const PlayerStatusLabel = ({ value = "" }) => {
  switch (value) {
    case Enabled:
      return (
        <Text>
          <Trans {...EnabledTrans} />
        </Text>
      )
    case Disabled:
      return (
        <Text>
          <Trans {...DisabledTrans} />
        </Text>
      )
    case InBlacklist:
      return (
        <Text>
          <InBlacklistTrans />
        </Text>
      )
    case RegisterUndone:
      return (
        <Text>
          <Trans {...RegisterUndoneTrans} />
        </Text>
      )
  }
  return value
}
