import React, { useState, useEffect, useMemo } from "react"
import { css, Stack, Heading, Box, Button, useModalState } from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { ViewDetail, UpdateDetail } from "./menu"
import Disclosure, { EditDisclosure } from "../../dialog/Disclosure"
import { useUpdateBrandGame } from "./client"
import { Trans, useTrans } from "../../i18n"
import { FieldValues } from "../../layout/Grid"
import Label from "../../form/Label"
import FormDialog from "../../form/FormDialog"
import { GameTypeLabel, isLobbyGameType, notLobbyGameType } from "../GameType"
import { GamePlatformLabel } from "../games/GamePlatform.jsx"
import { useFormContext } from "react-hook-form"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import { useBrandGame } from "./client"
import AlertDialog from "../../dialog/Alert"
import Switch from "../../switch/Switch"
import { PercentageNumberInputField } from "../../input/NumberInput"
import Input from "../../input/Input"
import {
  GameDetailTrans,
  GameIdTrans,
  GameNameTrans,
  GameTypeTrans,
  GameVipCommissionRebateTrans,
  TurnoverPercentageTrans,
  useGameDetailTrans
} from "../../trans/Game.jsx"
import {
  BasicInformationTrans,
  NoTrans,
  SupportHtml5Trans,
  SupportingDeviceTrans,
  VendorTrans,
  YesTrans
} from "../../trans/Field.jsx"
import { SpecialProcessingTrans } from "../../trans/Action.jsx"
import { VipCommissionRebateTrans } from "../../trans/Vip.jsx"

export const PlatformGameDetailButton = ({ record, onSubmitted, ...props }) => {
  let dialog = useModalState()

  let editable = useIsDisplayMenuByRoute([UpdateDetail])
  let isDisplay = useIsDisplayMenuByRoute([ViewDetail])
  if (!isDisplay) {
    return null
  }

  let readOnly = !editable
  return (
    <>
      <Disclosure {...dialog} {...props}>
        <GameDetailTrans />
      </Disclosure>
      {dialog.visible && (
        <PlatformGameDetailDialog
          record={record}
          readOnly={readOnly}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

const PlatformGameDetailDialog = ({
  record = {},
  readOnly,
  dialog,
  ...props
}) => {
  let { id } = record
  let {
    data: brandGame,
    isLoading: isLoadingBrandGame,
    error: brandGameError,
    mutate: mutatebrandGame,
    deleteCache: deleteBrandGameCache
  } = useBrandGame(id)

  let [submitData, setSubmit] = useState()
  let { result, isLoading, error, mutate, deleteCache } = useUpdateBrandGame(
    record?.id,
    submitData
  )

  const onSubmit = (formData) => {
    setSubmit(formData)
  }

  const reset = () => {
    deleteBrandGameCache()
    mutatebrandGame(undefined, false)

    mutate(undefined, false)
    setSubmit(null)
  }

  let title = useGameDetailTrans()

  if (isLoadingBrandGame) {
    return <LoadingBackdrop {...dialog} />
  }

  if (brandGameError) {
    return <AlertDialog {...brandGameError} onClickClose={dialog.hide} />
  }

  return (
    <FormDialog
      id="edit-game-dialog"
      defaultValues={{ ...brandGame }}
      onSubmit={onSubmit}
      stopPropagation
      result={result}
      isLoading={isLoading}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={() => {
        reset()
        props?.onSubmitted()
      }}
      title={title}
      showCloseButton
      showActionButtons={readOnly ? false : true}
      dialog={dialog}
      minWidth="40vw"
    >
      <EditBody record={brandGame} readOnly={readOnly} />
    </FormDialog>
  )
}

const EditBody = ({ record = {}, readOnly }) => {
  let { gameProviderName, gameType, gameName, gameId, platform, supportHtml5 } =
    record

  let notLobbyGame = notLobbyGameType(gameType)
  return (
    <Stack orientation="vertical" marginLeft="1rem">
      <Heading use="h5" marginBottom="major-1">
        <BasicInformationTrans />
      </Heading>
      <Stack>
        <Stack orientation="horizontal" marginBottom="major-1">
          <FieldValues>
            <Label fontWeight="normal">
              <VendorTrans />
            </Label>
            <Box alignY="center">{gameProviderName}</Box>
          </FieldValues>

          <FieldValues>
            <Label fontWeight="normal">
              <GameTypeTrans />
            </Label>
            <Box alignY="center">
              <GameTypeLabel value={gameType} />
              <Input name="gameType" type="hidden" />
            </Box>
          </FieldValues>
        </Stack>
        <Stack orientation="horizontal" marginBottom="major-1">
          <FieldValues>
            <Label fontWeight="normal">
              <GameNameTrans />
            </Label>
            <Box alignY="center">{gameName}</Box>
          </FieldValues>
          <FieldValues>
            <Label fontWeight="normal">
              <GameIdTrans />
            </Label>
            <Box alignY="center">{gameId}</Box>
          </FieldValues>
        </Stack>
        <Stack orientation="horizontal" marginBottom="major-1">
          <FieldValues>
            <Label fontWeight="normal">
              <SupportingDeviceTrans />
            </Label>
            <Box alignY="center">
              <GamePlatformLabel value={platform} />
            </Box>
          </FieldValues>

          <FieldValues>
            <Label fontWeight="normal">
              <SupportHtml5Trans />
            </Label>
            <Box alignY="center">
              {supportHtml5 ? <YesTrans /> : <NoTrans />}
            </Box>
          </FieldValues>
        </Stack>
      </Stack>

      {notLobbyGame && (
        <>
          <Heading use="h5" marginBottom="major-1">
            <SpecialProcessingTrans />
          </Heading>
          <FieldValues>
            <Label fontWeight="normal">
              <TurnoverPercentageTrans />
            </Label>
            <Box alignY="center">
              <PercentageNumberInputField
                name="effectiveBettingPercentage"
                readOnly={readOnly}
                disabled={readOnly}
              />
            </Box>

            <Label fontWeight="normal">
              <GameVipCommissionRebateTrans />
            </Label>
            <Switch name="rebate" disabled={readOnly} />
          </FieldValues>
        </>
      )}
      <Input name="id" type="hidden" />
    </Stack>
  )
}
