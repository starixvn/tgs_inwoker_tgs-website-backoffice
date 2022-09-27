import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import {
  Heading,
  Stack,
  Box,
  Button,
  Set,
  Flex,
  Level,
  FieldStack
} from "bumbag"
import { useBrandPaymentList } from "./client"
import { MultiSelect } from "../../select/MultiSelect"
import { useLocale, useTrans } from "../../i18n"
import { usePaymentList } from "../../payment/client"
import { groupBy } from "ramda"

export const BrandPaymentMultiSelect = ({
  placeholder,
  brandId,
  transferType,
  paymentStatus,
  isMulti = true,
  ...props
}) => {
  let defaultPlaceholder = useTrans({
    zh: "通道",
    en: "Channel"
  })
  placeholder = placeholder ?? defaultPlaceholder

  let locale = useLocale()
  let { isLoading: isLoadingPaymentList, data: paymentProviderList } =
    usePaymentList()
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

  let toGroup = toPaymentProviderName(locale, paymentProviderList)
  let options = toGroupOptions(toGroup, brandPayment?.items)

  console.log("options", options)
  return (
    <MultiSelect
      placeholder={placeholder}
      isLoading={isLoadingPaymentList || isLoading}
      options={options}
      isMulti={isMulti}
      {...props}
    />
  )
}

const toPaymentProviderName =
  (locale, paymentProviderList = []) =>
  (brandPayment) => {
    let paymentName = brandPayment.paymentName
    let paymentProvider = paymentProviderList.find((paymentProvider) => {
      return paymentProvider.code === paymentName
    })

    let label = paymentProvider?.trans?.[locale] ?? paymentName
    return label
  }

const toGroupOptions = (toGroup, brandPaymentList = []) => {
  const toOption = (brandPayment) => {
    return {
      label: brandPayment.channelName,
      value: brandPayment.id
    }
  }

  let groups = groupBy((brandPayment) => {
    let result = toGroup(brandPayment)
    return result
  }, brandPaymentList)

  let groupOptions = Object.entries(groups).map(([label, brandPayments]) => {
    let options = brandPayments.map(toOption)
    return {
      label,
      options
    }
  })
  return groupOptions
}
