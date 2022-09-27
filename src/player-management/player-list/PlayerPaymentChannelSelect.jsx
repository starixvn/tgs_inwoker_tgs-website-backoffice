import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Text } from "bumbag"
import { useTrans, Trans, useLocale } from "../../i18n"
import Select, { SelectField } from "../../select/Select"

export const PlayerPaymentChannelSelect = ({
  paymentMethod = "",
  paymentList = [],
  ...props
}) => {
  let label = useTrans({
    zh: "支付通道",
    en: "Payment Channel"
  })
  let defaultPlaceholder = useTrans({
    zh: "支付通道",
    en: "Payment Channel"
  })

  let options = filterPaymentChannelOptions(paymentMethod, paymentList)

  return (
    <SelectField placeholder="" options={options} label={label} {...props} />
  )
}

const filterPaymentChannelOptions = (
  paymentMethodCode,
  platformPaymentList = []
) => {
  let options = Object.values(
    platformPaymentList.reduce(
      (acc, { methodCode, channelCode, channelName }) => {
        if (
          (paymentMethodCode && methodCode === paymentMethodCode) ||
          !paymentMethodCode
        ) {
          acc[channelCode] = {
            label: channelName,
            value: channelCode
          }
        }
        return acc
      },
      {}
    )
  )

  return options
}
