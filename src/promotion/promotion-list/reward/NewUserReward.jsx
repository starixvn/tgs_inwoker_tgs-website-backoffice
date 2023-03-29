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
  Modal,
  Card,
  Flex,
  Heading,
  FieldStack,
  Table,
  Alert
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../../user/context"
import Disclosure, {
  AddDisclosure,
  EditDisclosure,
  NewDisclosure,
  ViewDisclosure
} from "../../../dialog/Disclosure"
import FormDialog from "../../../form/FormDialog"
import { Trans, useTrans } from "../../../i18n"
import {
  useForm,
  useFormContext,
  useWatch,
  Controller,
  useFieldArray
} from "react-hook-form"
import { FieldValues } from "../../../layout/Grid"
import { NormalLabel } from "../../../form/Label"
import Input from "../../../input/Input"
import {
  NumberInput,
  NumberInputField,
  PercentageNumberInputField
} from "../../../input/NumberInput"
import clone from "clone-deep"
import Backdrop from "../../../dialog/Backdrop"
import { ConfirmText } from "../../../button/ActionButtons"
import { sumBy } from "lodash-es"
import AlertDialog, { AlertDialogModal } from "../../../dialog/Alert"
import { Switch } from "../../../switch/Switch"
import { useTotalFunds } from "../field/TotalFundsField"
import { VipLevelCheckboxGroupField } from "../field/VipLevelCheckboxGroupField"
import { MainSetting } from "../MainSetting"
import { ContentSetting } from "../ContentSetting"

const PromotionType = "Register"

export const Main = (props) => <MainSetting autoPayout={true} {...props} />

export const Content = ContentSetting

export const Rule = ({ readOnly }) => {
  let totalFunds = useTotalFunds()
  let disabled = readOnly
  return (
    <FieldValues>
      <VipLevelCheckboxGroupField readOnly={readOnly} />

      <NormalLabel>
        <Trans zh="彩金金额" en="Bonus Amount" />
      </NormalLabel>
      <NumberInput
        name="rule.bonusAmount"
        min="0"
        max={totalFunds}
        required
        disabled={disabled}
        registerOptions={{
          valueAsNumber: true
        }}
      />

      <NormalLabel>
        <Trans zh="流水倍数" en="Turnover Requirement" />
      </NormalLabel>
      <NumberInputField
        name="rule.turnoverMultiple"
        min="0"
        required
        disabled={disabled}
        addonAfter={
          <Button isStatic tabIndex="-1">
            <Trans zh="倍" en="Multipliers" />
          </Button>
        }
        registerOptions={{
          valueAsNumber: true
        }}
      />
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

//TODO: rm
export const NewUserRewardRuleSetting = ({ promotionType, ...props }) => {
  switch (promotionType) {
    case PromotionType:
      return <Rule {...props} />
    default:
      return <Rule {...props} />
  }
}
