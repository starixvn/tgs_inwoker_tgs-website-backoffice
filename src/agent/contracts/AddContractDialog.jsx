import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Stack,
  FieldStack,
  Box,
  Set,
  useModalState,
  Button,
  Disclosure
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { AddDisclosure } from "../../dialog/Disclosure"
import { Update } from "./menu"
import FormDialog from "../../form/FormDialog"
import { useFormContext, useWatch } from "react-hook-form"
import { useAddTrans } from "../../trans/Action"
import { useAddPlatformContract } from "./client"
import { FieldValues } from "../../layout/Grid"
import Label from "../../form/Label"
import { AgentContractNameTrans } from "../../trans/Agent"
import { InputField } from "../../input/Input"
import GameType from "../../game/GameType"

export const AddContractDialogDisclosure = ({
  brandId,
  onSubmitted,
  id,
  dialogId,
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([Update])
  if (!isDisplay) {
    return null
  }

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <AddDisclosure id={id} {...dialog} {...props} />
      {dialog.visible && (
        <AddDialog
          brandId={brandId}
          onSubmitted={onSubmitted}
          dialog={dialog}
          dialogId={dialogId}
        />
      )}
    </>
  )
}

//TODO: confirm game type source
const GameTypeList = [
  "LiveDealer",
  "Sportsbook",
  "Slot",
  "CardGame",
  "VirtualSports",
  "Lottery"
]

const AddDialog = ({ brandId, dialog, dialogId, onSubmitted }) => {
  let title = useAddTrans()

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useAddPlatformContract(formData)

  const onSubmit = (data) => {
    //TODO: debug for local dev
    setSubmit({
      ...data,
      brandId,
      contractDividendType: 2,
      gradeIntervalLimit: 1,
      validBetAmount: 1,
      depositAmount: 1,
      betDays: 1,
      gameTypes: GameTypeList,
      conditions: [
        {
          activeNumber: 1,
          dividendPercentage: 1,
          netProfit: 1,
          winLossAmount: 1
        }
      ]
    })
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  return (
    <FormDialog
      defaultValues={{}}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={onSubmitted}
      dialog={dialog}
      dialogId={dialogId}
      title={title}
    >
      <FormBody />
    </FormDialog>
  )
}

const FormBody = ({}) => {
  return (
    <FieldValues>
      <Label>
        <AgentContractNameTrans />
      </Label>
      <InputField name="name" />
    </FieldValues>
  )
}
