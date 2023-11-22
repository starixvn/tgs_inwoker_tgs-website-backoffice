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
import { GameSuspensionInputBox, LobbySuspensionInputBox } from "./Suspension"
// import { BalanceAlertInputBox, LowBalanceAlertBox } from "./AutoAlert"
import { AlertRecipientInputList } from "./AlertRecipient"
import { useGameSuspensionValue, useLobbySuspensionValue } from "./Suspension"
//TODO: tab

export const TabId = "Main"

//TODO
export const MainSettingTab = (props) => {
  return (
    <Tab tabId={TabId} {...props}>
      <Trans zh="基本設置" en="Main Setting" />
    </Tab>
  )
}

//TODO: onSubmit?
//TODO: how form update?
export const MainSettingPanel = ({ ...props }) => {
  let { selectedId } = props
  let isActive = selectedId === TabId

  //TODO: set form init values?
  useEffect(() => {
    if (isActive) {
      console.log("TODO: rest form default values")
    }
  }, [isActive])

  return (
    <TabPanel tabId={TabId} {...props}>
      <Columns>
        <Columns.Column>
          <AccessSuspensionSetting />
        </Columns.Column>
        <Columns.Column>
          <Stack>
            <AutoAlertSetting />
            <AlertRecipientSetting />
          </Stack>
        </Columns.Column>
      </Columns>
    </TabPanel>
  )
}

//TODO: info layout for en or just use Alert instead
const AccessSuspensionSetting = ({ ...props }) => {
  return (
    <FieldStack>
      <Text.Block fontWeight="bold">
        <Trans zh="停權設置" en="Access Suspension" />
      </Text.Block>
      <FieldStack paddingLeft="1rem">
        <GameSuspensionInputBox />
        <LobbySuspensionInputBox />
        <Set orientation="horizontal">
          <Icon icon="info-circle" color="info" />
          <Trans
            zh="若須重啟遊戲或平台，請於加值或重置後，通知系統管理員。"
            en="To resume the access to all games or to platform, please top-up or reset, and reach out to system administrator for reactivation."
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

const AutoAlertSetting = ({}) => {
  return (
    <FieldStack>
      <Text.Block fontWeight="bold">
        <Trans zh="通知信設置" en="Auto Alert Setting" />
      </Text.Block>
      <FieldStack paddingLeft="1rem">
        <Box css={SettingBodyStyle}>
          <Box css={LineHeightStyle}>
            <Trans zh="加值通知：" en="Balance Alert:" />
          </Box>
          <BalanceAlertInputBox />

          <Box css={LineHeightStyle}>
            <Trans zh="緊急加值通知：" en="Balance Low Alert:" />
          </Box>
          <LowBalanceAlertBox />
        </Box>
      </FieldStack>
    </FieldStack>
  )
}

const AlertRecipientSetting = ({}) => {
  return (
    <FieldStack>
      <Text.Block fontWeight="bold">
        <Trans zh="通知對象設置" en="Alert Recipients" />
      </Text.Block>
      <FieldStack paddingLeft="1rem">
        <Box css={SettingBodyStyle}>
          <Box css={LineHeightStyle}>
            <Trans zh="總公司" en="Reseller" />
            <Text color="danger">*</Text>
          </Box>
          <AlertRecipientInputList name="reseller" />

          <Box css={LineHeightStyle}>
            <Trans zh="公司" en="Licensee" />
            <Text color="danger">*</Text>
          </Box>
          <AlertRecipientInputList name="licensee" />

          <Box css={LineHeightStyle}>
            <Trans zh="平台" en="Platform" />
            <Text color="danger">*</Text>
          </Box>
          <AlertRecipientInputList name="platform" />
        </Box>
      </FieldStack>
    </FieldStack>
  )
}

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
