import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  useForm,
  FormProvider,
  useFormContext,
  useWatch
} from "react-hook-form"
import {
  Heading,
  Stack,
  Box,
  Button,
  Set,
  Flex,
  Icon,
  FieldWrapper,
  Group
} from "bumbag"
import { useBrandPaymentList } from "./client"
import { MultiSelectBox } from "../../select/MultiSelectBox"
import { useLocale, useTrans } from "../../i18n"
import { usePaymentList } from "../../payment/client"
import { groupBy } from "ramda"
import { PaymentProviderDropdownMenu } from "../../payment/PaymentProvider"
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons"

const OptionType = {
  PaymentProvider: "PaymentProvider",
  PlatformPayment: "PlatformPayment"
}

export const BrandPaymentMultiSelect = ({
  name,
  placeholder,
  brandId,
  transferType,
  paymentStatus,
  isMulti = true,
  ...props
}) => {
  let defaultPlaceholder = useTrans({
    zh: "平台支付",
    en: "Platform Payment"
  })
  placeholder = placeholder ?? defaultPlaceholder

  let locale = useLocale()
  let {
    isLoading: isLoadingPaymentProviderList,
    data: paymentProviderList = [],
    error: paymentProviderListError
  } = usePaymentList()

  let {
    isLoading,
    data: brandPayment,
    error,
    deleteCache,
    mutate
  } = useBrandPaymentList(
    brandId
      ? {
          brandId,
          transferType,
          paymentStatus,
          sortby: "number",
          showAll: true
        }
      : undefined
  )

  let allPaymentProviderCodes =
    brandPayment?.items?.map(({ paymentName }) => paymentName) ?? []

  let options = brandPayment?.items?.map((brandPayment) => {
    return {
      label: brandPayment.channelName,
      value: brandPayment.id
    }
  })

  let { setValue } = useFormContext()
  let [paymentProviderCode, setPaymentProviderCode] = useState()

  useEffect(() => {
    if (paymentProviderCode) {
      let brandPaymentIdList = brandPayment?.items
        ?.filter(({ paymentName }) => {
          return paymentName === paymentProviderCode
        })
        ?.map(({ id }) => {
          return id
        })

      setValue(name, brandPaymentIdList)
      setPaymentProviderCode(null)
    }
  }, [paymentProviderCode])

  return (
    <>
      <Group
        css={css`
          & .bb-DropdownMenu,
          .bb-DropdownMenuButton {
            border-radius: 6px 0 0 6px;
          }

          > :last-child > :last-child {
            border-radius: 0 6px 6px 0;
          }
        `}
      >
        <PaymentProviderDropdownMenu
          filter={(paymentProvider) =>
            allPaymentProviderCodes.includes(paymentProvider.code)
          }
          onChange={(code) => {
            setPaymentProviderCode(code)
          }}
          iconAfter=""
        >
          <Icon icon={faEllipsisV} type="font-awesome" />
        </PaymentProviderDropdownMenu>
        <MultiSelectBox
          name={name}
          placeholder={placeholder}
          isLoading={isLoadingPaymentProviderList || isLoading}
          options={options}
          isMulti={isMulti}
          {...props}
        />
      </Group>
    </>
  )
}

const groupByPaymentProvideCodeOptions = (
  toPaymentProviderOption,
  platformPayments = []
) => {
  //1. group by
  let groupedByPaymentProvider = groupBy(
    ({ paymentName, ...platformPayment }) => {
      return paymentName
    },
    platformPayments
  )
  let result = Object.entries(groupedByPaymentProvider).reduce(
    (options, [paymentCode, platformPayments]) => {
      let paymentProviderOption = toPaymentProviderOption(paymentCode)
      let platformPaymentOptions = platformPayments.map((platformPayment) => {
        return {
          label: platformPayment.channelName,
          value: platformPayment.id
        }
      })

      return [...options, paymentProviderOption, ...platformPaymentOptions]
    },
    []
  )

  return result
}
