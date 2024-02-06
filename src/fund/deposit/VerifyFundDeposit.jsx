import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { Spinner, useModalState, FieldStack, Box, Text, Button } from "bumbag"
import { getTrans, Trans, useLocale, useTrans } from "../../i18n"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Update } from "./menu"
import { Disclosure, VerifyDisclosure } from "../../dialog/Disclosure"
import { FormDialog } from "../../form/FormDialog"
import { useFundDepositForm, useVerifyFundDepositForm } from "./client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import clone from "clone-deep"
import { useForm, useFormContext } from "react-hook-form"
import { FieldValues } from "../../layout/Grid"
import { NormalLabel } from "../../form/Label"
import { FormBody } from "./ViewFundDeposit"
import ReviewFund from "../ReviewFund"
import { useFundDepositFormData } from "./useFundDepositFormData"
import { RejectTrans, useApproveTrans } from "../../trans/Action"

export const FundDepositVerified = "FundDepositVerified"

const fireVerifiedEvent = () => {
  let event = new Event(FundDepositVerified)
  document.dispatchEvent(event)
}

export const VerifyFundDepositDisclosure = ({
  brandId,
  formId,
  playerCode,
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
      <VerifyDisclosure {...dialog} {...props} />
      {dialog.visible && (
        <VerifyFundDepositDialog
          brandId={brandId}
          formId={formId}
          playerCode={playerCode}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

const VerifyFundDepositDialog = ({
  brandId,
  formId,
  playerCode,
  onSubmitted,
  dialog,
  ...props
}) => {
  let title = useTrans({
    zh: "存款审核",
    en: "Review Deposit"
  })

  let approveLabel = useApproveTrans()

  let formMethods = useForm()
  let { setValue } = formMethods

  let {
    isLoading: isLoadingDepositFormData,
    depositForm: depositFormData,
    brandPayment,
    paymentMethod,
    player,
    error: depositFormDataError,
    mutateDepositForm,
    deleteDepositFormCache
  } = useFundDepositFormData(brandId, formId, playerCode)

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useVerifyFundDepositForm(brandId, formId, formData)

  if (isLoadingDepositFormData) {
    return <LoadingBackdrop {...dialog} />
  }

  if (depositFormDataError) {
    return <AlertDialog {...depositFormDataError} {...dialog} />
  }

  const onSubmit = (form) => {
    if (!isLoading) {
      //prevent submit multiple times
      setSubmit({
        brandId,
        ...form
      })
    }
  }

  const resetVerifyFundDepositForm = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  const reset = () => {
    deleteDepositFormCache()
    mutateDepositForm(null, false)

    resetVerifyFundDepositForm()
  }

  return (
    <FormDialog
      id="verify-deposit-dialog"
      formMethods={formMethods}
      defaultValues={clone(depositFormData)}
      actionButtonsProps={{
        isLoading: isLoading,
        disabled: isLoading,
        submitText: approveLabel,
        palette: "success",
        submitProps: {
          "data-type": "approve"
        }
      }}
      onClickSubmit={(event) => {
        if (!isLoading) {
          setValue("reviewResponse", ReviewFund.Approve)
        }
      }}
      addonButtons={
        <Button
          type="submit"
          data-type="reject"
          isLoading={isLoading}
          disabled={isLoading}
          onClick={() => {
            setValue("reviewResponse", ReviewFund.Reject)
          }}
          palette="danger"
          variant="outlined"
        >
          <RejectTrans />
        </Button>
      }
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={resetVerifyFundDepositForm}
      onSubmitted={() => {
        reset()
        onSubmitted?.()
        fireVerifiedEvent()
      }}
      title={title}
      dialog={dialog}
      css={css`
        width: max-content;
        max-width: 85vw;
      `}
    >
      <FormBody
        brandId={brandId}
        record={depositFormData}
        brandPayment={brandPayment}
        paymentMethod={paymentMethod}
        player={player}
      />
    </FormDialog>
  )
}
