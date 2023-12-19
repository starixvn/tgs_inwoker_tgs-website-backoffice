import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  useModalState,
  Stack,
  FieldStack,
  Card,
  Set,
  Table,
  Button,
  DropdownMenu,
  Icon,
  Box,
  Alert,
  Group,
  Text,
  Link
} from "bumbag"
import { useIsDisplayMenuByRoute, useUsername } from "../../user/context"
import { Update, View } from "./menu"
import Disclosure from "../../dialog/Disclosure"
import { FormattedNumberDecimal, Trans, useTrans } from "../../i18n"
import FormDialog from "../../form/FormDialog"
import { FieldValues } from "../../layout/Grid"
import Label from "../../form/Label"
import Input from "../../input/Input"
import Textarea from "../../textarea"
import Checkbox from "../../checkbox"
import { CancelTrans, RemarkTrans, SubmitTrans } from "../../trans/Action"
import { Select } from "../../select/Select"
import { NumberInput as _NumberInput } from "../../input/NumberInput"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { usePlatformAccountFund } from "./client"
import Modal from "../../dialog/Modal"
import { ConfirmText } from "../../button/ActionButtons"
import AlertDialog from "../../dialog/Alert"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"

const AddedDeductedDetail = {
  zh: "上/下分詳情",
  en: "Added/Deducted Details"
}
const AddedDeductedDetailTrans = () => <Trans {...AddedDeductedDetail} />
const useAddedDeductedDetailTrans = () => useTrans(AddedDeductedDetail)

export const AddedDeductedDetailDialogDisclosure = ({
  brandId,
  onSubmitted
}) => {
  let dialog = useModalState()

  let hasAuth = useIsDisplayMenuByRoute([Update])
  if (!hasAuth) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog}>
        <AddedDeductedDetailTrans />
      </Disclosure>
      {/* {dialog.visible && (
        <FundDetailDialog
          brandId={brandId}
          dialog={dialog}
          onSubmitted={onSubmitted}
        />
      )} */}
    </>
  )
}
