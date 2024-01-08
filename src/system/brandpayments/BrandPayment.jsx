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
import { Select, SelectField } from "../../select/Select"
import equals from "fast-deep-equal"
import { usePaymentChannelList } from "../../payment/channel/client"
import { usePaymentList } from "../../payment/client"
import { useLocale } from "../../i18n"

export const BrandPaymentSelect = ({
  brandId,
  transferType,
  paymentStatus,
  bankType,
  paymentChannelId,
  ...props
}) => {
  let { isLoading: isLoadingPaymentList, data: paymentList } = usePaymentList()
  let { isLoading: isLoadingPaymentChannelList, data: paymentChannelList } =
    usePaymentChannelList()

  let {
    isLoading: isLoadingBrandPaymentList,
    data,
    error,
    deleteCache,
    mutate
  } = useBrandPaymentList({
    brandId,
    transferType,
    paymentStatus,
    sortby: "number",
    showAll: true
  })

  let locale = useLocale()

  let isLoading = isLoadingPaymentList || isLoadingBrandPaymentList || isLoadingPaymentChannelList

  let items = data?.items?.map((brandPayment) => {
    let paymentChannel = paymentChannelList?.find(
      (paymentChannel) => paymentChannel.id === brandPayment.paymentChannelId
    )

    return {
      ...brandPayment,
      paymentChannelCode: paymentChannel?.code
    }
  })

  let options = items
    ?.filter((brandPayment) => {
      if (
        bankType == "Bank" &&
        brandPayment.paymentChannelCode === "CustomBank"
      ) {
        return true
      }

      if (
        paymentChannelId &&
        paymentChannelId != brandPayment.paymentChannelId
      ) {
        return false
      }

      return true
    })
    ?.map((item) => { 
      let payment = paymentList.find(({ code }) => code === item.paymentName) ?? ""
      let paymentName = payment?.trans?.[locale] ?? payment?.code ?? ""
      return {
      label: `${paymentName}_${item.channelName}`,
      value: item.id
    }
    })
  return <Select isLoading={isLoading} options={options} {...props} />
}
