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
import { Update as UpdateMenu, View as ViewMenu } from "./menu"
import { useIsDisplayMenuByRoute } from "../../user/context"
import Disclosure, {
  AddDisclosure,
  EditDisclosure,
  ViewDisclosure
} from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import { Trans, useTrans } from "../../i18n"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { InputField, Input } from "../../input/Input"
import clone from "clone-deep"
import {
  useAddPromotion,
  useUpdatePromotion,
  usePromotionRule,
  usePromotionMainInfo,
  usePromotionContent
} from "./client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import { FieldValues } from "../../layout/Grid"
import { NormalLabel } from "../../form/Label"
import AlertDialog from "../../dialog/Alert"
import {
  PromotionTypeGroupSelect,
  PromotionTypeSelect,
  usePromotionGroupValueOf
} from "../PromotionType"
import { toCheckedGameProviderIds } from "../../game/providers/GameProviderCheckboxGroup"
import { parseISO, isAfter, isBefore } from "date-fns"
import { isValidDate } from "../../date/isValidDate"
import { useBrandGameProviderList } from "../../game/brandproviders/client"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import { parseJSON } from "../../text/json"
import { isNil, isEmpty, set } from "lodash-es"
import { PromotionDateRangeFieldBox } from "./field/DateRangeField"
import { formatDateOnly } from "../../date/format"
import Reward from "./reward/index"
import { PromotionTypes as OfflinePromotionTypeList } from "./reward/OfflineRewardGroup"
import { useIsPromotionStarted } from "./usePromotionFormData"
import { PromotionTypeField } from "./field/PromotionTypeField"
import {
  PromotionNameTrans,
  useViewPromotionTrans
} from "../../trans/Promotion"

export const AddPromotionDisclosure = ({ brandId, onSubmitted, ...props }) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([UpdateMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <AddDisclosure {...dialog} {...props} />

      {dialog.visible && (
        <AddDialog
          brandId={brandId}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

export const DialogCss = css`
  & .bb-DialogContent {
    min-height: 60vh;
    position: relative;
    padding: 1.5rem 3rem;
  }
`

const AddDialog = ({ brandId, onSubmitted, dialog, ...props }) => {
  let [formData, setSubmit] = useState()

  let { result, isLoading, error, mutate, deleteCache } =
    useAddPromotion(formData)

  let title = useTrans({
    zh: "新增活动",
    en: "Create Promotion"
  })

  const onSubmit = (data) => {
    let formData = normalizeFormData(data)
    setSubmit({
      ...formData,
      brandId
    })
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  return (
    <FormDialog
      id="add-promotion-dialog"
      defaultValues={{
        brandId,
        autoSentPlayerBonus: true,
        localization: {}
      }}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={onSubmitted}
      title={title}
      dialog={dialog}
      maxWidth="85vw"
      css={DialogCss}
    >
      <FormBody brandId={brandId} />
    </FormDialog>
  )
}

export const normalizeFormData = ({
  gameProviders = [],
  rule = {},
  from,
  to,
  ...data
}) => {
  rule.gameProviderIds = rule?.gameType
    ? toCheckedGameProviderIds("gameProviderId", gameProviders)
    : null

  from = formatDateOnly(from)
  to = formatDateOnly(to)

  return {
    rule,
    from,
    to,
    ...data
  }
}

const NotEditablePromtion = [...OfflinePromotionTypeList]

export const EditPromotionDisclosure = ({
  brandId,
  promotionId,
  promotionType,
  onSubmitted,
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([UpdateMenu])

  if (NotEditablePromtion.includes(promotionType)) {
    return null
  }

  if (!isDisplay) {
    return null
  }

  return (
    <>
      <EditDisclosure {...dialog} {...props} />
      {dialog.visible && (
        <EditDialog
          brandId={brandId}
          promotionId={promotionId}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

const EditDialog = ({
  brandId,
  promotionId,
  onSubmitted,
  dialog,
  ...props
}) => {
  let [formData, setSubmit] = useState()

  let {
    isLoading: isLoadingFormData,
    data,
    error: loadingFormDataError,
    mutate: mutatePromotionFormData,
    deleteCache: deletePromotionFormDataCache
  } = usePromotionFormData(brandId, promotionId)
  let { result, isLoading, error, mutate, deleteCache } = useUpdatePromotion(
    promotionId,
    formData
  )

  let title = useTrans({
    zh: "编辑活动",
    en: "Edit Promotion"
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
    deletePromotionFormDataCache()
    mutatePromotionFormData()

    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  return (
    <FormDialog
      id="edit-promotion-dialog"
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
      stopPropagation
      css={DialogCss}
    >
      <FormBody brandId={brandId} />
    </FormDialog>
  )
}

export const usePromotionFormData = (brandId, promotionId) => {
  let {
    isLoading: isLoadingMainInfo,
    error: mainInfoError,
    data: mainInfo,
    mutate: mutateMainInfo,
    deleteCache: deleteMainInfoCache
  } = usePromotionMainInfo(promotionId)

  let {
    isLoading: isLoadingContent,
    error: contentError,
    data: content,
    mutate: mutateContent,
    deleteCache: deleteContentCache
  } = usePromotionContent(promotionId)

  let {
    isLoading: isLoadingPromotionRule,
    error: promotionRuleError,
    data: rule,
    mutate: mutatePromotionRule,
    deleteCache: deletePromotionRuleCache
  } = usePromotionRule(promotionId)

  let {
    data = {},
    isLoading: isLoadingBrandGameProviderList,
    error: brandGameProviderError,
    mutate: mutateBrandGameProviderList,
    deleteCache: deleteBrandGameProviderListCache
  } = useBrandGameProviderList(
    brandId && rule?.gameType
      ? {
          brandId,
          showAll: true,
          sortby: "gameProviderName",
          gameType: rule?.gameType
        }
      : undefined
  )

  let gameProviderIds = rule?.gameProviderIds ?? []

  let gameProviders =
    data?.items?.map((gameProvider) => {
      let checked = gameProviderIds.includes(gameProvider.gameProviderId)
      return {
        ...gameProvider,
        checked
      }
    }) ?? []

  //TODO: required?
  let vipLevels = rule?.vipLevels?.map((vipLevel) => `${vipLevel}`) ?? []

  let from = mainInfo?.from && parseISO(mainInfo.from)
  let to = mainInfo?.to && parseISO(mainInfo.to)

  let now = new Date()
  let isPromotionStarted = isAfter(now, from)
  let isPromotionEnded = isAfter(now, to)

  data = {
    isPromotionStarted,
    isPromotionEnded,
    ...mainInfo,
    id: promotionId,
    vipLevels,
    gameProviders,
    ...content,
    localization: parseJSON(content?.localization ?? {}),
    from,
    to,
    rule
  }

  return {
    isLoading:
      isLoadingMainInfo ||
      isLoadingContent ||
      isLoadingBrandGameProviderList ||
      isLoadingPromotionRule,
    error:
      mainInfoError ||
      contentError ||
      brandGameProviderError ||
      promotionRuleError,
    mutate: (_, shouldRevalidate) => {
      mutateMainInfo(_, shouldRevalidate)
      mutateContent(_, shouldRevalidate)
      mutatePromotionRule(_, shouldRevalidate)
      mutateBrandGameProviderList(_, shouldRevalidate)
    },
    deleteCache: () => {
      deleteMainInfoCache()
      deleteContentCache()
      deletePromotionRuleCache()
      deleteBrandGameProviderListCache()
    },
    data
  }
}

export const ViewPromotionDisclosure = ({
  brandId,
  promotionId,
  onSubmitted,
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([ViewMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <ViewDisclosure {...dialog} {...props} />
      {dialog.visible && (
        <ViewDialog
          brandId={brandId}
          promotionId={promotionId}
          dialog={dialog}
        />
      )}
    </>
  )
}

const ViewDialog = ({ brandId, promotionId, dialog, ...props }) => {
  let { isLoading, data, error, mutate, deleteCache } = usePromotionFormData(
    brandId,
    promotionId
  )

  let title = useViewPromotionTrans()

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  const reset = () => {
    deleteCache()
    mutate(null, false)
  }

  return (
    <FormDialog
      id="view-promotion-dialog"
      defaultValues={clone(data)}
      title={title}
      showActionButtons={false}
      footer={
        <CloseButtonFooter dialog={dialog} alignX="right" onClick={reset} />
      }
      dialog={dialog}
      maxWidth="85vw"
      css={DialogCss}
    >
      <FormBody brandId={brandId} readOnly={true} />
    </FormDialog>
  )
}

export const FormBody = ({ brandId, readOnly = false }) => {
  let { control, setValue } = useFormContext()

  let disabled = readOnly
  let promotionStarted = useIsPromotionStarted()
  return (
    <FieldStack marginLeft="1rem" paddingBottom="1.5rem" width="max-content">
      <FieldValues>
        <NormalLabel>
          <PromotionNameTrans />
        </NormalLabel>
        <Box alignY="center">
          <InputField
            name="name"
            brandId={brandId}
            showLocalizationAddonAfter
            disabled={disabled || promotionStarted}
            maxLength="64"
            required
          />
        </Box>

        <PromotionDateRangeFieldBox disabled={disabled} readOnly={readOnly} />

        <PromotionTypeField readOnly={readOnly} />

        <Reward.Main readOnly={readOnly} />
      </FieldValues>

      <Reward.Content readOnly={readOnly} />

      <Reward.Rule readOnly={readOnly} />
    </FieldStack>
  )
}
