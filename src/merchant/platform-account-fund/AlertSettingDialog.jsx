import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  useModalState,
  Heading,
  FieldStack,
  Text,
  Set,
  Table,
  Button,
  DropdownMenu,
  Icon,
  Box,
  Alert,
  Group,
  Spinner,
  Link
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Update, View } from "./menu"
import Disclosure from "../../dialog/Disclosure"
import { Trans, useLocale, useTrans, Locales } from "../../i18n"
import FormDialog from "../../form/FormDialog"
import Input from "../../input/Input"
import { PercentageNumberInputField } from "../../input/NumberInput"

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

//TODO: ref to promotion, useWatch
const useGameAccessSuspensionValue = () => {}
const usePlayerAccessSuspensionValue = () => {}
const usePlatformAccessSuspensionValue = () => {}

const MainSettingDialog = ({ brandId, readOnly, dialog, ...props }) => {
  let title = useTrans({
    zh: "催收設置",
    en: "Alert Setting"
  })

  return (
    <FormDialog dialog={dialog} title={title}>
      <AccessSuspensionSetting />
    </FormDialog>
  )
}

//TODO: layout
const AccessSuspensionSetting = ({ ...props }) => {
  let gameAccessSuspensionInput = (
    <PercentageNumberInputField name="gameAccessSuspension" />
  )

  let playerAccessSuspensionInput = (
    <PercentageNumberInputField name="playerAccessSuspension" />
  )

  let platformAccessSuspensionInput = (
    <PercentageNumberInputField name="platformAccessSuspension" />
  )

  return (
    <FieldStack>
      <Text.Block fontWeight="bold">
        <Trans zh="停權設置" en="Access Suspension" />
      </Text.Block>
      <FieldStack paddingLeft="1rem">
        <Box>
          <Trans
            zh={
              <Set orientation="horizontal">
                <Text>{"當已用額度%大於"}</Text>
                {gameAccessSuspensionInput}
                <Text>{"，系統將限制玩家進入所有遊戲。"}</Text>
              </Set>
            }
            en={
              <Set orientation="horizontal">
                <Text>{"When Usage P/T exceeds "}</Text>
                {gameAccessSuspensionInput}
                <Text>
                  {
                    ", the system will suspend the players’ access to all games."
                  }
                </Text>
              </Set>
            }
          />
        </Box>
      </FieldStack>
    </FieldStack>
  )
}

const AutoAlertSetting = ({}) => {}
