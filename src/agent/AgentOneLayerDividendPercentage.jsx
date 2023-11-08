import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Set } from "bumbag"
import { useTrans, Trans, FormattedNumberDecimal } from "../i18n"
import { PercentageNumberInputField } from "../input/NumberInput"
import { useAgentOneLayerProfitSharingPercentage } from "./agent-list/client"
import { isNil } from "lodash-es"

export const Name = "dividendPercentage"

export const AgentOneLayerDividendPercentageInputField = ({
  name = Name,
  required = true,
  brandId = "",
  parentUsername = "",
  max,
  registerOptions = {
    valueAsNumber: true
  },
  ...props
}) => {
  let { isLoading, data, error, mutate, deleteCache } =
    useAgentOneLayerProfitSharingPercentage(brandId, parentUsername)

  let parentAgentProfitSharing = data?.valid && data?.dividendPercentage
  if (isNil(max)) {
    max = parentAgentProfitSharing
  }

  return (
    <Set orientation="horizontal">
      <PercentageNumberInputField
        name={name}
        max={max}
        required={required}
        registerOptions={registerOptions}
        {...props}
      />
      {parentAgentProfitSharing >= 0 && (
        <FormattedNumberDecimal
          prefix={
            <Trans zh="上级代理分红：" en="Upper Level Profit Sharing：" />
          }
          value={parentAgentProfitSharing}
          postfix="%"
          color="danger"
        />
      )}
    </Set>
  )
  return
}

export default {
  Name
}
