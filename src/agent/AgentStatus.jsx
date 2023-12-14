import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Text } from "bumbag"
import { useTrans, Trans } from "../i18n"
import Select from "../select/Select"
import {
  useInBlacklistTrans,
  InBlacklistTrans,
  useStatusTrans
} from "../trans/Status"
import {
  UserStatusDisabledTrans,
  UserStatusEnabledTrans,
  useUserStatusDisabledTrans,
  useUserStatusEnabledTrans
} from "../trans/User"

const Enabled = "Enabled"

const Disabled = "Disabled"

const InBlacklist = "InBlacklist"

export const AgentStatusSelect = ({ placeholder, ...props }) => {
  let defaultPlaceholder = useStatusTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let options = [
    {
      label: useUserStatusEnabledTrans(),
      value: Enabled
    },
    {
      label: useUserStatusDisabledTrans(),
      value: Disabled
    },
    {
      label: useInBlacklistTrans(),
      value: InBlacklist
    }
  ]

  return <Select placeholder={placeholder} options={options} {...props} />
}

export const AgentStatusLabel = ({ value }) => {
  let code = value
  switch (code) {
    case Enabled:
      return (
        <Text>
          <UserStatusEnabledTrans />
        </Text>
      )
    case Disabled:
      return (
        <Text>
          <UserStatusDisabledTrans />
        </Text>
      )
    case InBlacklist:
      return (
        <Text>
          <InBlacklistTrans />
        </Text>
      )
  }
  return null
}

export default {
  Enabled,
  Disabled,
  InBlacklist,
  AgentStatusSelect,
  AgentStatusLabel
}
