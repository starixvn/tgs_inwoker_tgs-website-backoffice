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
  Level,
  DropdownMenu,
  Spinner
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import Disclosure, {
  AddDisclosure,
  EditDisclosure
} from "../../dialog/Disclosure"
import {
  useForm,
  useFormContext,
  useFieldArray,
  Controller,
  FormProvider
} from "react-hook-form"
import FormDialog from "../../form/FormDialog"
import { Trans, useLocale, useTrans } from "../../i18n"
import Backdrop from "../../dialog/Backdrop"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import clone from "clone-deep"
import { pageCount, Table, toApiParams, useTable } from "../../table"
import textColumn from "../../table/column/textColumn"
import { InputField, Input } from "../../input/Input"
import SearchButton from "../../button/SearchButton"
import dateTimeColumn from "../../table/column/dateTime"
import { View, Update } from "./menu"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import { useDropzone } from "react-dropzone"

export const GameProviderCurrencyReportDisclosure = ({
  gameProviderCode,
  currencyCode,
  ...props
}) => {
  let dialog = useModalState()

  return (
    <>
      <Disclosure variant="link" {...dialog} {...props}>
        {currencyCode}
      </Disclosure>
      {dialog.visible && (
        <ReportDialog
          gameProviderCode={gameProviderCode}
          currencyCode={currencyCode}
          dialog={dialog}
        />
      )}
    </>
  )
}

const ReportDialog = ({ gameProviderCode, currencyCode, dialog, ...props }) => {
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    gameProviderCode,
    currencyCode
  })

  //TODO: title with game provdier & currency?
  return (
    <Dialog.Modal
      {...dialog}
      footer={<CloseButtonFooter alignX="right" dialog={dialog} />}
      showCloseButton
      hideOnClickOutside={false}
      placement="top"
      width="80vw"
      maxWidth="80vw"
    >
      <FieldStack></FieldStack>
    </Dialog.Modal>
  )
}
