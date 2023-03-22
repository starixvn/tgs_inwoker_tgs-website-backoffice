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
  NewDisclosure,
  ViewDisclosure
} from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import { Trans, useTrans } from "../../i18n"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { InputField, Input } from "../../input/Input"
import clone from "clone-deep"
import {
  useAddPromotion,
  useAddOfflineLoginRewardPromotion,
  useAddOfflineDepositRewardPromotion,
  useUpdatePromotion,
  usePromotionRule
} from "./client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import { FieldValues } from "../../layout/Grid"
import { NormalLabel } from "../../form/Label"
import { DateInputRange } from "../../date/DateTimeRangeInput"
import { VipLevelCheckboxGroup } from "../../vip-levels/CheckboxGroup"
import AlertDialog from "../../dialog/Alert"
import Checkbox from "../../checkbox"
import {
  GameTypeGroupSelect,
  GameTypeSelect,
  toGameTypeString,
  toGameTypeValue,
  useGameTypeGroupValueOf
} from "../../game/GameType"
import {
  PromotionTypeGroup,
  PromotionTypeGroupSelect,
  PromotionTypeSelect,
  useIsInstantlySettlementIntervalType,
  usePromotionGroupValueOf
} from "../PromotionType"
import { toCheckedGameProviderIds } from "../../game/providers/GameProviderCheckboxGroup"
import { BrandGameProviderCheckboxGroupTable } from "../../game/brandproviders/BrandGameProviderCheckboxGroup"
import { parseISO, isAfter, isBefore } from "date-fns"
import { today } from "../../date/range"
import { useBrandGameProviderList } from "../../game/brandproviders/client"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import {
  NumberInput,
  NumberInputField,
  PercentageNumberInputField
} from "../../input/NumberInput"
import { Switch } from "../../switch/Switch"
import { useBrand } from "../../merchant/platforms/client"
import { parseJSON } from "../../text/json"
import { RuleSetting } from "./RuleSetting"
import { AutoPayoutSwitchField } from "./field/AutoPayoutSwitchField"
import { isNil, isEmpty, set } from "lodash-es"
import { TotalFundsField } from "./field/TotalFundsField"
import { GameTypeSelectField } from "./field/GameTypeSelectField"
import { GameProviderSelectField } from "./field/GameProviderSelectField"
import { isPromotionStatusEnabled } from "./PromotionStatus"
import { isValidDate } from "../../date/isValidDate"
import { PromotionDateRangeFieldBox } from "./field/DateRangeField"
import { formatDateOnly } from "../../date/format"
import { VipLevelCheckboxGroupField } from "./field/VipLevelCheckboxGroupField"
import { ContentSetting } from "./ContentSetting"
import { TypeList as OfflinePromotionTypeList } from "./reward/OfflineReward"

export const AddPromotionDisclosure = ({ brandId, onSubmitted, ...props }) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([UpdateMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <NewDisclosure {...dialog} {...props} />
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

const DialogCss = css`
  & .bb-DialogContent {
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
      <FormBody brandId={brandId} isAdd />
    </FormDialog>
  )
}

const normalizeFormData = ({
  gameType,
  gameProviders = [],
  rule = {},
  from,
  to,
  ...data
}) => {
  let gameProviderIds = gameType
    ? toCheckedGameProviderIds("gameProviderId", gameProviders)
    : null

  rule.gameType = gameType
  rule.gameProviderIds = gameProviderIds

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
  record,
  onSubmitted,
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([UpdateMenu])

  let promotionType = record?.promotionType
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
          record={record}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

const EditDialog = ({ brandId, record, onSubmitted, dialog, ...props }) => {
  let [formData, setSubmit] = useState()

  let {
    isLoading: isLoadingFormData,
    data,
    error: loadingFormDataError,
    mutate: mutatePromotionFormData,
    deleteCache: deletePromotionFormDataCache
  } = usePromotionFormData(brandId, record)
  let { result, isLoading, error, mutate, deleteCache } = useUpdatePromotion(
    record?.id,
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

const usePromotionFormData = (
  brandId,
  {
    id,
    from,
    to,
    gameType,
    gameProviderIds = [],
    vipLevels = [],
    localization = {},
    ...record
  } = {}
) => {
  let cloned = clone(record)

  let {
    isLoading: isLoadingPromotionRule,
    error: promotionRuleError,
    data: rule,
    mutate: mutatePromotionRule,
    deleteCache: deletePromotionRuleCache
  } = usePromotionRule(id)

  let {
    data = {},
    isLoading: isLoadingBrandGameProviderList,
    error: brandGameProviderError,
    mutate: mutateBrandGameProviderList,
    deleteCache: deleteBrandGameProviderListCache
  } = useBrandGameProviderList(
    brandId
      ? {
          brandId,
          showAll: true,
          sortby: "gameProviderName",
          gameType
        }
      : undefined
  )

  gameType = rule?.gameType ?? gameType
  gameProviderIds = rule?.gameProviderIds ?? gameProviderIds

  let gameProviders =
    data?.items?.map((gameProvider) => {
      let checked = gameProviderIds.includes(gameProvider.gameProviderId)
      return {
        ...gameProvider,
        checked
      }
    }) ?? []

  let promotionTypeGroup = usePromotionGroupValueOf(record?.promotionType)
  let gameTypeGroup = useGameTypeGroupValueOf(gameType)

  vipLevels = vipLevels.map((vipLevel) => `${vipLevel}`)

  data = {
    id,
    brandId,
    ...cloned,
    vipLevels,
    gameProviders,
    promotionTypeGroup,
    gameTypeGroup,
    gameType,
    localization: parseJSON(localization),
    from: parseISO(from),
    to: parseISO(to),
    rule:
      isEmpty(rule) &&
      (Number.isFinite(cloned?.percentage) ||
        Number.isFinite(cloned?.bonusAmountLimit) ||
        Number.isFinite(cloned?.turnoverMultiple))
        ? {
            percentage: cloned?.percentage,
            bonusAmountLimit: cloned?.bonusAmountLimit,
            turnoverMultiple: cloned?.turnoverMultiple
          }
        : clone(rule)
  }

  return {
    isLoading: isLoadingBrandGameProviderList || isLoadingPromotionRule,
    error: brandGameProviderError || promotionRuleError,
    mutate: (_, shouldRevalidate) => {
      mutatePromotionRule(_, shouldRevalidate)
      mutateBrandGameProviderList(_, shouldRevalidate)
    },
    deleteCache: () => {
      deletePromotionRuleCache()
      deleteBrandGameProviderListCache()
    },
    data
  }
}

export const ViewPromotionDisclosure = ({
  brandId,
  record,
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
        <ViewDialog brandId={brandId} record={record} dialog={dialog} />
      )}
    </>
  )
}

const ViewDialog = ({ brandId, record, dialog, ...props }) => {
  let { isLoading, data, error, mutate, deleteCache } = usePromotionFormData(
    brandId,
    record
  )

  let title = useTrans({
    zh: "查看活动",
    en: "View Promotion"
  })

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

const StatusFieldName = "status"
const FromFieldName = "from"
const ToFieldName = "to"
export const useIsActivePromotion = () => {
  let { control } = useFormContext()
  let status = useWatch({
    control,
    name: StatusFieldName
  })

  let start = useWatch({
    control,
    name: FromFieldName
  })

  let end = useWatch({
    control,
    name: ToFieldName
  })

  if (!isPromotionStatusEnabled(status)) {
    return false
  }

  if (!isValidDate(start) || !isValidDate(end)) {
    return false
  }

  let now = new Date()
  let isAfterStart = isAfter(now, start)
  let isBeforeEnd = isAfter(end, now)

  return isAfterStart && isBeforeEnd
}

//TODO: move to usePromotionFormData
export const useIsPromotionAdded = () => {
  let { control } = useFormContext()

  let id = useWatch({
    control,
    name: "id"
  })
  return !!id
}

const PromotionTypeFieldName = "promotionType"
export const usePromotionType = () => {
  let { control } = useFormContext()

  let promotionType = useWatch({
    control,
    name: PromotionTypeFieldName
  })
  return promotionType
}

const FormBody = ({ brandId, readOnly = false, isAdd = false }) => {
  let formMethods = useFormContext()
  let { control, setValue } = formMethods

  let PromotionTypeGroupFieldName = "promotionTypeGroup"
  let promotionTypeGroup = useWatch({
    control,
    name: PromotionTypeGroupFieldName
  })

  let promotionType = usePromotionType()

  let gameTypePlaceholder = useTrans({
    zh: "全部",
    en: "All"
  })

  let disabled = readOnly
  let editable = !readOnly
  let promotionTypeEditable = editable && isAdd
  let required = editable
  return (
    <FieldStack marginLeft="1rem" paddingBottom="1.5rem" width="max-content">
      <FieldValues>
        <NormalLabel>
          <Trans zh="活动名称" en="Promotion Name" />
        </NormalLabel>
        <Box alignY="center">
          <InputField
            name="name"
            brandId={brandId}
            required={required}
            showLocalizationAddonAfter
            disabled={disabled}
            maxLength="64"
          />
        </Box>

        <PromotionDateRangeFieldBox disabled={disabled} readOnly={readOnly} />

        <NormalLabel>
          <Trans zh="活动类型" en="Promotion Type" />
        </NormalLabel>
        <Box alignY="center">
          {promotionTypeEditable && (
            <PromotionTypeGroupSelect
              name={PromotionTypeGroupFieldName}
              onChange={(event) => {
                setValue(PromotionTypeFieldName, "")
              }}
              placeholder={gameTypePlaceholder}
              required
            />
          )}
          {!promotionTypeEditable && (
            <>
              <PromotionTypeGroupSelect
                name={PromotionTypeGroupFieldName}
                value={promotionTypeGroup}
                display="none"
              />
              <PromotionTypeGroupSelect
                value={promotionTypeGroup}
                disabled="none"
              />
            </>
          )}
        </Box>

        <NormalLabel>
          <Trans zh="活动子类型" en="Promotion SubType" />
        </NormalLabel>
        <Box alignY="center">
          {promotionTypeEditable && (
            <PromotionTypeSelect
              name={PromotionTypeFieldName}
              group={promotionTypeGroup}
              required
            />
          )}
          {!promotionTypeEditable && (
            <>
              <PromotionTypeSelect
                name={PromotionTypeFieldName}
                value={promotionType}
                display="none"
              />
              <PromotionTypeSelect value={promotionType} disabled />
            </>
          )}
        </Box>

        <AutoPayoutSwitchField readOnly={readOnly} disabled={disabled} />

        <TotalFundsField readOnly={readOnly} disabled={disabled} />
      </FieldValues>

      <ContentSetting readOnly={readOnly} />

      <RuleSetting
        promotionTypeGroup={promotionTypeGroup}
        promotionType={promotionType}
        readOnly={readOnly}
      />
    </FieldStack>
  )
}
