import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Box, Set, Stack, Text, FieldStack, Columns, Icon } from "bumbag"
import {
  Trans,
  useLocale,
  useTrans,
  Locales,
  FormattedNumberDecimalPercentage
} from "../../i18n"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { PercentageNumberInputField } from "../../input/NumberInput"
import { useTabState, Tabs, TabList, Tab, TabPanel } from "../../tab"
import {
  GameSuspensionInputBox,
  HighRiskLobbySuspensionInputBox,
  useMediumRiskGameSuspensionValue,
  useHighRiskLobbySuspensionValue
} from "./Suspension"
import { AlertRecipientInputList } from "./AlertRecipient"
import { LicenseeTrans, PlatformTrans } from "../../trans/Platform"

export const TabId = "main"

export const isMainTab = (v) => v === TabId

export const MainSettingTab = (props) => {
  return (
    <Tab tabId={TabId} {...props}>
      <Trans zh="基本設置" en="Main Setting" />
    </Tab>
  )
}

export const MainSettingPanel = ({ readOnly, ...props }) => {
  let { selectedId } = props
  let isActive = selectedId === TabId

  //TODO: return null if not active?
  return (
    <TabPanel tabId={TabId} {...props}>
      <Columns>
        <Columns.Column>
          <AccessSuspensionSetting readOnly={readOnly} />
        </Columns.Column>
        <Columns.Column>
          <Stack>
            <AutoAlertSetting readOnly={readOnly} />
          </Stack>
        </Columns.Column>
      </Columns>
    </TabPanel>
  )
}

//TODO: info layout for en or just use Alert instead
const AccessSuspensionSetting = ({ readOnly, ...props }) => {
  return (
    <FieldStack>
      <Text.Block fontWeight="bold">
        <Trans zh="停權設置" en="Access Suspension" />
      </Text.Block>
      <FieldStack paddingLeft="1rem">
        <GameSuspensionInputBox readOnly={readOnly} />
        <HighRiskLobbySuspensionInputBox readOnly={readOnly} />
        <Set orientation="horizontal">
          <Icon icon="info-circle" color="info" />
          <Trans
            zh="若須重啟遊戲或平台，請於加值或重置後，通知系統管理員。"
            en="To resume the access to all games or to platform, please add fund, and reach out to system administrator for reactivation."
          />
        </Set>
      </FieldStack>
    </FieldStack>
  )
}

const LineHeightStyle = css`
  line-height: 38px;
`

const SettingBodyStyle = css`
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: auto 1fr;
`

const AutoAlertSetting = ({ readOnly }) => {
  return (
    <FieldStack>
      <Text.Block fontWeight="bold">
        <Trans zh="通知信設置" en="Alert E-mail Setting" />
      </Text.Block>
      <FieldStack paddingLeft="1rem">
        <Box css={SettingBodyStyle}>
          <Box css={LineHeightStyle}>
            <Trans zh="加值通知：" en="Balance Alert:" />
          </Box>
          <LowRiskAlertInputBox readOnly={readOnly} />

          <Box css={LineHeightStyle}>
            <Trans zh="緊急加值通知：" en="Balance Low Alert:" />
          </Box>
          <LowBalanceAlertBox />

          <Box css={LineHeightStyle}>
            <Trans zh="平台停用通知：" en="Suspension Alert:" />
          </Box>
          <LobbySuspensionAlert />
        </Box>
      </FieldStack>
    </FieldStack>
  )
}

const LowRiskAlert = "lowRisk"
//TODO: useWatvh issue?
export const useLowRiskAlertValue = (name = LowRiskAlert) => {
  let { control, watch } = useFormContext()
  return watch(name)
}

const inputFieldStyle = css`
  margin: 0 0.5rem;
  display: inline-flex;
  flex: 0 0 max-content;
  line-height: 1.5;
`

export const LowRiskAlertInputField = ({
  name = LowRiskAlert,
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

export const LowRiskAlertInputBox = ({ readOnly, ...props }) => {
  let input = <LowRiskAlertInputField readOnly={readOnly} disabled={readOnly} />
  let balanceAlertValue = useLowRiskAlertValue()
  let gameSuspensionValue = useMediumRiskGameSuspensionValue()
  return (
    <Box {...props}>
      <Trans
        zh={
          <span css={boxBodyStyle}>
            <Text>{"當已用額度% > "}</Text>
            {input}
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
            <Text>{"When the Used Credits P/T is greater than "}</Text>
            {input}

            <Text>
              {
                ", the balance alert will be sent every 3 hours until the Used Credits P/T is ≤ "
              }
            </Text>
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
  let gameSuspensionValue = useMediumRiskGameSuspensionValue()
  let lobbySuspensionValue = useHighRiskLobbySuspensionValue()

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
            <Text>{"When the Used Credits P/T is greater than "}</Text>
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
  let lobbySuspensionValue = useHighRiskLobbySuspensionValue()

  return (
    <Box>
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
            <Text>{"When Used Credits P/T is greater than "}</Text>
            <FormattedNumberDecimalPercentage
              value={lobbySuspensionValue}
              placeholder="-"
            />
            <Text>
              {
                ", the suspension alert will be sent every 3 hours until add fund."
              }
            </Text>
          </span>
        }
      />
    </Box>
  )
}
