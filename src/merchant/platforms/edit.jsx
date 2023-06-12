import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  useModalState,
  Stack,
  Heading,
  Box,
  Text,
  FieldStack,
  Button,
  Set,
  Group
} from "bumbag"
import { useIsDisplayMenuByRoute, useUserLicenseeId } from "../../user/context"
import Disclosure, { AddDisclosure } from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import { Update as UpdateMenu, View as ViewMenu } from "./menu"
import { Trans, useTrans } from "../../i18n"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import {
  CloseButtonFooter,
  ConfirmButtonFooter
} from "../../form/ConfirmButtonFooter"
import { Input, InputField } from "../../input/Input"
import { MerchantIdSelect } from "../MerchantSelect"
import { RoleTypes } from "../../system/roles/type"
import { useAddBrand, useBrand, useUpdateBrand } from "./client"
import {
  useFormContext,
  useFieldArray,
  useForm,
  useWatch
} from "react-hook-form"
import { FieldValues } from "../../layout/Grid"
import { NormalLabel } from "../../form/Label"
import Textarea from "../../textarea"
import { BrandLanguageCheckboxGroupTable } from "./BrandLanguageCheckboxGroup"
import { BrandGameProviderCheckboxGroupTable } from "./BrandGameProviderCheckboxGroup"
import { BrandBetLimitCheckboxGroupTable } from "./BrandBetLimitCheckboxGroup"
import useLicenseeBrand from "./useLicenseeBrand"
import CurrencyFieldsBox, {
  mapCheckedCurrencyCodes,
  toCheckedCurrencyCodes
} from "../CurrencyFieldsBox"
import { toCheckedFieldName } from "../../currency/CurrencyCheckboxGroup"
import CurrencyBetLimitFieldsBox, {
  flatCheckedCurrencyBetLimits
} from "../CurrencyBetLimitFieldsBox"
import SettlementIntervalType, {
  isMonthlySettlementInterval,
  MonthlyDaySelect,
  SettlementIntervalTypeSelect
} from "../../date/SettlementIntervalType"
import BusinessType from "../BusinessType"
import Select from "../../select/Select"
import {
  PercentageNumberInputField,
  NumberInputField
} from "../../input/NumberInput"
import { isDev } from "../../env"
import Checkbox from "../../checkbox"
import {
  AgentProfitSharingTypeLabel,
  AgentProfitSharingTypeSelect,
  isAgentProfitSharingMultipleLayer
} from "../../agent/AgentProfitSharingType"
import { PlatformTokenActionButtons } from "./PlatformTokenActionButtons"
import { TimezoneSelect, SystemZoneOffset } from "../../date/TimeZone"

export const AddButton = ({ onSubmitted, ...props }) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([UpdateMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <AddDisclosure {...dialog} {...props} />
      {dialog.visible && (
        <AddDialog onSubmitted={onSubmitted} dialog={dialog} />
      )}
    </>
  )
}

const AddDialog = ({ onSubmitted, dialog }) => {
  let userLicenseeId = useUserLicenseeId()
  let formMethods = useForm({
    defaultValues: {
      domains: [],
      licenseeId: userLicenseeId
    }
  })
  let { watch } = formMethods
  let resellerId = watch("resellerId")
  let licenseeId = watch("licenseeId")
  let {
    licensee,
    businessType,
    languages,
    currencies,
    gameProviders,
    betLimits,
    isLoading: isLoadingLicensee,
    error: licenseeError
  } = useLicenseeBrand({ licenseeId })

  useEffect(() => {
    if (licensee) {
      formMethods.reset({
        resellerId,
        licenseeId,
        languages,
        currencies,
        gameProviders,
        betLimits
      })
    }
  }, [licensee])

  let [formData, setSubmit] = useState()
  let { result, isLoading, error, mutate, deleteCache } = useAddBrand(formData)

  const onSubmit = (data) => {
    let formData = normalizeFormData(data)

    if (userLicenseeId) {
      formData.licenseeId = userLicenseeId
    }

    setSubmit(formData)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  let title = useTrans({
    zh: "新增平台",
    en: "Add Platform"
  })
  return (
    <FormDialog
      id="add-platform-dialog"
      formMethods={formMethods}
      onSubmit={onSubmit}
      result={result}
      isLoading={isLoading}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={() => {
        reset()
        onSubmitted?.()
      }}
      showActionButtons={false}
      footer={
        <ConfirmButtonFooter isLoading={isLoading} disabled={isLoading} />
      }
      title={title}
      dialog={dialog}
      placement="top"
      minWidth="60vw"
      css={css`
        & .bb-DialogContent {
          position: relative;
        }
      `}
    >
      <EditBody isAdd={true} businessType={businessType} />
    </FormDialog>
  )
}

export const ViewButton = ({ record, ...props }) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([ViewMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="查看" en="View" />
      </Disclosure>
      {dialog.visible && (
        <ViewDialog
          brandId={record?.id}
          licenseeId={record?.licenseeId}
          dialog={dialog}
        />
      )}
    </>
  )
}

const ViewDialog = ({ brandId, licenseeId, dialog, ...props }) => {
  let {
    brand,
    licensee,
    businessType,
    languages,
    currencies,
    gameProviders,
    games,
    betLimits,
    isLoading,
    error,
    mutateBrand,
    deleteBrandCache
  } = useLicenseeBrand({ brandId, licenseeId })

  let title = useTrans({
    zh: "查看平台",
    en: "View Platform"
  })

  if (isLoading) {
    return <LoadingBackdrop {...dialog} onClickClose={dialog.hide} />
  }

  if (error) {
    return <AlertDialog {...error} {...dialog} onClickClose={dialog.hide} />
  }

  const reset = () => {
    mutateBrand(undefined, false)
    deleteBrandCache()
  }

  let record = {
    ...brand,
    licensee,
    languages,
    currencies,
    gameProviders,
    games,
    betLimits
  }
  return (
    <FormDialog
      defaultValues={record}
      onClickClose={reset}
      title={title}
      dialog={dialog}
      showActionButtons={false}
      footer={<CloseButtonFooter dialog={dialog} onClickClose={reset} />}
      placement="top"
      minWidth="60vw"
      css={css`
        & .bb-DialogContent {
          position: relative;
        }
      `}
    >
      <EditBody readonly record={record} businessType={businessType} />
    </FormDialog>
  )
}

export const EditButton = ({ record, onSubmitted, ...props }) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([UpdateMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure data-platform-id={record?.id} {...dialog} {...props}>
        <Trans zh="修改" en="Edit" />
      </Disclosure>
      {dialog.visible && (
        <EditDialog
          brandId={record?.id}
          licenseeId={record?.licenseeId}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

const EditDialog = ({ brandId, licenseeId, onSubmitted, dialog, ...props }) => {
  let {
    brand,
    licensee,
    businessType,
    languages,
    currencies,
    gameProviders,
    games,
    betLimits,
    isLoading: isLoadingBrand,
    error: brandError,
    mutateBrand,
    deleteBrandCache
  } = useLicenseeBrand({ brandId, licenseeId })

  let [formData, setSubmit] = useState()
  let { result, isLoading, error, mutate, deleteCache } = useUpdateBrand(
    brandId,
    formData
  )

  let title = useTrans({
    zh: "编辑平台",
    en: "Edit Platform"
  })

  if (isLoadingBrand) {
    return <LoadingBackdrop {...dialog} />
  }

  if (brandError) {
    return (
      <AlertDialog {...brandError} {...dialog} onClickClose={dialog.hide} />
    )
  }

  const onSubmit = (data) => {
    let { gameProviders = [], ...restData } = normalizeFormData(data)
    let gameProviderIds = gameProviders.map(
      ({ gameProviderId }) => gameProviderId
    )
    let games = brand.games.filter(({ gameProviderId }) =>
      gameProviderIds.includes(gameProviderId)
    )

    let brandGroups = brand.brandGroups.map(
      ({ brandGames = [], ...brandGroup }) => ({
        brandGames: brandGames.filter(({ gameProviderId }) =>
          gameProviderIds.includes(gameProviderId)
        ),
        ...brandGroup
      })
    )

    let formData = {
      ...brand,
      gameProviders,
      games,
      brandGroups,
      ...restData
    }

    setSubmit(formData)
  }

  const reset = () => {
    mutateBrand(undefined, false)
    deleteBrandCache()

    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  let record = {
    domains: [],
    ...brand,
    licensee,
    languages,
    currencies,
    gameProviders,
    games,
    betLimits
  }

  return (
    <FormDialog
      id="edit-platform-dialog"
      defaultValues={record}
      onSubmit={onSubmit}
      result={result}
      isLoading={isLoading}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={() => {
        reset()
        onSubmitted?.()
      }}
      onClickClose={reset}
      title={title}
      showActionButtons={false}
      footer={
        <ConfirmButtonFooter isLoading={isLoading} disabled={isLoading} />
      }
      dialog={dialog}
      placement="top"
      minWidth="60vw"
      css={css`
        & .bb-DialogContent {
          position: relative;
        }
      `}
    >
      <EditBody record={record} businessType={businessType} />
    </FormDialog>
  )
}

const normalizeFormData = ({
  languages,
  currencies,
  gameProviders,
  betLimits,
  ...data
}) => {
  languages = languages
    .filter(({ checked }) => checked)
    .map(({ cultureCode, brandCultureCode }) => ({
      cultureCode,
      brandCultureCode: brandCultureCode || cultureCode
    }))

  let currencyCodes = toCheckedCurrencyCodes(currencies)

  gameProviders = gameProviders
    .filter(({ checked }) => checked)
    .map(({ id, checked, ...gameProvider }) =>
      id ? { id, ...gameProvider } : gameProvider
    )

  betLimits = flatCheckedCurrencyBetLimits(
    ({ checked, ...betLimit }) => betLimit,
    currencies
  )

  return {
    ...data,
    languages,
    currencyCodes,
    gameProviders,
    betLimits
  }
}

const EditBody = ({ record, readonly, isAdd = false, businessType }) => {
  let { getValues, control } = useFormContext()

  let userLicenseeId = useUserLicenseeId()

  let licensee = useWatch({
    control,
    name: "licensee"
  })

  let SettlementIntervalTypeFieldName = "settlementIntervalType"
  let settlementIntervalType = useWatch({
    control,
    name: SettlementIntervalTypeFieldName
  })
  let isMonthly = isMonthlySettlementInterval(settlementIntervalType)

  let editable = !readonly

  let apiKeyInputRef = useRef()

  let isB2C = businessType === BusinessType.B2C
  let isB2B = businessType === BusinessType.B2B

  let AgentDividendTypeFieldName = "agentDividendType"
  let agentDividendType = useWatch({
    control,
    name: AgentDividendTypeFieldName
  })

  let CheckDividendActiveCountFieldName = "checkDividendActiveCount"
  let checkDividendActiveCountLabel = useTrans({
    zh: "分紅比例需判斷活躍人數",
    en: "Profit sharing affected by active player"
  })

  return (
    <Stack orientation="vertical" marginLeft="1rem" paddingBottom="1.5rem">
      <Heading use="h5" marginBottom="major-1">
        <Trans zh="基本资料" en="Basic Information" />
      </Heading>

      <FieldValues>
        {!userLicenseeId && (
          <>
            <NormalLabel>
              <Trans zh="所属公司" en="Licensee" />
            </NormalLabel>
            <Box alignY="center">
              {isAdd && <MerchantIdSelect end={RoleTypes.Licensee} />}
              {!isAdd && <Text.Block>{licensee?.name}</Text.Block>}
            </Box>
          </>
        )}

        {!isAdd && (
          <>
            <NormalLabel>
              <Trans zh="ID" en="ID" />
            </NormalLabel>
            <Box alignY="center">
              <Text.Block>{getValues("id")}</Text.Block>
            </Box>
          </>
        )}

        <NormalLabel>
          <Trans zh="平台代码" en="Code" />
        </NormalLabel>
        <Box alignY="center">
          <Input
            name="code"
            type={isAdd ? "input" : "hidden"}
            /*
            inputProps={
              isDev()
                ? {
                    textTransform: "uppercase"
                  }
                : {}
            }
            registerOptions={
              isDev()
                ? {
                    setValueAs: (value = "") => value?.toUpperCase?.()
                  }
                : {}
            }
             */
          />
          {!isAdd && <Text.Block>{getValues("code")}</Text.Block>}
        </Box>

        <NormalLabel>
          <Trans zh="平台名称" en="Name" />
        </NormalLabel>
        <Box alignY="center">
          {editable && <Input name="name" required />}
          {readonly && <Text.Block>{record?.name}</Text.Block>}
        </Box>

        <NormalLabel>
          <Trans zh="平台简介" en="Description" />
        </NormalLabel>
        <Box alignY="center">
          {editable && <Textarea name="description" />}
          {readonly && <Text.Block>{record.description}</Text.Block>}
        </Box>

        <NormalLabel>
          <Trans zh="平台邮箱" en="Email" />
        </NormalLabel>
        <Box alignY="center">
          {editable && <Input type="email" name="operationalEmail" required />}
          {readonly && <Text.Block>{record.operationalEmail}</Text.Block>}
        </Box>

        <NormalLabel>
          <Trans zh="分紅模式" en="Profit Sharing Type" />
        </NormalLabel>
        <Box alignY="center">
          {isAdd && (
            <AgentProfitSharingTypeSelect
              name={AgentDividendTypeFieldName}
              required
            />
          )}
          {!isAdd && (
            <AgentProfitSharingTypeLabel value={record.agentDividendType} />
          )}
        </Box>

        <NormalLabel>
          <Trans zh="平台域名" en="Brand Domain" />
        </NormalLabel>
        <Box alignY="center">
          <Input name="domains.0" disabled={readonly} />
        </Box>

        {!isAdd && (
          <>
            <NormalLabel>
              <Trans zh="API密钥 " en="API Key" />
            </NormalLabel>
            <Box alignY="center">
              <Input type="hidden" name="apiKey" />
              <InputField
                readonly
                inputRef={apiKeyInputRef}
                defaultValue={getValues("apiKey")}
                addonAfter={
                  <Button
                    onClick={() => {
                      let target = apiKeyInputRef.current
                      target.select()
                      document.execCommand("copy")
                    }}
                  >
                    <Trans zh="复制" en="Copy" />
                  </Button>
                }
                css={css`
                  & input {
                    text-overflow: ellipsis;
                  }
                `}
              />
            </Box>
          </>
        )}

        {!isAdd && (
          <>
            <NormalLabel>
              <Trans zh="Brand Token" en="Brand Token" />
            </NormalLabel>
            <Box alignY="center">
              <PlatformTokenActionButtons platformId={getValues("id")} />
            </Box>
          </>
        )}

        <NormalLabel>
          <Trans zh="代理分红周期" en="Agent Profit Sharing Interval" />
        </NormalLabel>
        <Box alignY="center">
          <Set orientation="horizontal">
            <SettlementIntervalTypeSelect
              name={SettlementIntervalTypeFieldName}
              required
              disabled={readonly}
            />
            {isMonthly && <MonthlyDaySelect name="settlementDay" />}
            {isAgentProfitSharingMultipleLayer(agentDividendType) && (
              <Checkbox
                name={CheckDividendActiveCountFieldName}
                label={checkDividendActiveCountLabel}
                disabled={readonly}
              />
            )}
          </Set>
        </Box>

        <NormalLabel>
          <Trans zh="时区" en="Time Zone" />
        </NormalLabel>
        <Box>
          <TimezoneSelect
            name="timeSpanMinutes"
            defaultValue={isAdd ? SystemZoneOffset : undefined}
            rangeStart={0}
            rangeEnd={13}
            disabled={readonly || !isAdd}
          />
        </Box>

        <NormalLabel>
          <Trans zh="产品费用" en="Product Fee" />
        </NormalLabel>
        <Box>
          <PercentageNumberInputField
            name="platformCharge"
            readOnly={readonly}
            disabled={!editable}
            width="fit-content"
          />
        </Box>

        <NormalLabel>
          <Trans zh="自动清除流水" en="Auto Clear Wagering Requirement" />
        </NormalLabel>
        <Set alignY="center">
          <Checkbox name="autoClearWageringRequirement" disabled={readonly} />
          <NumberInputField
            name="autoClearWageringRequirementBalance"
            addonBefore={
              <Button isStatic>
                <Trans zh="玩家钱包余额 ＜＝" en="Player Wallet Balance ＜＝" />
              </Button>
            }
            disabled={readonly}
          />
        </Set>

        <NormalLabel>
          <Trans zh="身分证审核" en="ID Verification" />
        </NormalLabel>
        <Box alignY="center">
          <Checkbox name="enablePlayerIdentity" disabled={readonly} />
        </Box>

        <LanguageFieldsBox
          readonly={readonly}
          brandCultureCodeReadOnly={isB2C}
        />

        <CurrencyBetLimitFieldsBox readonly={readonly} showBetLimitDefault />

        <BrandGameProviderFieldsBox readonly={readonly} />
      </FieldValues>
    </Stack>
  )
}

const LanguageFieldsBox = ({ readonly, brandCultureCodeReadOnly }) => {
  let { control } = useFormContext()

  let fieldsName = "languages"
  let fieldArrayContext = useFieldArray({
    control,
    name: fieldsName,
    keyName: "_id"
  })
  let languages = useWatch({
    control,
    name: fieldsName
  })

  if (!languages || languages.length == 0) {
    return null
  }

  return (
    <>
      <NormalLabel>
        <Trans zh="语言" en="Language" />
      </NormalLabel>
      <BrandLanguageCheckboxGroupTable
        fieldArrayContext={fieldArrayContext}
        disabled={readonly}
        brandCultureCodeReadOnly={brandCultureCodeReadOnly}
      />
    </>
  )
}

const BrandGameProviderFieldsBox = ({ readonly }) => {
  let { control } = useFormContext()

  let fieldsName = "gameProviders"
  let fieldArrayContext = useFieldArray({
    control,
    name: fieldsName,
    keyName: "_id"
  })
  let gameProviders = useWatch({
    control,
    name: fieldsName
  })

  if (!gameProviders || gameProviders.length == 0) {
    return null
  }

  return (
    <>
      <NormalLabel>
        <Trans zh="游戏厂商" en="Game Provider" />
      </NormalLabel>
      <BrandGameProviderCheckboxGroupTable
        marginTop="major-1"
        fieldArrayContext={fieldArrayContext}
        disabled={readonly}
      />
    </>
  )
}
