import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Box, Set, Flex, Text, Group } from "bumbag"
import {
  Trans,
  useLocale,
  useTrans,
  Locales,
  FormattedNumberDecimalPercentage
} from "../../i18n"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { PercentageNumberInputField } from "../../input/NumberInput"
import { useBalanceAlertValue } from "./AutoAlert"

const GameAccessSuspension = "gameAccessSuspension"

const LobbyAccessSuspension = "lobbyAccessSuspension"

const Name = {
  GameAccessSuspension,
  LobbyAccessSuspension
}

const useAccessSuspensionValue = (name) => {
  let { watch } = useFormContext()

  return watch(name)
}

export const useGameAccessSuspensionValue = (
  name = Name.GameAccessSuspension
) => useAccessSuspensionValue(name)

const inputFieldStyle = css`
  margin: 0 0.5rem;
  display: inline-flex;
  flex: 0 0 max-content;
  line-height: 1.5;
`

export const GameAccessSuspensionInputField = ({
  name = Name.GameAccessSuspension,
  defaultValue = 80,
  max = 90,
  registerOptions = {
    valueAsNumber: true
  },
  size = "small",
  ...props
}) => {
  let min = useBalanceAlertValue()
  return (
    <PercentageNumberInputField
      name={name}
      defaultValue={defaultValue}
      min={min}
      max={max}
      registerOptions={registerOptions}
      size={size}
      css={inputFieldStyle}
      {...props}
    />
  )
}

const boxBodyStyle = css`
  line-height: 38px;
`

export const GameAccessSuspensionInputBox = ({
  children = <GameAccessSuspensionInputField />,
  ...props
}) => {
  return (
    <Box {...props}>
      <Trans
        zh={
          <span css={boxBodyStyle}>
            <Text>{"當已用額度%大於"}</Text>
            {children}
            <Text>{"，系統將限制玩家進入所有遊戲。"}</Text>
          </span>
        }
        en={
          <span css={boxBodyStyle}>
            <Text>{"When Usage P/T exceeds "}</Text>
            {children}
            <Text>
              {", the system will suspend the players’ access to all games."}
            </Text>
          </span>
        }
      />
    </Box>
  )
}

export const useLobbyAccessSuspensionValue = (
  name = Name.LobbyAccessSuspension
) => useAccessSuspensionValue(name)

export const LobbyAccessSuspensionInputField = ({
  name = Name.LobbyAccessSuspension,
  max = 95,
  registerOptions = {
    valueAsNumber: true
  },
  size = "small",
  ...props
}) => {
  let min = useGameAccessSuspensionValue()
  return (
    <PercentageNumberInputField
      name={name}
      defaultValue={max}
      min={min}
      max={max}
      registerOptions={registerOptions}
      size={size}
      css={inputFieldStyle}
      {...props}
    />
  )
}

export const LobbyAccessSuspensionInputBox = ({
  children = <LobbyAccessSuspensionInputField />,
  ...props
}) => {
  return (
    <Box {...props}>
      <Trans
        zh={
          <span css={boxBodyStyle}>
            <Text>{"當已用額度%大於"}</Text>
            {children}
            <Text>{"，系統將限制玩家進入平台。"}</Text>
          </span>
        }
        en={
          <span css={boxBodyStyle}>
            <Text>{"When Usage P/T exceeds "}</Text>
            {children}
            <Text>
              {", the system will suspend the players’ access to the platform."}
            </Text>
          </span>
        }
      />
    </Box>
  )
}
