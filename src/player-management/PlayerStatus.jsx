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
import {
  PlayerStatusDisabledTrans,
  PlayerStatusEnabledTrans,
  PlayerStatusRegisterUndoneTrans,
  usePlayerStatusDisabledTrans,
  usePlayerStatusEnabledTrans,
  usePlayerStatusRegisterUndoneTrans
} from "../trans/Player"

const Enabled = "Enabled"

const Disabled = "Disabled"

const InBlacklist = "InBlacklist"

const RegisterUndone = "RegisterUndone"

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
      label: usePlayerStatusEnabledTrans(),
      value: Enabled
    },
    {
      label: usePlayerStatusRegisterUndoneTrans(),
      value: RegisterUndone
    },
    {
      label: usePlayerStatusDisabledTrans(),
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
          <PlayerStatusEnabledTrans />
        </Text>
      )
    case Disabled:
      return (
        <Text>
          <PlayerStatusDisabledTrans />
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
          <PlayerStatusRegisterUndoneTrans />
        </Text>
      )
  }
  return value
}
