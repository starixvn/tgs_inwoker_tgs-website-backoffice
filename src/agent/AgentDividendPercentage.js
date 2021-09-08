import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Set } from "bumbag"
import { useTrans, Trans, FormattedNumberDecimal } from "../i18n"
import { PercentageNumberInputField } from "../input/NumberInput"
import { useAgentList } from "./agent-list/client"
import { isNil } from "lodash-es"

export const Name = "dividendPercentage"

export const AgentDividendPercentageInputField = ({
  name = Name,
  required = true,
  brandId = "",
  parentUsername = "",
  max,
  ...props
}) => {
  let { isLoading, data, error } = useAgentList(
    brandId && parentUsername
      ? {
          brandId,
          username: parentUsername,
          rows: 1
        }
      : undefined
  )

  let parentAgent = data?.items?.[0]
  let validParentAgent = !!(
    parentUsername &&
    parentAgent &&
    parentAgent.dividendPercentage >= 0
  )
  let parentAgentProfitSharing = validParentAgent
    ? parentAgent.dividendPercentage
    : undefined

  if (isNil(max)) {
    max = parentAgentProfitSharing
  }

  return (
    <Set orientation="horizontal">
      <PercentageNumberInputField
        name={name}
        max={max}
        required={required}
        {...props}
      />
      {validParentAgent && parentAgentProfitSharing >= 0 && (
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
