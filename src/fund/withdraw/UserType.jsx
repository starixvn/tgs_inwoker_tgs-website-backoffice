import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { Trans, useTrans } from "../../i18n"
import Select from "../../select/Select"
import { useUserTypeTrans } from "../../trans/User"
import { AgentTrans, useAgentTrans } from "../../trans/Agent"
import { PlayerTrans, usePlayerTrans } from "../../trans/Player"

const Player = "Player"

const Agent = "Agent"

export const UserTypeLabel = ({ value = "" }) => {
  switch (value) {
    case Player:
      return <PlayerTrans />
    case Agent:
      return <AgentTrans />
    default:
      return value
  }
}

export const UserTypeSelect = ({
  name = "userType",
  placeholder,
  ...props
}) => {
  let defaultPlaceholder = useUserTypeTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let options = [
    {
      label: usePlayerTrans(),
      value: Player
    },
    {
      label: useAgentTrans(),
      value: Agent
    }
  ]

  return (
    <Select
      name={name}
      placeholder={placeholder}
      options={options}
      {...props}
    />
  )
}
