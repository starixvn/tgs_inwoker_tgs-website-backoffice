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
import { useIsDisplayMenuByRoute } from "../../../user/context"
import FormDialog from "../../../form/FormDialog"
import { FormattedNumberDecimal, Trans, useTrans } from "../../../i18n"
import { useForm, useFormContext, useWatch, Controller } from "react-hook-form"
import { FieldValues } from "../../../layout/Grid"
import { NormalLabel } from "../../../form/Label"
import {
  NumberInput,
  NumberInputField,
  PercentageNumberInputField
} from "../../../input/NumberInput"
import { useTotalFunds } from "../field/TotalFundsField"
import { MainSetting } from "../MainSetting"
import { ContentSetting } from "../ContentSetting"
import { VipLevelCheckboxGroupField } from "../field/VipLevelCheckboxGroupField"

export const Dummy = "Dummy"

export const PromotionType = "Dummy"

const Main = null

const Content = ContentSetting

const Rule = ({ readOnly }) => {
  return (
    <FieldValues>
      <VipLevelCheckboxGroupField readOnly={readOnly} />
    </FieldValues>
  )
}

export const Reward = {
  PromotionType,
  Main,
  Content,
  Rule
}

export default Reward
