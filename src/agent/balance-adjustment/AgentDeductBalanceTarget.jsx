import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Dialog,
  useModalState,
  Stack,
  Heading,
  Text,
  Box,
  Set,
  FieldStack
} from "bumbag"
import { useTrans } from "../../i18n"
import Select from "../../select/Select"
import { useAgentTrans } from "../../trans/Agent"
import { usePlayerTrans } from "../../trans/Player"

export const Player = "Player"

export const Agent = "Agent"

export const DeductBalanceTargetSelect = ({ placeholder, ...props }) => {
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

  let defaultPlaceholder = useTrans({
    zh: "对象",
    en: "Target"
  })
  placeholder = placeholder ?? defaultPlaceholder

  return <Select placeholder={placeholder} options={options} {...props} />
}

export default {
  Player,
  Agent
}
