import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  useModalState,
  Icon,
  FieldStack,
  Text,
  Set,
  List,
  Box,
  Alert,
  Columns
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Update, View } from "./menu"
import Disclosure from "../../dialog/Disclosure"
import { Trans, useLocale, useTrans, Locales } from "../../i18n"
import FormDialog from "../../form/FormDialog"
import { GameSuspensionInputBox, LobbySuspensionInputBox } from "./Suspension"
import { BalanceAlertInputBox, LowBalanceAlertBox } from "./AutoAlert"

export const AlertSettingDialogDisclosure = ({ brandId, ...props }) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([View])
  let editable = useIsDisplayMenuByRoute([Update])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog}>
        <Trans zh="催收設置" en="Alert Setting" />
      </Disclosure>
      {dialog.visible && (
        <MainSettingDialog dialog={dialog} readOnly={!editable} />
      )}
    </>
  )
}

const MainSettingDialog = ({ brandId, readOnly, dialog, ...props }) => {
  let title = useTrans({
    zh: "催收設置",
    en: "Alert Setting"
  })

  return (
    <FormDialog dialog={dialog} title={title}>
      <Columns>
        <Columns.Column>
          <AccessSuspensionSetting />
        </Columns.Column>
        <Columns.Column>
          <AutoAlertSetting />
        </Columns.Column>
      </Columns>
    </FormDialog>
  )
}

//TODO: alert recipient
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

const AutoAlertSetting = ({}) => {
  return (
    <FieldStack>
      <Text.Block fontWeight="bold">
        <Trans zh="通知信設置" en="Auto Alert Setting" />
      </Text.Block>
      <FieldStack paddingLeft="1rem">
        <Box
          css={css`
            display: grid;
            grid-gap: 0.5rem;
            grid-template-columns: auto 1fr;
          `}
        >
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
