import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Box,
  Dialog,
  useModalState,
  Set,
  Level,
  Heading,
  Button,
  Flex,
  Text
} from "bumbag"
import { View, Update } from "./menu"
import { useIsDisplayMenuByRoute, useUserBrandId } from "../../user/context"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import { useAddAgent, useAgent, useUpdateAgent } from "./client"
import {
  Trans,
  FormattedDateTime,
  FormattedNumber,
  useTrans,
  FormattedNumberDecimal
} from "../../i18n"
import Disclosure, {
  AddDisclosure,
  EditDisclosure,
  ViewDisclosure
} from "../../dialog/Disclosure"
import { Tabs, TabList, useTabState } from "../../tab"
import { AgentInfoKey, AgentInfoPanel, AgentInfoTab } from "./AgentInfo"
import { AgentContactInfoPanel, AgentContactInfoTab } from "./AgentContactInfo"
import { AgentBankInfoPanel, AgentBankInfoTab } from "./AgentBankInfo"
import {
  AgentOperationListPanel,
  AgentOperationListTab
} from "./AgentOperationList"
import { AgentTeamInfoPanel, AgentTeamInfoTab } from "./AgentTeamInfo"
import { AgentPasswordPanel, AgentPasswordTab } from "./AgentPassword"
import FormDialog from "../../form/FormDialog"
import {
  CloseButtonFooter,
  ConfirmCancelFooter
} from "../../form/ConfirmButtonFooter"
import { FieldValues, TwoColumns } from "../../layout/Grid"
import { NormalLabel } from "../../form/Label"
import Input, { InputField } from "../../input/Input"
import { PasswordInputField } from "../../input/PasswordInput"
import { useFormContext, useWatch } from "react-hook-form"
import Textarea from "../../textarea"
import AgentUpdateType from "./AgentUpdateType"
import {
  AgentLiveDealerRebatePercentageInputField,
  AgentLiveDealerRebateText
} from "../AgentLiveDealerRebatePercentage"
import {
  AgentEgameRebatePercentageInputField,
  AgentEgameRebateText
} from "../AgentEgameRebatePercentage"
import {
  AgentCardGameRebatePercentageInputField,
  AgentCardGameRebateText
} from "../AgentCardGameRebatePercentage"
import {
  AgentLotteryRebatePercentageInputField,
  AgentLotteryRebateText
} from "../AgentLotteryRebatePercentage"
import {
  AgentSportsRebatePercentageInputField,
  AgentSportsRebateText
} from "../AgentSportsRebatePercentage"
import {
  AgentVirtualSportsRebatePercentageInputField,
  AgentVirtualSportsRebateText
} from "../AgentVirtualSportsRebatePercentage"
import clone from "clone-deep"
import { CreditAgentTypeSelect, isAgentParentRequired } from "./CreditAgentType"

export const EditCreditAgentTabsDialogDisclosure = ({
  brandId,
  onSubmitted,
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([Update])
  if (!isDisplay) {
    return null
  }
}
