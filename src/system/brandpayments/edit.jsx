import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  useForm,
  FormProvider,
  useFormContext,
  Controller,
  useWatch
} from "react-hook-form"
import {
  Stack,
  Box,
  Set,
  Button,
  Text,
  Modal,
  Dialog,
  Columns,
  Heading,
  Flex,
  Group,
  List as _List,
  applyTheme
} from "bumbag"
import { useModalState } from "../../dialog/Modal"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Update as UpdateMenu } from "./menu"
import { Trans, useTrans } from "../../i18n"
import { AddDisclosure, EditDisclosure } from "../../dialog/Disclosure"
import { ConfirmButtonFooter } from "../../form/ConfirmButtonFooter"
import { FieldValues } from "../../layout/Grid"
import { NormalLabel as Label } from "../../form/Label"
import BrandPaymentStatus, {
  BrandPaymentStatusButton
} from "./BrandPaymentStatus"
import {
  useUpdateBrandPayment,
  useBrandPaymentUpload,
  useAddDepositBrandPayment,
  useAddWithdrawBrandPayment,
  useBrandPayment
} from "./client"
import AlertDialog from "../../dialog/Alert"
import {
  AllPlayerText,
  AccumulatedDepositText,
  UnlimitedText,
  IdentityAuthenticationText,
  PhoneAuthenticationText,
  VipLevelsText,
  PlayerListConditionRadioGroup,
  PlayerListCondition
} from "./condition"
import { VipLevelCheckboxGroup } from "../../vip-levels/CheckboxGroup"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import { NumberRangeInputGroup } from "../../number/RangeInput"
import FormDialog from "../../form/FormDialog"
import Textarea from "../../textarea"
import Input from "../../input/Input"
import { Checkbox, CheckboxField } from "../../checkbox/Checkbox"
import { Switch } from "../../switch/Switch"
import clone from "clone-deep"
import {
  usePaymentList,
  usePaymentMethodChannelList
} from "../../payment/client"
import { PaymentProviderLabel } from "../../payment/PaymentProvider"
import {
  PaymentMethodLabel,
  PaymentMethodSelect
} from "../../payment/method/PaymentMethod"
import {
  PaymentChannelLabel,
  PaymentChannelSelect
} from "../../payment/channel/PaymentChannel"
import { parseJSON } from "../../text/json"
import { head } from "lodash-es"
import ImageUploadButton from "../../file/upload/ImageUploadButton"
import { isDev } from "../../env"
import TransferType, {
  isDepositPlatformPayment
} from "./BrandPaymentTransferType"
import { PaymentMethodSetting } from "./PaymentMethodSetting"

export const EditButton = ({
  brandId,
  platformPaymentId,
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
      <EditDisclosure {...dialog} />
      {dialog.visible && (
        <EditDialog
          brandId={brandId}
          platformPaymentId={platformPaymentId}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

const EditDialog = ({
  brandId,
  platformPaymentId,
  onSubmitted,
  dialog,
  ...props
}) => {
  let title = useTrans({
    zh: "编辑",
    en: "Edit"
  })

  let {
    isLoading: isLoadingPayment,
    manualPayment,
    manualPaymentMethodList,
    manualPaymentMethodChannelList,
    error: loadingPaymentError,
    mutate: mutatePlatformPayment,
    deleteCache: deletePlatformPaymentCache
  } = usePlatformPayment(platformPaymentId)

  let [submitData, setSubmit] = useState()

  let { result, isLoading, error, mutate, deleteCache } = useUpdateBrandPayment(
    platformPaymentId,
    submitData
  )

  if (isLoadingPayment) {
    return <LoadingBackdrop {...dialog} />
  }

  if (loadingPaymentError) {
    return <AlertDialog {...loadingPaymentError} onClickClose={dialog.hide} />
  }

  const resetPlatformPayment = () => {
    mutatePlatformPayment(null, false)
    deletePlatformPaymentCache()
  }
  // extendedData = parseJSON(extendedData)
  console.log("record?.extendedData", record?.extendedData)
  return (
    <FormDialog
      defaultValues={clone(record)}
      /*
      defaultValues={clone({
        ...record,
        extendedData,
        reason: ""
      })}
      */
      onSubmit={(data) => {
        setSubmit({
          brandId,
          ...record,
          /*
                    ...brandPaymentData.payment,
                    */
          ...data,
          depositedAmountMax:
            data?.depositedAmountMax ?? record?.depositedAmountMax
        })
      }}
      result={result}
      isLoading={isLoading}
      error={error}
      onCloseErrorAlert={() => {
        deleteCache()
        mutate(undefined, false)
        setSubmit(undefined)
      }}
      onSubmitted={() => {
        resetPlatformPayment()
        onSubmitted?.()
      }}
      footer={
        <ConfirmButtonFooter
          alignX="center"
          width="100%"
          isLoading={isLoading}
          disabled={isLoading}
        />
      }
      title={title}
      showCloseButton
      showActionButtons={false}
      maxWidth="unset"
      width="80vw"
      height="95vh"
      maxHeight="95vh"
      placement="top"
      display="flex"
      flexDirection="column"
      css={css`
        & .bb-Flex.bb-DialogContent {
          max-height: 95vh;
          flex: 1 auto;
          padding-bottom: 0.5em;
        }

        & .bb-DialogContent > .bb-Box {
          display: flex;
          flex-direction: column;
        }
      `}
      dialog={dialog}
    >
      <EditBody
        brandId={brandId}
        record={record}
        manualPayment={manualPayment}
        manualPaymentMethodList={manualPaymentMethodList}
        manualPaymentMethodChannelList={manualPaymentMethodChannelList}
      />
    </FormDialog>
  )
}

export const AddBrandPaymentButton = ({
  brandId,
  transferType,
  onSubmitted,
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([UpdateMenu])
  if (!isDisplay) {
    return null
  }

  let useFetch = isDepositPlatformPayment(transferType)
    ? useAddDepositBrandPayment
    : useAddWithdrawBrandPayment
  return (
    <>
      <AddDisclosure {...dialog} {...props} />
      {dialog.visible && (
        <AddDialog
          id="add-payment-dialog"
          brandId={brandId}
          transferType={transferType}
          useFetch={useFetch}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

const usePlatformPayment = (platformPaymentId) => {
  let {
    isLoading: isLoadingPlatformPayment,
    data: record,
    error: platformPaymentError,
    mutate,
    deleteCache
  } = useBrandPayment(platformPaymentId)

  let {
    isLoading: isLoadingPaymentList,
    data: paymentListData,
    error: paymentListError,
    mutate: mutatePaymentList,
    deleteCache: deletePaymentListCache
  } = usePaymentList()

  let {
    isLoading: isLoadingBrandPaymentMethodChannelList,
    data: paymentMethodChannelList,
    error: paymentMethodChannelListError,
    mutate: mutatePaymentMethodChannelList,
    deleteCache: deletePaymentMethodChannelListCache
  } = usePaymentMethodChannelList()

  let manualPayment = paymentListData?.find(({ code }) => code === "Manual")

  let manualPaymentMethodChannelList =
    paymentMethodChannelList?.allData?.filter?.(
      ({ paymentId }) => manualPayment.id === paymentId
    )

  let manualPaymentMethodIds = manualPaymentMethodChannelList?.map(
    ({ methodId }) => methodId
  )

  let manualPaymentMethodList = paymentMethodChannelList?.methods?.filter?.(
    ({ id }) => manualPaymentMethodIds?.includes(id)
  )

  return {
    isLoading:
      isLoadingPlatformPayment ||
      isLoadingPaymentList ||
      isLoadingBrandPaymentMethodChannelList,
    record,
    manualPayment,
    manualPaymentMethodList,
    manualPaymentMethodChannelList,
    error:
      platformPaymentError || paymentListError || paymentMethodChannelListError,
    mutatePaymentList,
    mutatePaymentMethodChannelList,
    mutate,
    deleteCache
  }
}

const ManualCode = "Manual"
const AddDialog = ({
  brandId,
  transferType,
  useFetch,
  onSubmitted,
  dialog,
  ...props
}) => {
  let {
    isLoading: isLoadingPayment,
    manualPayment,
    manualPaymentMethodList,
    manualPaymentMethodChannelList,
    error: loadingPaymentError
  } = usePlatformPayment()

  let title = useTrans({
    zh: "新增",
    en: "Add"
  })

  let [formData, setSubmit] = useState()
  let { result, isLoading, error, mutate, deleteCache } = useFetch(formData)

  if (isLoadingPayment) {
    return <LoadingBackdrop {...dialog} />
  }

  if (loadingPaymentError) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

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
      defaultValues={{
        paymentName: ManualCode,
        transferType,
        paymentStatus: BrandPaymentStatus.Enabled,
        paymentMethodId:
          manualPaymentMethodList?.length == 1
            ? head(manualPaymentMethodList)?.id
            : "",
        paymentMethodChannelId: "",
        playerListCondition: PlayerListCondition.MatchOne,
        allPlayers: true,
        depositedAmountMin: "0",
        extendedData: {}
      }}
      onSubmit={onSubmit}
      result={result}
      isLoading={isLoading}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={onSubmitted}
      footer={
        <ConfirmButtonFooter
          alignX="center"
          width="100%"
          isLoading={isLoading}
          disabled={isLoading}
        />
      }
      title={title}
      showCloseButton
      showActionButtons={false}
      maxWidth="unset"
      width="80vw"
      height="95vh"
      maxHeight="95vh"
      placement="top"
      display="flex"
      flexDirection="column"
      css={css`
        & .bb-Flex.bb-DialogContent {
          max-height: 95vh;
          flex: 1 auto;
          padding-bottom: 0.5em;
        }

        & .bb-DialogContent > .bb-Box {
          display: flex;
          flex-direction: column;
        }
      `}
      dialog={dialog}
      {...props}
    >
      <EditBody
        brandId={brandId}
        isAdd={true}
        manualPayment={manualPayment}
        manualPaymentMethodList={manualPaymentMethodList}
        manualPaymentMethodChannelList={manualPaymentMethodChannelList}
      />
    </FormDialog>
  )
}

const EditBody = ({
  brandId,
  isAdd = false,
  record = {},
  manualPayment = {},
  manualPaymentMethodList = [],
  manualPaymentMethodChannelList = [],
  dialog,
  ...props
}) => {
  let { setValue, getValues, control } = useFormContext()

  const paymentName = getValues("paymentName")
  const TransferLimitToFieldName = "transferLimitTo"
  let transferLimitTo = useWatch({
    name: TransferLimitToFieldName,
    control
  })

  const TransferLimitFromFieldName = "transferLimitFrom"
  let transferLimitFrom = useWatch({
    name: TransferLimitFromFieldName,
    control
  })

  const PaymentChannelIdFieldName = "paymentChannelId"
  let paymentChannelId = useWatch({
    name: PaymentChannelIdFieldName,
    control
  })

  const PaymentMethodFieldName = "paymentMethodId"
  let paymentMethodId = useWatch({
    name: PaymentMethodFieldName,
    control
  })

  let paymentChannelListRange = paymentMethodId
    ? manualPaymentMethodChannelList.filter(
        ({ methodId }) => methodId == paymentMethodId
      )
    : manualPaymentMethodChannelList

  let manualPaymentProdiverChanneIdRange = paymentChannelListRange?.map?.(
    ({ channelId }) => channelId
  )

  const PaymentMethodChannelIdFieldName = "paymentMethodChannelId"
  let paymentMethodChannelId = useWatch({
    name: PaymentMethodChannelIdFieldName,
    control
  })

  let isEdit = !isAdd
  let paymentId = isAdd ? manualPayment?.id : record?.paymentId

  let paymentMethod = manualPaymentMethodList?.find(
    ({ id }) => id == paymentMethodId
  )

  let manualPaymentMethodIdList = manualPaymentMethodList?.map(({ id }) => id)

  let isManualPaymentProvider = paymentName == ManualCode
  let isManualPaymentProviderMethod =
    isManualPaymentProvider &&
    manualPaymentMethodIdList?.includes(paymentMethodId)
  useEffect(() => {
    if (isManualPaymentProvider && isManualPaymentProviderMethod) {
      let paymentMethodChannel = manualPaymentMethodChannelList.find((item) => {
        return (
          item.paymentId === paymentId &&
          item.methodId === paymentMethodId &&
          item.channelId === paymentChannelId
        )
      })
      setValue(PaymentMethodChannelIdFieldName, paymentMethodChannel?.id ?? "")
    }
  }, [isManualPaymentProvider, paymentChannelId, paymentMethodId])
  return (
    <Stack
      orientation="vertical"
      display="flex"
      flexDirection="column"
      flex="1 auto"
    >
      <Columns flex="1 auto" marginBottom="major-1">
        <Columns.Column>
          <Stack
            spacing="major-1"
            display="flex"
            flexDirection="column"
            height="100%"
          >
            <Heading use="h5">
              <Trans zh="基本资料" en="Basic" />
            </Heading>
            <FieldValues>
              <Label>
                <Trans zh="支付厂商" en="Payment Name" />
              </Label>
              <Box alignY="center">
                <Input type="hidden" name="paymentId" value={paymentId} />
                <PaymentProviderLabel value={paymentId} />
              </Box>

              <Label>
                <Trans zh="支付方式" en="Payment Medthod" />
              </Label>
              <Box alignY="center">
                {isAdd && (
                  <PaymentMethodSelect
                    name={PaymentMethodFieldName}
                    range={manualPaymentMethodIdList}
                    required
                  />
                )}
                {isEdit && isManualPaymentProviderMethod && (
                  <PaymentMethodSelect
                    name={PaymentMethodFieldName}
                    range={manualPaymentMethodIdList}
                    required
                  />
                )}
                {isEdit && !isManualPaymentProviderMethod && (
                  <PaymentMethodLabel
                    range={manualPaymentMethodIdList}
                    value={record?.paymentMethodId}
                  />
                )}
                <Input
                  type="hidden"
                  name={PaymentMethodChannelIdFieldName}
                  value={paymentMethodChannelId}
                />
              </Box>

              <Label>
                <Trans zh="支付通道" en="Payment Channel" />
              </Label>
              <Box alignY="center">
                {isAdd && (
                  <PaymentChannelSelect
                    name={PaymentChannelIdFieldName}
                    range={manualPaymentProdiverChanneIdRange}
                    required
                  />
                )}
                {isEdit && isManualPaymentProviderMethod && (
                  <PaymentChannelSelect
                    name={PaymentChannelIdFieldName}
                    range={manualPaymentProdiverChanneIdRange}
                    required
                  />
                )}
                {isEdit && !isManualPaymentProviderMethod && (
                  <PaymentChannelLabel value={record?.paymentChannelId} />
                )}
              </Box>

              <Label required>
                <Trans zh="通道名称" en="Channel Name" />
              </Label>
              <Input name="channelName" size="small" required />

              <PaymentMethodSetting
                brandId={brandId}
                paymentName={paymentName}
                paymentMethodCode={paymentMethod?.code}
              />

              <Label>
                <Trans zh="状态" en="Status" />
              </Label>
              <Box>
                <BrandPaymentStatusButton name="paymentStatus" />
              </Box>

              <Label required>
                <Trans zh="单笔限额" en="Limit" />
              </Label>
              <NumberRangeInputGroup
                names={["transferLimitFrom", "transferLimitTo"]}
                required
                min={[0, transferLimitFrom]}
                max={[transferLimitTo]}
                width="100%"
              />
            </FieldValues>

            <Columns flex="1 auto">
              <UploadListColumn
                name="whitelist"
                title={<Trans zh="白名单列表" en="Whitelist" />}
                list={record.whitelist}
                fileName="whitelist.xlsx"
              />
              <UploadListColumn
                name="blacklist"
                title={<Trans zh="黑名单列表" en="Blacklist" />}
                list={record.blacklist}
                fileName="blacklist.xlsx"
              />
            </Columns>
          </Stack>
        </Columns.Column>
        <Columns.Column>
          <Heading use="h5">
            <Trans zh="开放条件" en="Conditions" />
          </Heading>
          <FieldValues>
            <Label name="playerListCondition">
              <Trans zh="符合条件" en="Eligible" />
            </Label>
            <Box alignY="center">
              <PlayerListConditionRadioGroup
                name="playerListCondition"
                required
              />
            </Box>

            <Label name="allPlayers">
              <AllPlayerText />
            </Label>
            <Box alignY="center">
              <Switch name="allPlayers" width="auto" />
            </Box>

            <Label required>
              <AccumulatedDepositText />
            </Label>
            <Box alignY="center">
              <AccumulatedDepositGroup />
            </Box>

            <Label>
              <IdentityAuthenticationText />
            </Label>
            <Box alignY="center">
              <Switch name="identityAuthentication" />
            </Box>

            <Label>
              <PhoneAuthenticationText />
            </Label>
            <Box alignY="center">
              <Switch name="phoneAuthentication" />
            </Box>

            <Label>
              <VipLevelsText />
            </Label>
            <Box alignY="center">
              <VipLevelCheckboxGroup name="vipLevelIds" brandId={brandId} />
            </Box>
          </FieldValues>
        </Columns.Column>
      </Columns>
      <Stack spacing="major-1" orientation="horizontal">
        <Box flex="0 auto">
          <Trans zh="变更原因" en="Reason" />
        </Box>

        <Textarea name="reason" />
      </Stack>
      <Input type="hidden" name="brandId" value={brandId} />
    </Stack>
  )
}

const AccumulatedDepositGroup = () => {
  let { watch, setValue } = useFormContext()
  let DepositedAmountMinField = "depositedAmountMin"
  let depositedAmountMin = watch(DepositedAmountMinField)

  let DepositedAmountMaxField = "depositedAmountMax"
  let depositedAmountMax = watch(DepositedAmountMaxField)
  let disabledDepositedAmountMax = watch("depositedAmountUnlimited")

  useEffect(() => {
    if (disabledDepositedAmountMax) {
      //reset disabledDepositedAmountMax
      setValue(DepositedAmountMaxField, "")
    }
  }, [disabledDepositedAmountMax])

  return (
    <Stack orientation="horizontal" alignY="center">
      <NumberRangeInputGroup
        names={["depositedAmountMin", "depositedAmountMax"]}
        required
        min={[0, depositedAmountMin]}
        max={disabledDepositedAmountMax ? undefined : [depositedAmountMax]}
        disabled={[false, disabledDepositedAmountMax]}
        width="100%"
      />
      <CheckboxField
        name="depositedAmountUnlimited"
        checkboxLabel={<UnlimitedText />}
        whiteSpace="nowrap"
      />
    </Stack>
  )
}

const List = applyTheme(_List, {
  styles: {
    base: {
      border: "default"
    }
  }
})

const UploadListColumn = ({ name = "", title, fileName = "" }) => {
  let { control, setValue, watch } = useFormContext()
  let list = watch(name) ?? []

  let uploadFileInputRef = useRef()
  let [formData, setFormData] = useState()
  let { result, isLoading, error, clearCache, deleteCache } =
    useBrandPaymentUpload(formData)

  const resetFormData = () => {
    if (uploadFileInputRef?.current) {
      uploadFileInputRef.current.value = ""
    }
    deleteCache()
    setFormData(undefined)
  }

  list = result?.players ?? list

  useEffect(() => {
    if (Array.isArray(result?.players) && !error) {
      setValue(name, result?.players)
    }
  }, [formData, result])

  return (
    <Controller
      control={control}
      name={name}
      shouldUnregister={true}
      render={({
        field: { onChange, onBlur, value, name, ref },
        fieldState: { isTouched, isDirty, error }
      }) => (
        <Columns.Column display="flex" flexDirection="column">
          {error && <AlertDialog {...error} onClickClose={resetFormData} />}
          <Stack orientation="horizontal" alignY="center" spacing="major-1">
            <Text.Block>{title}</Text.Block>
            <Button
              use="a"
              href="/download/payments/list.xlsx"
              download={fileName}
              palette="primary"
              size="small"
            >
              <Trans zh="格式" en="Format" />
            </Button>
          </Stack>
          <List overflowY="scroll" flex="1 0 5em" marginY="minor-1">
            {list.map((item) => (
              <List.Item key={item}>{item}</List.Item>
            ))}
          </List>
          <Set alignX="center" orientation="horizontal">
            <input
              ref={uploadFileInputRef}
              type="file"
              onChange={(event) => {
                let [file] = event.target.files
                if (file) {
                  let formData = new FormData()
                  formData.append("file", file, file.name)
                  setFormData(formData)
                } else {
                  resetFormData()
                }
              }}
              css={css`
                display: none;
              `}
            />
            <Button
              palette="primary"
              type="button"
              onClick={(event) => {
                uploadFileInputRef?.current.click()
              }}
              size="small"
              isLoading={isLoading}
              disabled={isLoading}
            >
              <Trans zh="上传" en="Upload" />
            </Button>
            <Button
              type="button"
              size="small"
              onClick={() => {
                setValue(name, [])
              }}
            >
              <Trans zh="清除" en="Clear" />
            </Button>
          </Set>
        </Columns.Column>
      )}
    />
  )
}
