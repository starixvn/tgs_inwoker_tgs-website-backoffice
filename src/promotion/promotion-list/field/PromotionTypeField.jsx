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
import { useForm, useFormContext, useWatch } from "react-hook-form"
import {
  PromotionTypeGroupSelect,
  PromotionTypeSelect,
  usePromotionGroupValueOf
} from "../../PromotionType"
import { Trans, useTrans } from "../../../i18n"
import { NormalLabel } from "../../../form/Label"
import { useIsPromotionAdded } from "../usePromotionFormData"
import {
  PromotionSubtypeTrans,
  PromotionTypeTrans
} from "../../../trans/Promotion"

const PromotionType = "promotionType"

const PromotionTypeGroup = "promotionTypeGroup"

export const usePromotionType = () => {
  let { control } = useFormContext()

  let promotionType = useWatch({
    control,
    name: PromotionType
  })
  return promotionType
}

export const PromotionTypeField = ({ readOnly }) => {
  let { control, setValue } = useFormContext()

  let promotionType = usePromotionType()
  let defaultPromotionTypeGroup = usePromotionGroupValueOf(promotionType)
  let promotionTypeGroup = useWatch({
    control,
    name: PromotionTypeGroup,
    defaultValue: defaultPromotionTypeGroup
  })

  let isAdded = useIsPromotionAdded()
  if (isAdded) {
    //not allow to change promotion type after created
    readOnly = true
  }

  let disabled = readOnly

  let promotionTypeGroupPlaceholder = useTrans({
    zh: "全部",
    en: "All"
  })
  return (
    <>
      <NormalLabel>
        <PromotionTypeTrans />
      </NormalLabel>
      <Box alignY="center">
        <PromotionTypeGroupSelect
          name={PromotionTypeGroup}
          defaultValue={promotionTypeGroup}
          onChange={(event) => {
            setValue(PromotionType, "")
          }}
          placeholder={promotionTypeGroupPlaceholder}
          readOnly={readOnly}
          disabled={disabled}
        />
      </Box>

      <NormalLabel>
        <PromotionSubtypeTrans />
      </NormalLabel>
      <Box alignY="center">
        <PromotionTypeSelect
          name={PromotionType}
          group={promotionTypeGroup}
          readOnly={readOnly}
          disabled={disabled}
          required
        />
      </Box>
    </>
  )
}
