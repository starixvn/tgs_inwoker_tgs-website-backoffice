import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, useFormContext, useFieldArray } from "react-hook-form"
import {
  Stack,
  Heading,
  Box,
  Button,
  Text,
  Group,
  Set,
  Flex,
  useModalState
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { View, Update } from "./menu"
import {
  AddDisclosure,
  EditDisclosure,
  ViewDisclosure
} from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import { Trans, useTrans } from "../../i18n"
import {
  useSubGameProvider,
  useAddSubGameProvider,
  useUpdateSubGameProvider
} from "../../game/providers/client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import { FieldValues } from "../../layout/Grid"
import { NormalLabel } from "../../form/Label"
import { Input, InputField } from "../../input/Input"
import { TextareaField } from "../../textarea"
import GameProviderStatus, {
  GameProviderStatusSelect
} from "./GameProviderStatus"
import { useLanguageList } from "../../language/client"
import { useCurrencyList } from "../../currency/client"
import { GameProviderLanguageCheckboxGroupTable } from "./GameProviderLanguageCheckboxGroup"
import {
  mapCheckedByCode,
  mapCheckedByCultureCode,
  mapMergeChecked
} from "../../checkbox/mapChecked"
import ConfirmButtonFooter, {
  CloseButtonFooter
} from "../../form/ConfirmButtonFooter"
import Checkbox from "../../checkbox"
import { GameProviderCurrencyBetLimitFieldsBox } from "./GameProviderCurrencyBetLimitFieldsBox"
import clone from "clone-deep"
import Backdrop from "../../dialog/Backdrop"

const FormBody = ({ readOnly, isAdd = false }) => {
  let { getValues } = useFormContext()

  let IdFieldName = "id"
  return (
    <>
      <FieldValues>
        <NormalLabel>
          <Trans zh="子游戏商代码" en="Code" />
        </NormalLabel>
        <Box alignY="center">
          <Input name="code" readOnly={readOnly || !isAdd} />
        </Box>

        <NormalLabel>
          <Trans zh="子游戏商名称" en="Name" />
        </NormalLabel>
        <Box alignY="center">
          <InputField
            name="name"
            required
            readOnly={readOnly}
            showLocalizationAddonAfter
          />
        </Box>

        <NormalLabel>
          <Trans zh="子游戏商简介" en="Description" />
        </NormalLabel>
        <TextareaField name="description" readOnly={readOnly} />
      </FieldValues>
      <Input type="hidden" name={IdFieldName} />
    </>
  )
}

export const AddSubGameProviderDisclosure = ({
  gameProviderId,
  onSubmitted,
  ...props
}) => {
  let dialog = useModalState()
  let isDisplay = useIsDisplayMenuByRoute([Update])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <AddDisclosure {...dialog} />
      {dialog.visible && (
        <AddDialog
          gameProviderId={gameProviderId}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

const AddDialog = ({ gameProviderId, dialog, onSubmitted, ...props }) => {
  let title = useTrans({
    zh: "新增子游戏商",
    en: "Add Sub Game Provider"
  })

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useAddSubGameProvider(formData)

  const onSubmit = (data) => {
    setSubmit(data)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  return (
    <Backdrop {...dialog}>
      <FormDialog
        defaultValues={{
          gameProviderId
        }}
        onSubmit={onSubmit}
        result={result}
        isLoading={isLoading}
        error={error}
        onCloseErrorAlert={reset}
        onSubmitted={() => {
          reset()
          onSubmitted?.()
        }}
        onClickClose={reset}
        title={title}
        dialog={dialog}
        hideBackdrop
      >
        <FormBody isAdd={true} />
      </FormDialog>
    </Backdrop>
  )
}

export const EditSubGameProviderDisclosure = ({
  record,
  onSubmitted,
  ...props
}) => {
  let dialog = useModalState()
  let isDisplay = useIsDisplayMenuByRoute([Update])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <EditDisclosure {...dialog} />
      {dialog.visible && (
        <EditDialog record={record} onSubmitted={onSubmitted} dialog={dialog} />
      )}
    </>
  )
}

const EditDialog = ({ record, onSubmitted, dialog, ...props }) => {
  let title = useTrans({
    zh: "编辑子游戏商",
    en: "Edit Sub Game Provider"
  })

  let { gameProviderId, code } = record
  let {
    isLoading: isLoadingSubGameProvider,
    data,
    error: subGameProviderError
  } = useSubGameProvider(code)

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useUpdateSubGameProvider(gameProviderId, code, formData)

  if (isLoadingSubGameProvider) {
    return <LoadingBackdrop {...dialog} />
  }

  if (subGameProviderError) {
    return <AlertDialog {...subGameProviderError} onClickClose={dialog.hide} />
  }

  const onSubmit = (data) => {
    setSubmit(data)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  return (
    <Backdrop {...dialog}>
      <FormDialog
        defaultValues={clone(data)}
        onSubmit={onSubmit}
        result={result}
        isLoading={isLoading}
        error={error}
        onCloseErrorAlert={reset}
        onSubmitted={() => {
          reset()
          onSubmitted?.()
        }}
        onClickClose={reset}
        title={title}
        dialog={dialog}
        hideBackdrop
      >
        <FormBody />
      </FormDialog>
    </Backdrop>
  )
}

export const ViewSubGameProviderDisclosure = ({ record, ...props }) => {
  let dialog = useModalState()
  let isDisplay = useIsDisplayMenuByRoute([View])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <ViewDisclosure {...dialog} />
      {dialog.visible && <ViewDialog record={record} dialog={dialog} />}
    </>
  )
}

const ViewDialog = ({ record, dialog }) => {}
