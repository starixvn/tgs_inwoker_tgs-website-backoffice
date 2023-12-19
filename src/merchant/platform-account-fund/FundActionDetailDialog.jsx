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
import { usePlatformAccountFundActionDetail } from "./client"
import Modal from "../../dialog/Modal"
import { ConfirmText } from "../../button/ActionButtons"
import AlertDialog from "../../dialog/Alert"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import { useTable, Table, pageCount, toApiParams } from "../../table"

const AddedDeductedDetail = {
  zh: "上/下分詳情",
  en: "Added/Deducted Details"
}
const FundActionDetailTrans = () => <Trans {...AddedDeductedDetail} />
const useFundActionDetailTrans = () => useTrans(AddedDeductedDetail)

export const AddedDeductedDetailDialogDisclosure = ({
  brandId,
  startOn,
  endOn,
  onSubmitted,
  id,
  dialogId = "fund-action-detail-dialog"
}) => {
  let dialog = useModalState()

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <Disclosure {...dialog}>
        <FundActionDetailTrans />
      </Disclosure>
      {dialog.visible && (
        <DetailDialog
          brandId={brandId}
          startOn={startOn}
          endOn={endOn}
          dialog={dialog}
          onSubmitted={onSubmitted}
        />
      )}
    </>
  )
}

const DetailDialog = ({ brandId, startOn, endOn, dialog, dialogId }) => {
  let title = useFundActionDetailTrans()

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    startOn,
    endOn
  })
  let { isLoading, data, error } = usePlatformAccountFundActionDetail(
    toApiParams(state)
  )

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <Modal id={dialogId} title={title} {...dialog}>
      {JSON.stringify(data)}
    </Modal>
  )
}
