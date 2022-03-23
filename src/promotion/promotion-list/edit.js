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
import { useAddPromotion, useUpdatePromotion } from "./client"
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
  useGameTypeGroupValueOf
} from "../../game/GameType"
import Separator from "../../layout/Separator"
import {
  PromotionTypeGroup,
  PromotionTypeGroupSelect,
  PromotionTypeSelect,
  usePromotionGroupValueOf
} from "../PromotionType"
import { toCheckedGameProviderIds } from "../../game/providers/GameProviderCheckboxGroup"
import { BrandGameProviderCheckboxGroupTable } from "../../game/brandproviders/BrandGameProviderCheckboxGroup"
import { parseISO } from "date-fns"
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
import { ImageUploadButton } from "../../file/upload/ImageUploadButton"
import { HtmlEditor } from "../../text/editor/HtmlEditor"
import Backdrop from "../../dialog/Backdrop"
import { toFileUploadPath } from "../../file/upload/FileUploadPath"
import { parseJSON } from "../../text/json"
import { PromotionRuleSetting } from "./PromotionRuleSetting"

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

  const DefaultVipLevel = "1"
  return (
    <FormDialog
      id="add-promotion-dialog"
      defaultValues={{
        autoSentPlayerBonus: true,
        localization: {}
        /*
        vipLevels: [DefaultVipLevel]
        */
      }}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={onSubmitted}
      title={title}
      dialog={dialog}
      maxWidth="80vw"
      css={DialogCss}
    >
      <FormBody brandId={brandId} isAdd />
    </FormDialog>
  )
}

const normalizeFormData = ({ gameProviders = [], ...data }) => {
  let gameProviderIds = toCheckedGameProviderIds(
    "gameProviderId",
    gameProviders
  )

  return {
    gameProviderIds,
    ...data
  }
}

export const EditPromotionDisclosure = ({
  brandId,
  record,
  onSubmitted,
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([UpdateMenu])
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
    error: loadingFormDataError
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
      onSubmitted={onSubmitted}
      title={title}
      dialog={dialog}
      maxWidth="80vw"
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
    from,
    to,
    gameType,
    gameProviderIds = [],
    vipLevels = [],
    localization = {},
    ...record
  } = {}
) => {
  let {
    data = {},
    isLoading: isLoadingBrandGameProviderList,
    error: brandGameProviderError,
    ...rest
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
    ...record,
    vipLevels,
    gameProviders,
    promotionTypeGroup,
    gameTypeGroup,
    gameType,
    localization: parseJSON(localization),
    from: parseISO(from),
    to: parseISO(to)
  }

  return {
    isLoading: isLoadingBrandGameProviderList,
    error: brandGameProviderError,
    ...rest,
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
  let { isLoading, data, error } = usePromotionFormData(brandId, record)

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

  return (
    <FormDialog
      id="view-promotion-dialog"
      defaultValues={clone(data)}
      title={title}
      showActionButtons={false}
      footer={<CloseButtonFooter dialog={dialog} alignX="right" />}
      dialog={dialog}
      maxWidth="80vw"
      css={DialogCss}
    >
      <FormBody brandId={brandId} readOnly={true} />
    </FormDialog>
  )
}

const AutoSentPlayerBonusFieldName = "autoSentPlayerBonus"
const AutoOrManualPayoutSwitch = ({
  name = AutoSentPlayerBonusFieldName,
  readOnly = false,
  disabled,
  ...props
}) => {
  let { control, setValue } = useFormContext()

  let checked = useWatch({
    control,
    name: AutoSentPlayerBonusFieldName,
    defaultValue: props.checked ?? props?.defaultValue
  })

  let autoPayoutLabel = useTrans({
    zh: "自動",
    en: "Automatic"
  })
  let manualPayoutLabel = useTrans({
    zh: "手动",
    en: "Manual"
  })
  let label = checked ? autoPayoutLabel : manualPayoutLabel

  if (readOnly || disabled) {
    return (
      <>
        <Switch label={label} checked={checked} disabled={disabled} />
        <Switch name={name} label={label} checked={checked} display="none" />
      </>
    )
  }

  return (
    <Switch
      name={name}
      label={label}
      checked={checked}
      onChange={(event) => {
        let checked = event.target.checked
        setValue(name, checked)
      }}
    />
  )
}

const FormBody = ({ brandId, readOnly = false, isAdd = false }) => {
  let { start: startOfToday } = today()
  let formMethods = useFormContext()
  let { control, setValue } = formMethods

  let TotalAmountLimitFieldName = "totalAmountLimit"

  let UnlimitedFieldName = "unlimited"
  let unlimitedTotalAmount = useWatch({
    control,
    name: UnlimitedFieldName
  })
  let limitedTotalAmount = !unlimitedTotalAmount

  let unlimiteTotalAmountLabel = useTrans({
    zh: "无限",
    en: "Unlimited"
  })

  let PromotionTypeGroupFieldName = "promotionTypeGroup"
  let promotionTypeGroup = useWatch({
    control,
    name: PromotionTypeGroupFieldName
  })

  let PromotionTypeFieldName = "promotionType"
  let promotionType = useWatch({
    control,
    name: PromotionTypeFieldName
  })
  let promotionTypeGroupValue = usePromotionGroupValueOf(promotionType)

  let isDepositPromotion =
    promotionTypeGroup === PromotionTypeGroup.Deposit ||
    promotionTypeGroupValue === PromotionTypeGroup.Deposit
  useEffect(() => {
    if (isDepositPromotion) {
      setValue(AutoSentPlayerBonusFieldName, true)
    }
  }, [isDepositPromotion])

  let isPromotionTypeTurnoverRelated =
    promotionTypeGroup === PromotionTypeGroup.Turnover ||
    promotionTypeGroup === PromotionTypeGroup.ReliefMoney

  let GameTypeGroupFieldName = "gameTypeGroup"
  let gameTypeGroup = useWatch({
    control,
    name: GameTypeGroupFieldName
  })

  let GameTypeFieldName = "gameType"
  let gameType = useWatch({
    control,
    name: GameTypeFieldName
  })

  let disabled = readOnly
  let editable = !readOnly
  let required = editable
  return (
    <FieldStack marginLeft="1rem" paddingBottom="1.5rem">
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
          />
        </Box>

        <NormalLabel>
          <Trans zh="活动时间" en="Promotion Period" />
        </NormalLabel>
        <Box id="promotion-period-box" alignY="center">
          <DateInputRange
            startProps={{
              name: "from"
            }}
            endProps={{
              name: "to",
              minDate: startOfToday
            }}
            minDate={isAdd ? startOfToday : undefined}
            disabled={disabled}
            required={required}
          />
        </Box>

        <NormalLabel>
          <Trans zh="活动用户群" en="User Group" />
        </NormalLabel>
        <Box alignY="center">
          <VipLevelCheckboxGroup
            id="vipLevels"
            name="vipLevels"
            valueFieldName="level"
            brandId={brandId}
            disabled={disabled}
            required={required}
          />
        </Box>

        <NormalLabel>
          <Trans zh="活动类型" en="Promotion Type" />
        </NormalLabel>
        <Box alignY="center">
          {editable && (
            <PromotionTypeGroupSelect
              name={PromotionTypeGroupFieldName}
              onChange={(event) => {
                setValue(PromotionTypeFieldName, "")
              }}
            />
          )}
          {disabled && (
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
          {editable && (
            <PromotionTypeSelect
              name={PromotionTypeFieldName}
              group={promotionTypeGroup}
              required
            />
          )}
          {disabled && (
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

        <NormalLabel>
          <Trans zh="活动派发" en="Distribution Method" />
        </NormalLabel>
        <Box>
          {isDepositPromotion && (
            <AutoOrManualPayoutSwitch readOnly disabled checked={true} />
          )}
          {!isDepositPromotion && (
            <AutoOrManualPayoutSwitch readOnly={readOnly} disabled={disabled} />
          )}
        </Box>

        <NormalLabel>
          <Trans zh="活动总费用" en="Promotion Funds" />
        </NormalLabel>
        <Set orientation="horizontal" alignY="center">
          {limitedTotalAmount && (
            <>
              <NumberInput
                name={TotalAmountLimitFieldName}
                registerOptions={{
                  valueAsNumber: true
                }}
                required
                disabled={disabled}
              />
            </>
          )}
          <Checkbox
            name={UnlimitedFieldName}
            label={unlimiteTotalAmountLabel}
            disabled={disabled}
          />
        </Set>

        {isPromotionTypeTurnoverRelated && (
          <>
            <NormalLabel>
              <Trans zh="活动游戏类型" en="Game Type" />
            </NormalLabel>
            <Box>
              {editable && (
                <GameTypeGroupSelect
                  name={GameTypeGroupFieldName}
                  disabled={disabled}
                />
              )}
              {disabled && (
                <>
                  <GameTypeGroupSelect
                    name={GameTypeGroupFieldName}
                    value={gameTypeGroup}
                    display="none"
                  />
                  <GameTypeGroupSelect value={gameTypeGroup} disabled />
                </>
              )}
            </Box>
          </>
        )}

        {isPromotionTypeTurnoverRelated && (
          <>
            <NormalLabel>
              <Trans zh="活动游戏子类型" en="Game SubType" />
            </NormalLabel>
            <GameTypeSelect
              name={GameTypeFieldName}
              group={gameTypeGroup}
              disabled={disabled}
              required
            />
          </>
        )}

        {isPromotionTypeTurnoverRelated && (
          <>
            <NormalLabel>
              <Trans zh="活动厂商" en="GP Participation" />
            </NormalLabel>
            <Box>
              <BrandGameProviderCheckboxGroupTable
                brandId={brandId}
                disabled={disabled}
                gameType={gameType}
              />
            </Box>
          </>
        )}
      </FieldValues>

      <Separator />

      <Heading use="h5">
        <Trans zh="活动内容" en="Promotion Content" />
      </Heading>
      <FieldValues>
        <NormalLabel>
          <Trans zh="活动子标题" en="Promotion SubTitle" />
        </NormalLabel>
        <Box alignY="center">
          <InputField
            name="subSubject"
            brandId={brandId}
            showLocalizationAddonAfter
            disabled={disabled}
            readOnly={readOnly}
          />
        </Box>

        <NormalLabel>
          <Trans zh="活动 Banner (PC)" en="Promotion Banner (PC)" />
        </NormalLabel>
        <Set orientation="vertical" alignY="center">
          <ImageUploadButton
            id="desktopBanner"
            brandId={brandId}
            name="desktopBanner"
            prefix="promotion"
            disabled={disabled}
            readOnly={readOnly}
            required={required}
          />
          <Text.Block color="warning" fontWeight="bold" fontSize="150">
            <Trans
              zh="建議尺寸:  T1,T3,T4: 1200 x 485px；T2: 470 x 200px"
              en="Recommended size: 1200 x 485px；T2 470 x 200px"
            />
          </Text.Block>
        </Set>

        <NormalLabel>
          <Trans zh="活动 Banner (Mobile)" en="Promotion Banner (Mobile)" />
        </NormalLabel>
        <Set orientation="vertical" alignY="center">
          <ImageUploadButton
            id="mobileBanner"
            brandId={brandId}
            name="mobileBanner"
            prefix="promotion"
            disabled={disabled}
            readOnly={readOnly}
            required={required}
          />
          <Text.Block color="warning" fontWeight="bold" fontSize="150">
            <Trans
              zh="建議尺寸: 690 x 280px"
              en="Recommended size: 690 x 280px"
            />
          </Text.Block>
        </Set>

        <NormalLabel>
          <Trans zh="活动内容" en="Promotion Content" />
        </NormalLabel>
        <Box alignY="center">
          <HtmlEditorDisclosure
            brandId={brandId}
            name="content"
            disabled={disabled}
            readOnly={readOnly}
          />
        </Box>

        <NormalLabel>
          <Trans zh="活动条款与条规" en="Promotion Rules" />
        </NormalLabel>
        <Box alignY="center">
          <HtmlEditorDisclosure
            brandId={brandId}
            name="terms"
            disabled={disabled}
            readOnly={readOnly}
          />
        </Box>
      </FieldValues>

      <Separator />

      <Heading use="h5">
        <Trans zh="規則設定" en="Rule Settings" />
      </Heading>

      <PromotionRuleSetting
        promotionTypeGroup={promotionTypeGroup}
        totalAmountLimitFieldName={TotalAmountLimitFieldName}
        limitedTotalAmount={limitedTotalAmount}
        readOnly={readOnly}
      />
    </FieldStack>
  )
}

const HtmlEditorDisclosure = ({ brandId, name, readOnly }) => {
  let dialog = useModalState()

  let editTitle = useTrans({
    zh: "编辑",
    en: "Edit"
  })
  let viewTitle = useTrans({
    zh: "查看",
    en: "View"
  })
  let title = readOnly ? viewTitle : editTitle
  return (
    <>
      <Disclosure width="fit-content" {...dialog}>
        {title}
      </Disclosure>
      {dialog.visible && (
        <HtmlEditorDialog
          brandId={brandId}
          name={name}
          readOnly={readOnly}
          dialog={dialog}
          title={title}
        />
      )}
    </>
  )
}

const HtmlEditorDialog = ({
  brandId,
  name,
  readOnly,
  dialog,
  title,
  ...props
}) => {
  let { visible } = props
  return (
    <Backdrop
      {...dialog}
      css={css`
        .tox-fullscreen & {
          top: 0;
          left: 0;
          transform: none;
        }
      `}
    >
      <Dialog.Modal
        {...dialog}
        hideBackdrop
        hideOnClickOutside={false}
        showCloseButton
        title={title}
        width="70vw"
        maxWidth="80vw"
        css={css`
          & .bb-DialogContent {
            max-height: 80vh;
          }
          .tox-fullscreen & {
            top: 0;
            left: 0;
            transform: none;
          }
        `}
      >
        <HtmlEditor
          brandId={brandId}
          name={name}
          imagesUploadUrl={toFileUploadPath("promotion")}
          readOnly={readOnly}
          height="480"
          active={visible}
          showLocalizationAddonAfter
        />
      </Dialog.Modal>
    </Backdrop>
  )
}
