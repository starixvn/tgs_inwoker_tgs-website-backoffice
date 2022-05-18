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
import { useIsDisplayMenuByRoute } from "../../user/context"
import Disclosure, {
  AddDisclosure,
  EditDisclosure,
  NewDisclosure,
  ViewDisclosure
} from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import { Trans, useTrans } from "../../i18n"
import {
  useForm,
  useFormContext,
  useWatch,
  Controller,
  useFieldArray
} from "react-hook-form"
import { FieldValues } from "../../layout/Grid"
import { NormalLabel } from "../../form/Label"
import Input from "../../input/Input"
import {
  NumberInput,
  NumberInputField,
  PercentageNumberInputField
} from "../../input/NumberInput"
import clone from "clone-deep"
import Backdrop from "../../dialog/Backdrop"
import { ConfirmText } from "../../button/ActionButtons"
import { sumBy } from "lodash-es"
import AlertDialog, { AlertDialogModal } from "../../dialog/Alert"
import { Switch } from "../../switch/Switch"

export const PromotionNewUserRuleSetting = ({ promotionType, ...props }) => {
  switch (promotionType) {
    default:
      return <RegisterRuleSetting {...props} />
  }
}

export const RegisterRuleSetting = ({
  limitedTotalAmount,
  totalAmountLimit,
  readOnly
}) => {
  let disabled = readOnly
  return (
    <FieldValues>
      <NormalLabel>
        <Trans zh="彩金金额" en="Bonus Amount" />
      </NormalLabel>
      <NumberInput
        name="bonusAmount"
        min="0"
        max={limitedTotalAmount ? totalAmountLimit : undefined}
        required
        disabled={disabled}
      />

      <NormalLabel>
        <Trans zh="流水倍数" en="Turnover Requirement" />
      </NormalLabel>
      <NumberInputField
        name="turnoverMultiple"
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
