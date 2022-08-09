import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Spinner,
  Stack,
  Flex,
  Box,
  Button,
  Set,
  Blockquote,
  Dialog,
  useModalState,
  FieldStack
} from "bumbag"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { View, Update } from "./menu"
import dateTimeColumn from "../../table/column/dateTime"
import { usePlayer } from "./client"
import { FormattedNumberDecimal, Trans, useTrans } from "../../i18n"
import SearchButton from "../../button/SearchButton"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import textColumn from "../../table/column/textColumn"
import { Descending } from "../../table/order"
import AlertDialog from "../../dialog/Alert"
import { sortBy } from "lodash-es"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import Disclosure from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import { PlayerDepositPaymentSelect } from "./PlayerDepositPaymentSelect"

export const PlayerDepositFormDialogDisclosure = ({
  brandId,
  playerCode,
  ...props
}) => {
  let dialog = new useModalState()

  let editable = useIsDisplayMenuByRoute([Update])
  if (!editable) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="存款单" en="Deposit Form" />
      </Disclosure>
      {dialog.visible && (
        <DepositFormDialog
          brandId={brandId}
          playerCode={playerCode}
          dialog={dialog}
        />
      )}
    </>
  )
}

const DepositFormDialog = ({ brandId, playerCode, dialog, ...props }) => {
  let [formData, setSubmit] = useState()
  const reset = () => {
    console.log("TODO: reset")
  }

  const onSubmit = (data) => {
    console.log("onSubmit", data)
  }

  return (
    <FormDialog defaultValues={{}} onSubmit={onSubmit} dialog={dialog}>
      <FormBody brandId={brandId} playerCode={playerCode} />
    </FormDialog>
  )
}

const FormBody = ({ brandId, playerCode }) => {
  return (
    <FieldStack>
      <PlayerDepositPaymentSelect brandId={brandId} playerCode={playerCode} />
    </FieldStack>
  )
}
