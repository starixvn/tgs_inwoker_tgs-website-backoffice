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
import { useTrans, Trans } from "../../i18n"
import Select from "../../select/Select"
import PlayerAdjustBalanceType, {
  PlayerAdjustBalanceTypeLabel,
  usePlayerAdjustBalanceTypeOptionList
} from "../../player-management/balance-adjustment/PlayerAdjustBalanceType"
import { isPlayer } from "./UserType"
import { AgentAdjustTrans } from "../../trans/Action"

const AgentOther = "AgentOther"

export const AdjustTypeSelect = ({ name = "type", userType, ...props }) => {
  let playerOptions = usePlayerAdjustBalanceTypeOptionList()
  let placeholder = useTrans({
    zh: "调帐类型",
    en: "Adjust Type"
  })

  if (isPlayer(userType)) {
    return (
      <Select
        name={name}
        placeholder={placeholder}
        options={playerOptions}
        {...props}
      />
    )
  }

  return null //onlu AgentOther, no need to select
}

export const AdjustTypeLabel = ({ value = "" }) => {
  if (PlayerAdjustBalanceType.List.includes(value)) {
    return <PlayerAdjustBalanceTypeLabel value={value} />
  }

  switch (value) {
    case AgentOther:
      return <AgentAdjustTrans />
    default:
      return value
  }
}
