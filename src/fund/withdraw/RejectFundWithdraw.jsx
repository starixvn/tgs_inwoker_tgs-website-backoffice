import React, { useState, useEffect, useMemo } from "react"
import { Spinner, useModalState, FieldStack, Box, Text, Button } from "bumbag"
import { getTrans, Trans, useLocale, useTrans } from "../../i18n"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Reject } from "./menu"
import { Disclosure, VerifyDisclosure } from "../../dialog/Disclosure"
import { FormDialog } from "../../form/FormDialog"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import clone from "clone-deep"
import { useForm, useFormContext } from "react-hook-form"
import { FieldValues } from "../../layout/Grid"
import { NormalLabel } from "../../form/Label"
import { FormBody } from "./ViewFundWithdraw"
import { useFundWithdrawForm, useVerifyFundWithdrawForm } from "./client"
import ReviewFund from "../ReviewFund"
import { RejectTrans, useRejectTrans } from "../../trans/Action"
import { SWRConfig } from "swr"

export const FundWithdrawVerified = "FundWithdrawVerified"

const fireVerifiedEvent = () => {
  let event = new Event(FundWithdrawVerified)
  document.dispatchEvent(event)
}

export const RejectFundWithdrawDisclosure = ({
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

  let isDisplay = useIsDisplayMenuByRoute([Reject])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure palette="danger" variant="outlined" {...dialog} {...props}>
        <RejectTrans />
      </Disclosure>
      {dialog.visible && (
        <SWRConfig value={{ provider: () => new Map() }}>
          <RejectFundWithdrawDialog
            brandId={brandId}
            formId={formId}
            onSubmitted={onSubmitted}
            dialog={dialog}
          />
        </SWRConfig>
      )}
    </>
  )
}

const RejectFundWithdrawDialog = ({
  brandId,
  formId,
  onSubmitted,
  dialog,
  ...props
}) => {
  let title = useRejectTrans()

  let rejectLabel = useRejectTrans()

  let formMethods = useForm()
  let { setValue, getValues } = formMethods

  let {
    isLoading: isLoadingFundWithdrawForm,
    data: fundWithdrawForm,
    error: fundWithdrawFormError,
    mutate: mutateFundWithdrawForm,
    deleteCache: deleteFundWithdrawFormCache
  } = useFundWithdrawForm(brandId, formId)

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useVerifyFundWithdrawForm(brandId, formId, formData)

  if (isLoadingFundWithdrawForm) {
    return <LoadingBackdrop {...dialog} />
  }

  if (fundWithdrawFormError) {
    return <AlertDialog {...fundWithdrawFormError} {...dialog} />
  }

  const onSubmit = ({ remark, reviewResponse, brandPaymentId, ...rest }) => {
    setSubmit({
      brandId,
      brandPaymentId,
      remark,
      reviewResponse
    })
  }

  const reset = () => {
    deleteFundWithdrawFormCache()
    mutateFundWithdrawForm(null, false)

    deleteCache()
    mutate(undefined, false)
    setSubmit(null)
  }

  return (
    <FormDialog
      id="reject-withdraw-dialog"
      formMethods={formMethods}
      defaultValues={clone({ ...fundWithdrawForm })}
      actionButtonsProps={{
        isLoading: isLoading,
        disabled: isLoading,
        submitText: rejectLabel,
        submitProps: {
          "data-type": "reject",
          palette: "danger",
          variant: "outlined"
        }
      }}
      onClickSubmit={(event) => {
        setValue("reviewResponse", ReviewFund.Reject)
      }}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      onClickClose={reset}
      onSubmitted={() => {
        reset()
        onSubmitted?.()
        fireVerifiedEvent()
      }}
      title={title}
      dialog={dialog}
      maxWidth="80vw"
    >
      <FormBody brandId={brandId} record={fundWithdrawForm} />
    </FormDialog>
  )
}
