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
      (acc, { methodcode, channelcode, channelname }) => {
        if (
          (paymentMethodCode && methodcode === paymentMethodCode) ||
          !paymentMethodCode
        ) {
          acc[channelcode] = {
            label: channelname,
            value: channelcode
          }
        }
        return acc
      },
      {}
    )
  )

  return options
}
