import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import {
  Box,
  Text,
  Button,
  Set,
  Icon,
  useModalState,
  Dialog,
  Card,
  Flex,
  Heading,
  FieldStack
} from "bumbag"
import { Update, View } from "./menu"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Disclosure } from "../../dialog/Disclosure"
import { Trans, useTrans } from "../../i18n"
import {
  usePromotionFormData,
  normalizeFormData,
  FormBody,
  DialogCss
} from "./edit"
import { startOfTomorrow, addDays, max, differenceInDays } from "date-fns"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import FormDialog from "../../form/FormDialog"
import { useAddPromotion } from "./client"
import clone from "clone-deep"
import { PromotionTypes as OfflinePromotionTypes } from "./reward/OfflineRewardGroup"

const NotPromtion = [...OfflinePromotionTypes]
export const CopyPromotionDisclosure = ({
  brandId,
  promotionId,
  promotionType,
  onSubmitted,
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([Update])

  if (NotPromtion.includes(promotionType)) {
    return null
  }

  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="复制" en="Copy" />
      </Disclosure>
      {dialog.visible && (
        <CopyDialog
          brandId={brandId}
          promotionId={promotionId}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

const useCopyPromotionFormData = (brandId, promotionId) => {
  let { isLoading, data, ...rest } = usePromotionFormData(brandId, promotionId)
  if (!isLoading && data) {
    let {
      id,
      from,
      to,
      isPromotionStarted,
      isPromotionEnded,
      ...restFormData
    } = data

    let rangeInDays = Math.max(differenceInDays(to, from), 0)
    let tomorrow = startOfTomorrow()
    let nextDayOfEnd = addDays(to, 1)
    from = max([tomorrow, nextDayOfEnd])
    to = addDays(from, rangeInDays)

    return {
      data: {
        from,
        to,
        ...restFormData
      },
      ...rest
    }
  }

  return { isLoading, data, ...rest }
}

const CopyDialog = ({ brandId, promotionId, dialog, onSubmitted }) => {
  let [formData, setSubmit] = useState()
  let {
    isLoading: isLoadingFormData,
    data,
    error: loadingFormDataError,
    mutate: mutateFormData,
    deleteCache: deleteFormDataCache
  } = useCopyPromotionFormData(brandId, promotionId)

  let { result, isLoading, error, mutate, deleteCache } =
    useAddPromotion(formData)

  let title = useTrans({
    zh: "新增活动",
    en: "Create Promotion"
  })

  if (isLoadingFormData) {
    return <LoadingBackdrop {...dialog} />
  }

  if (loadingFormDataError) {
    return <AlertDialog {...loadingFormDataError} onClickClose={dialog.hide} />
  }

  const onSubmit = (data) => {
    setSubmit({
      ...normalizeFormData(data),
      brandId
    })
  }

  const reset = () => {
    deleteFormDataCache()
    mutateFormData()

    deleteCache()
    mutate(undefined, false)
    setSubmit(null)
  }

  return (
    <FormDialog
      id="add-promotion-dialog"
      defaultValues={clone(data)}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={() => {
        reset()
        onSubmitted?.()
      }}
      title={title}
      dialog={dialog}
      maxWidth="85vw"
      css={DialogCss}
    >
      <FormBody brandId={brandId} isAdd />
    </FormDialog>
  )
}
