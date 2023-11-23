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
import { useGameSuspensionValue, useLobbySuspensionValue } from "./Suspension"

export const TabId = "autoAlert"

export const AutoAlertTab = (props) => {}

export const AutoAlertPanel = ({ ...props }) => {
  let { selectedId } = props
  let isActive = selectedId === TabId
}
/*
TODO: moved to MainSetting
const BalanceAlert = "balanceAlert"

export const useBalanceAlertValue = (name = BalanceAlert) => {
  let { control, watch } = useFormContext()

  return watch(name)
}

const inputFieldStyle = css`
  margin: 0 0.5rem;
  display: inline-flex;
  flex: 0 0 max-content;
  line-height: 1.5;
`

export const BalanceAlertInputField = ({
  name = BalanceAlert,
  defaultValue = 60,
  max = 70,
  registerOptions = {
    valueAsNumber: true
  },
  size = "small",
  ...props
}) => (
  <PercentageNumberInputField
    name={name}
    defaultValue={defaultValue}
    max={max}
    registerOptions={registerOptions}
    size={size}
    css={inputFieldStyle}
    {...props}
  />
)

const boxBodyStyle = css`
  line-height: 38px;
`

export const BalanceAlertInputBox = ({
  children = <BalanceAlertInputField />,
  ...props
}) => {
  let balanceAlertValue = useBalanceAlertValue()
  let gameSuspensionValue = useGameSuspensionValue()
  return (
    <Box {...props}>
      <Trans
        zh={
          <span css={boxBodyStyle}>
            <Text>{"當已用額度% > "}</Text>
            {children}
            <Text>{"寄送，每3小時寄送一次"}</Text>

            <Text>{"，直至已用額度% ≤ "}</Text>
            <FormattedNumberDecimalPercentage
              value={balanceAlertValue}
              placeholder="-"
            />

            <Text>{"，或 ≥ "}</Text>
            <FormattedNumberDecimalPercentage
              value={gameSuspensionValue}
              placeholder="-"
            />

            <Text>{"。"}</Text>
          </span>
        }
        en={
          <span css={boxBodyStyle}>
            <Text>{"When Usage P/T is greater than "}</Text>
            {children}
            <Text>{", the alert will be sent every 3 hours"}</Text>

            <Text>{" until the Usage P/T is ≤ "}</Text>
            <FormattedNumberDecimalPercentage value={balanceAlertValue} />

            <Text>{", or ≥ "}</Text>
            <FormattedNumberDecimalPercentage
              value={gameSuspensionValue}
              placeholder="-"
            />

            <Text>{"."}</Text>
          </span>
        }
      />
    </Box>
  )
}

export const LowBalanceAlertBox = ({ ...props }) => {
  let gameSuspensionValue = useGameSuspensionValue()
  let lobbySuspensionValue = useLobbySuspensionValue()

  return (
    <Box {...props}>
      <Trans
        zh={
          <span css={boxBodyStyle}>
            <Text>{"當已用額度% > "}</Text>
            <FormattedNumberDecimalPercentage
              value={gameSuspensionValue}
              placeholder="-"
            />
            <Text>
              {" 後寄送，每3小時寄送一次，直至加值或重置，或已用額度 ≥ "}
            </Text>
            <FormattedNumberDecimalPercentage
              value={lobbySuspensionValue}
              placeholder="-"
            />
            <Text>{" 為止。"}</Text>
          </span>
        }
        en={
          <span css={boxBodyStyle}>
            <Text>{"When Usage P/T is greater than "}</Text>
            <FormattedNumberDecimalPercentage
              value={gameSuspensionValue}
              placeholder="-"
            />
            <Text>
              {
                ", the alert will be sent every 3 hours until top-up, reset, or the usage P/T is ≥ "
              }
            </Text>
            <FormattedNumberDecimalPercentage
              value={lobbySuspensionValue}
              placeholder="-"
            />
            <Text>{"."}</Text>
          </span>
        }
      />
    </Box>
  )
}

export const LobbySuspensionAlert = ({}) => {
  let lobbySuspensionValue = useLobbySuspensionValue()

  return (
    <Box {...props}>
      <Trans
        zh={
          <span css={boxBodyStyle}>
            <Text>{"當使用比例 > "}</Text>
            <FormattedNumberDecimalPercentage
              value={lobbySuspensionValue}
              placeholder="-"
            />
            <Text>{" 後寄送，每3小時寄送一次，直至再次充值為止。"}</Text>
          </span>
        }
        en={
          <span css={boxBodyStyle}>
            <Text>{"When Usage P/T is greater than "}</Text>
            <FormattedNumberDecimalPercentage
              value={lobbySuspensionValue}
              placeholder="-"
            />
            <Text>
              {", the alert will be sent every 3 hours until top-up or reset."}
            </Text>
          </span>
        }
      />
    </Box>
  )
}
*/
