import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Text } from "bumbag"
import { useTrans, Trans } from "../i18n"
import Select from "../select/Select"
import {
  AgentTrans,
  ChiefTrans,
  useAgentLevelTrans,
  useAgentTrans,
  useChiefTrans
} from "../trans/Agent"

const Chief = "Chief"

const Agent = "Agent"

export default {
  Chief,
  Agent
}

export const isAgentHead = (value) => value === Chief

export const isAgentParentRequired = (value) => !isAgentHead(value)

export const AgentLevelSelect = ({ placeholder, ...props }) => {
  let defaultPlaceholder = useAgentLevelTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let options = [
    {
      label: useChiefTrans(),
      value: Chief
    },
    {
      label: useAgentTrans(),
      value: Agent
    }
  ]

  return <Select placeholder={placeholder} options={options} {...props} />
}

export const AgentLevelLabel = ({ value = "" }) => {
  let code = value
  switch (code) {
    case Chief:
      return (
        <Text>
          <ChiefTrans />
        </Text>
      )
    case Agent:
      return (
        <Text>
          <AgentTrans />
        </Text>
      )
    default:
      return value
  }
}
