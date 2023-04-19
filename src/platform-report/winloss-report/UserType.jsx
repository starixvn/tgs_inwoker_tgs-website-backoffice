import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Text } from "bumbag"
import { useTrans, Trans } from "../../i18n"
import { Select } from "../../select/Select"

export const Agent = "Agent"
const AgentTrans = {
  zh: "代理",
  en: "Agent"
}

export const Player = "Player"
const PlayerTrans = {
  zh: "玩家",
  en: "Player"
}

export const UserTypeLabel = ({ value = "" }) => {
  switch (value) {
    case Agent:
      return <Trans {...AgentTrans} />
    case Player:
      return <Trans {...PlayerTrans} />
    default:
      return value
  }
}

export const UserTypeSelect = ({
  placeholder,
  defaultValue = Agent,
  required = true,
  ...props
}) => {
  let options = [
    {
      label: useTrans(AgentTrans),
      value: Agent
    },
    {
      label: useTrans(PlayerTrans),
      value: Player
    }
  ]

  let defaultPlaceholder = useTrans({
    zh: "类型",
    en: "Type"
  })
  placeholder = placeholder ?? defaultPlaceholder

  return (
    <Select
      placeholder={placeholder}
      options={options}
      defaultValue={defaultValue}
      {...props}
    />
  )
}
