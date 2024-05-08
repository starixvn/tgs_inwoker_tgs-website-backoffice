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
import { useLowRiskAlertValue } from "./AlertSetting.Main"

const MediumRiskGameSuspension = "moderateRisk"

const HighRiskLobbySuspension = "highRisk"

const Name = {
  MediumRiskGameSuspension,
  HighRiskLobbySuspension
}

const useSuspensionValue = (name) => {
  let { watch } = useFormContext()

  return watch(name)
}

export const useMediumRiskGameSuspensionValue = (
  name = Name.MediumRiskGameSuspension
) => useSuspensionValue(name)

const inputFieldStyle = css`
  margin: 0 0.5rem;
  display: inline-flex;
  line-height: 1.5;
  flex: 0 0 max-content;
`

export const GameSuspensionInputField = ({
  name = Name.MediumRiskGameSuspension,
  defaultValue = 80,
  max = 90,
  registerOptions = {
    valueAsNumber: true
  },
  size = "small",
  ...props
}) => {
  let min = useLowRiskAlertValue()
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

export const GameSuspensionInputBox = ({ readOnly, ...props }) => {
  let input = (
    <GameSuspensionInputField readOnly={readOnly} disabled={readOnly} />
  )
  return (
    <Box {...props}>
      <Trans
        zh={
          <span css={boxBodyStyle}>
            <Text>{"當已用額度%大於"}</Text>
            {input}
            <Text>{"，系統將限制玩家進入所有遊戲。"}</Text>
          </span>
        }
        en={
          <span css={boxBodyStyle}>
            <Text>{"When Used Credits P/T exceeds "}</Text>
            {input}
            <Text>
              {", the system will suspend the players’ access to all games."}
            </Text>
          </span>
        }
      />
    </Box>
  )
}

export const useHighRiskLobbySuspensionValue = (
  name = Name.HighRiskLobbySuspension
) => useSuspensionValue(name)

export const HighRiskLobbySuspensionInputField = ({
  name = Name.HighRiskLobbySuspension,
  max = 95,
  registerOptions = {
    valueAsNumber: true
  },
  size = "small",
  ...props
}) => {
  let min = useMediumRiskGameSuspensionValue()
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

export const HighRiskLobbySuspensionInputBox = ({ readOnly, ...props }) => {
  let input = (
    <HighRiskLobbySuspensionInputField
      readOnly={readOnly}
      disabled={readOnly}
    />
  )
  return (
    <Box {...props}>
      <Trans
        zh={
          <span css={boxBodyStyle}>
            <Text>{"當已用額度%大於"}</Text>
            {input}
            <Text>{"，系統將限制玩家進入平台。"}</Text>
          </span>
        }
        en={
          <span css={boxBodyStyle}>
            <Text>{"When Used Credits P/T exceeds "}</Text>
            {input}
            <Text>
              {", the system will suspend the players’ access to the platform."}
            </Text>
          </span>
        }
      />
    </Box>
  )
}
