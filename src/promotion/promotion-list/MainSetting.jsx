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
import { AutoPayoutSwitchField } from "./field/AutoPayoutSwitchField"
import { isNil, isEmpty, set } from "lodash-es"
import { TotalFundsField } from "./field/TotalFundsField"

export const MainSetting = ({ autoPayout, totalFundsUnlimited, readOnly }) => {
  
  let disabled = readOnly
  return (
    <>
      <AutoPayoutSwitchField
        autoPayout={autoPayout}
        readOnly={readOnly}
        disabled={disabled}
      />

      <TotalFundsField
        unlimited={totalFundsUnlimited}
        readOnly={readOnly}
        disabled={disabled}
      />
    </>
  )
}
