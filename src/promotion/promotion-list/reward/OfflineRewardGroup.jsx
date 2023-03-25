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
  FieldStack,
  Table,
  Group
} from "bumbag"
import { FormattedNumberDecimal, Trans, useTrans } from "../../../i18n"
import {
  useForm,
  useFormContext,
  useWatch,
  Controller,
  useFieldArray
} from "react-hook-form"
import { useIsPromotionAdded, usePromotionType } from "../edit"
import { FieldValues } from "../../../layout/Grid"
import { BatchUploadPlayerListField } from "../field/BatchUploadPlayerListField"
import { NormalLabel } from "../../../form/Label"
import { NumberInput, NumberInputField } from "../../../input/NumberInput"
import { useMount } from "react-use"
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons"
import OfflineLoginReward from "./OfflineLoginReward"
import OfflineDepositReward from "./OfflineDepositReward"

//TODO: able to rm? move to edit btn?
export const TypeList = [
  OfflineLoginReward.PromotionType,
  OfflineDepositReward.PromotionType
]

//TODO: rm?
export const OfflineRewardRuleSetting = ({ readOnly }) => {
  let promotionType = usePromotionType()

  switch (promotionType) {
    case OfflineLoginReward.PromotionType:
      return <OfflineLoginReward.Rule readOnly={readOnly} />
    case OfflineDepositReward.PromotionType:
      return <OfflineDepositReward.Rule readOnly={readOnly} />
    default:
      return null
  }
}
