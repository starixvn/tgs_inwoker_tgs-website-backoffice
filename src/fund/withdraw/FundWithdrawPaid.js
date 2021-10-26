import React, { useState, useEffect, useMemo } from "react"
import {
  Spinner,
  useModalState,
  FieldStack,
  Box,
  Text,
  Button,
  Alert
} from "bumbag"
import { getTrans, Trans, useLocale, useTrans } from "../../i18n"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Update } from "./menu"
import { Disclosure, VerifyDisclosure } from "../../dialog/Disclosure"
import { FormDialog } from "../../form/FormDialog"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import clone from "clone-deep"
import { useForm, useFormContext } from "react-hook-form"
import { useVerifyFundWithdrawForm } from "./client"
import { isDev } from "../../env"
import Input from "../../input/Input"
import { useConfirmText } from "../../button/ActionButtons"

export const FundWithdrawPaidDialogDisclosure = ({
  brandId,
  formId,
  onSubmitted,
  onVisibleChange,
  ...props
}) => {
  let dialog = useModalState()

  useEffect(() => {
    onVisibleChange?.(dialog.visible)
  }, [dialog.visible])

  let isDisplay = useIsDisplayMenuByRoute([Update])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="已支付" en="Paid" />
      </Disclosure>
      {dialog.visible && (
        <PaidDialog
          brandId={brandId}
          formId={formId}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

const PaidDialog = ({ brandId, formId, onSubmitted, dialog, ...props }) => {
  let title = useTrans({
    zh: "已支付",
    en: "Paid"
  })

  let submitText = useConfirmText()

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useVerifyFundWithdrawForm(brandId, formId, formData)

  const onSubmit = (data) => {
    setSubmit(data)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  return (
    <FormDialog
      id="fund-withdraw-paid-dialog"
      defaultValues={{
        brandId,
        formId
      }}
      actionButtonsProps={{
        submitText
      }}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={() => {
        onSubmitted?.()
        //TODO: need event?
        //fireVerifiedEvent()
      }}
      title={title}
      dialog={dialog}
    >
      <Alert
        title={<Trans zh={`确认已支付？`} en={`Confirm paid`} />}
        type="warning"
        variant=""
      />
      <Input type="hidden" name="brandId" />
      <Input type="hidden" name="formId" />
      <Input type="hidden" name="reviewResponse" value="Paid" />
    </FormDialog>
  )
}
