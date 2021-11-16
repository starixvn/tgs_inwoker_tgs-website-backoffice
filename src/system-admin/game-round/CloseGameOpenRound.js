import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  Stack,
  Heading,
  Box,
  Button,
  Text,
  Group,
  Set,
  Flex,
  FieldStack,
  useModalState,
  Dialog,
  Card,
  FieldWrapper,
  Columns,
  DropdownMenu
} from "bumbag"
import { Disclosure } from "../../dialog/Disclosure"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Trans, useTrans } from "../../i18n"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import { Table } from "../../table"
import textColumn from "../../table/column/textColumn"
import { Update } from "./menu"
import { useFormContext } from "react-hook-form"
import { Input, InputField } from "../../input/Input"
import { TextareaField } from "../../textarea"
import { FormDialog } from "../../form/FormDialog"
import clone from "clone-deep"
import Backdrop from "../../dialog/Backdrop"
import { useCloseGameOpenRound } from "./client"

export const CloseGameOpenRoundDialogDisclosure = ({
  roundId,
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
      <Disclosure {...dialog} {...props}>
        <Trans zh="Close" en="Close" />
      </Disclosure>
      {dialog.visible && (
        <CloseGameOpenRoundDialog
          roundId={roundId}
          dialog={dialog}
          onSubmitted={onSubmitted}
        />
      )}
    </>
  )
}

const CloseGameOpenRoundDialog = ({ roundId, dialog }) => {
  let title = useTrans({
    zh: "Close Open Round",
    en: "Close Open Round"
  })

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } = useCloseGameOpenRound(
    roundId,
    formData
  )

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
        defaultValues={{}}
        onSubmit={onSubmit}
        isLoading={isLoading}
        result={result}
        error={error}
        onSubmitted={onSubmitted}
        onCloseErrorAlert={reset}
        title={title}
        dialog={dialog}
      >
        <FormBody />
      </FormDialog>
    </Backdrop>
  )
}

const FormBody = () => {}
