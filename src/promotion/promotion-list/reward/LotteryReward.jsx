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
  Stack,
  Popover,
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
import {
  PromotionTypeGroup,
  PromotionTypeGroupSelect,
  PromotionTypeSelect,
  usePromotionGroupValueOf
} from "../../PromotionType"
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
import { isNil, isEmpty, either, complement, prop, all, compose } from "ramda"
import { CloseButtonFooter } from "../../../form/ConfirmButtonFooter"
import { get, set } from "lodash-es"
import Big from "big.js"
import DepositLotteryReward from "./DepositLotteryReward"
import RouletteReward from "./RouletteReward"

//TODO: rm
export const LotteryRewardRuleSetting = ({ promotionType, ...props }) => {
  switch (promotionType) {
    case RouletteReward.PromotionType:
      return <RouletteReward.Rule {...props} />
    case DepositLotteryReward.PromotionType:
      return <DepositLotteryReward.Rule {...props} />
    default:
      return null
  }
}
