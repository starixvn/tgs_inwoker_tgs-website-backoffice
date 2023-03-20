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
import { useIsDisplayMenuByRoute } from "../../user/context"
import Disclosure, {
  AddDisclosure,
  EditDisclosure,
  NewDisclosure,
  ViewDisclosure
} from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import { Trans, useTrans } from "../../i18n"
import { useForm, useFormContext, useWatch, Controller } from "react-hook-form"
import {
  PromotionTypeGroup,
  PromotionTypeGroupSelect,
  PromotionTypeSelect,
  usePromotionGroupValueOf
} from "../PromotionType"
import { FieldValues } from "../../layout/Grid"
import { NormalLabel } from "../../form/Label"
import {
  NumberInput,
  NumberInputField,
  PercentageNumberInputField
} from "../../input/NumberInput"
import {
  GameTypeGroupSelect,
  GameTypeSelect,
  useGameTypeGroupValueOf
} from "../../game/GameType"
import { BrandGameProviderCheckboxGroupTable } from "../../game/brandproviders/BrandGameProviderCheckboxGroup"
import { PromotionPlayerAutoJoinFieldBox } from "./PromotionPlayerAutoJoinFieldBox"
import { PromotionVipLevelsFieldBox } from "./PromotionVipLevelsFieldBox"

export const PromotionReliefMoneyRuleSetting = ({
  limitedTotalAmount,
  totalAmountLimit,
  readOnly
}) => {
  let { control, setValue } = useFormContext()

  /*
  let gameTypePlaceholder = useTrans({
    zh: "全部",
    en: "All"
  })

  let GameTypeGroupFieldName = "gameTypeGroup"
  let gameTypeGroup = useWatch({
    control,
    name: GameTypeGroupFieldName
  })

  let GameTypeFieldName = "gameType"
  let gameType = useWatch({
    control,
    name: GameTypeFieldName
  })
  */

  let disabled = readOnly
  let editable = !readOnly
  return (
    <FieldValues>
      <PromotionVipLevelsFieldBox readOnly={readOnly} />

      {/* <NormalLabel>
        <Trans zh="活动游戏类型" en="Game Type" />
      </NormalLabel>
      <Box>
        {editable && (
          <GameTypeGroupSelect
            name={GameTypeGroupFieldName}
            disabled={disabled}
            placeholder={gameTypePlaceholder}
          />
        )}
        {disabled && (
          <>
            <GameTypeGroupSelect
              name={GameTypeGroupFieldName}
              value={gameTypeGroup}
              display="none"
            />
            <GameTypeGroupSelect
              placeholder={gameTypePlaceholder}
              value={gameTypeGroup}
              disabled
            />
          </>
        )}
      </Box>
      {gameTypeGroup && (
        <>
          <NormalLabel>
            <Trans zh="活动游戏子类型" en="Game SubType" />
          </NormalLabel>
          <GameTypeSelect
            name={GameTypeFieldName}
            group={gameTypeGroup}
            disabled={disabled}
            required
          />
        </>
      )}
      {gameType && (
        <>
          <NormalLabel>
            <Trans zh="活动厂商" en="GP Participation" />
          </NormalLabel>
          <Box>
            <BrandGameProviderCheckboxGroupTable
              brandId={brandId}
              disabled={disabled}
              gameType={gameType}
            />
          </Box>
        </>
      )} */}
      <PromotionPlayerAutoJoinFieldBox
        readOnly={readOnly}
        disabled={disabled}
      />
      <NormalLabel>
        <Trans zh="彩金百分比" en="Bonus Percentage" />
      </NormalLabel>
      <PercentageNumberInputField
        name="rule.percentage"
        registerOptions={{
          valueAsNumber: true,
          shouldUnregister: true
        }}
        max="999"
        required
        disabled={disabled}
      />

      <NormalLabel>
        <Trans zh="彩金上限" en="Bonus Limit" />
      </NormalLabel>
      <NumberInput
        name="rule.bonusAmountLimit"
        registerOptions={{
          valueAsNumber: true,
          shouldUnregister: true
        }}
        min="0"
        max={
          limitedTotalAmount && Number.isFinite(totalAmountLimit)
            ? totalAmountLimit
            : undefined
        }
        required
        disabled={disabled}
      />

      <NormalLabel>
        <Trans zh="流水倍数" en="Turnover Requirement" />
      </NormalLabel>
      <NumberInputField
        name="rule.turnoverMultiple"
        registerOptions={{
          valueAsNumber: true,
          shouldUnregister: true
        }}
        min="0"
        required
        disabled={disabled}
        addonAfter={
          <Button isStatic tabIndex="-1">
            <Trans zh="倍" en="Multipliers" />
          </Button>
        }
      />
    </FieldValues>
  )
}
