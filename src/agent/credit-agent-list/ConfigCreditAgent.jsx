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
import {
  useAddAgent,
  useAgent,
  useCreditAgent,
  useUpdateAgent,
  useUpdateCreditAgent
} from "./client"
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
import { AgentDividendPercentageInputField } from "../AgentOneLayerDividendPercentage"
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

export const ConfigCreditAgentDisclosure = ({
  brandId,
  agentId,
  onSubmitted,
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([UpdateMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="配置" en="Config" />
      </Disclosure>
      {dialog.visible && (
        <ConfigDialog
          brandId={brandId}
          agentId={agentId}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

const ConfigDialog = ({ brandId, agentId, onSubmitted, dialog }) => {
  let {
    isLoading: isLoadingAgent,
    data: agent,
    error: loadingAgentError,
    mutate: mutateAgent,
    deleteCache: deleteAgentCache
  } = useCreditAgent(agentId)

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } = useUpdateCreditAgent(
    agentId,
    formData
  )

  let title = useTrans({
    zh: "比例配制",
    en: "Config Agent"
  })

  if (isLoadingAgent) {
    return <LoadingBackdrop {...dialog} />
  }

  if (loadingAgentError) {
    return <AlertDialog {...loadingAgentError} onClickClose={dialog.hide} />
  }

  const onSubmit = (data) => {
    setSubmit({
      updateType: AgentUpdateType.Info,
      brandId,
      ...agent,
      ...data
    })
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  return (
    <FormDialog
      defaultValues={{
        ...clone(agent),
        dividendPercentage: "",
        liveDealerRebatePercentage: "",
        slotRebatePercentage: "",
        cardGameRebatePercentage: "",
        lotteryRebatePercentage: "",
        sportsRebatePercentage: "",
        virtualSportsRebatePercentage: ""
      }}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={() => {
        deleteAgentCache()
        mutateAgent(undefined, false)

        reset()
        onSubmitted?.()
      }}
      title={title}
      dialog={dialog}
      showActionButtons={false}
      footer={<ConfirmCancelFooter dialog={dialog} isLoading={isLoading} />}
      maxWidth="100vw"
      minWidth="60vw"
      placement="top"
    >
      <FormBody record={agent} />
    </FormDialog>
  )
}

const FormBody = () => {
  return (
    <Set orientation="vertical" marginLeft="1rem" marginRight="1rem" isFilled>
      <FieldValues>
        <NormalLabel>
          <Trans zh="用户名" en="Username" />
        </NormalLabel>
        <Box alignY="center">{record?.username}</Box>

        <NormalLabel>
          <Trans zh="真实姓名" en="Real Name" />
        </NormalLabel>
        <Box alignY="center">{record?.realName}</Box>

        <Box alignY="center">
          <Trans zh="上级代理" en="Upper level agent" />
        </Box>
        <Box alignY="center">{record?.parentUsername}</Box>

        <NormalLabel>
          <Trans zh="注册时间" en="Registration" />
        </NormalLabel>
        <Box alignY="center">
          <FormattedDateTime value={record?.registration} />
        </Box>

        <NormalLabel>
          <Trans zh="余额" en="Balance" />
        </NormalLabel>
        <Box alignY="center">
          <FormattedNumberDecimal value={record?.balance} />
        </Box>

        <NormalLabel>
          <Trans zh="代理类型" en="Agent Type" />
        </NormalLabel>
        <Box alignY="center">
          <Trans zh="代理" en="Agent" />
        </Box>

        <NormalLabel>
          <Trans zh="占成比例" en="Profit Sharing %" />
        </NormalLabel>
        <AgentDividendPercentageInputField />

        <NormalLabel>
          <AgentLiveDealerRebateText />
        </NormalLabel>
        <AgentLiveDealerRebatePercentageInputField />

        <NormalLabel>
          <AgentEgameRebateText />
        </NormalLabel>
        <AgentEgameRebatePercentageInputField />

        <NormalLabel>
          <AgentCardGameRebateText />
        </NormalLabel>
        <AgentCardGameRebatePercentageInputField />

        <NormalLabel>
          <AgentLotteryRebateText />
        </NormalLabel>
        <AgentLotteryRebatePercentageInputField />

        <NormalLabel>
          <AgentSportsRebateText />
        </NormalLabel>
        <AgentSportsRebatePercentageInputField />

        <NormalLabel>
          <AgentVirtualSportsRebateText />
        </NormalLabel>
        <AgentVirtualSportsRebatePercentageInputField />
      </FieldValues>
    </Set>
  )
}
