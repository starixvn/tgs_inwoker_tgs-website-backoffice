import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { useLocation, useNavigate } from "react-router-dom"
import { useEffectOnce } from "react-use"
import { Box, Dialog, useModalState, Set, Level, Heading, Button } from "bumbag"
import {
  View as ViewMenu,
  Update as UpdateMenu,
  ChangeWithdrawalPassword
} from "./menu"
import { useIsDisplayMenuByRoute, useUserBrandId } from "../../user/context"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import {
  useAddAgent,
  useAgent,
  useUpdateAgent,
  useUpdateAgentV2,
  useAgentUpdateFormData
} from "./client"
import {
  Trans,
  FormattedDateTime,
  FormattedNumber,
  useTrans,
  FormattedNumberDecimal
} from "../../i18n"
import {
  Disclosure,
  AddDisclosure,
  EditDisclosure,
  ViewDisclosure
} from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import { FieldValues } from "../../layout/Grid"
import { NormalLabel } from "../../form/Label"
import { InputField } from "../../input/Input"
import { useFormContext, useWatch } from "react-hook-form"
import { AgentLevelLabel } from "../AgentLevel"
import AgentType, {
  AgentTypeLabel,
  AgentTypeSelect,
  isAgentTypeCash,
  isAgentTypeCredit
} from "../AgentType"
import Textarea from "../../textarea"
import clone from "clone-deep"
import { isDev, isLocalDev } from "../../env"
import { diff } from "../../object/diff"
import {
  AgentLevelTrans,
  AgentTypeTrans,
  UpperLevelAgentTrans
} from "../../trans/Agent"
import {
  BalanceTrans,
  RealNameTrans,
  RegistrationTimeTrans,
  UserNameTrans
} from "../../trans/User"
import { ProfitSharingBox } from "./button"

export const ConfigAgentProfitSharingDialogDisclosure = ({
  brand,
  agent,
  onSubmitted,
  ...props
}) => {
  let location = useLocation()
  let navigate = useNavigate()
  let visible = location?.state?.config === agent.username

  // TODO: need to open dialog automatically?
  // let dialog = useModalState({ visible })
  let dialog = useModalState()

  useEffectOnce(() => {
    if (visible) {
      let state = { ...location.state, config: "" }
      navigate(location.pathname, {
        state,
        replace: true
      })
    }
  }, [visible])

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
          brand={brand}
          agentId={agent.id}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

const ConfigDialog = ({ brand, agentId, onSubmitted, dialog }) => {
  let {
    isLoading: isLoadingAgent,
    data: agent,
    error: loadingAgentError,
    mutate: mutateAgent,
    deleteCache: deleteAgentCache
  } = useAgent(agentId)

  let [formData, setSubmit] = useState()
  let { result, error, mutate, deleteCache, isLoading } = useUpdateAgentV2(
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

  const onSubmit = ({
    type,
    parentUsername,
    dividendPercentage,
    agentDividendConditions,
    ...data
  }) => {
    let agentDividendType = brand?.agentDividendType
    let formData = useAgentUpdateFormData(
      {
        ...diff(data, agent),
        type,
        parentUsername,
        dividendPercentage,
        agentDividendConditions
      },
      agentDividendType
    )

    setSubmit(formData)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(null)
  }

  return (
    <FormDialog
      id="config-agent-dialog"
      defaultValues={clone(agent)}
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
      maxWidth="100vw"
      minWidth="60vw"
      placement="top"
    >
      <FormBody agent={agent} brand={brand} />
    </FormDialog>
  )
}

const FormBody = ({ brand, agent }) => {
  let isCash = isAgentTypeCash(agent?.type)

  return (
    <Set orientation="vertical" isFilled>
      <Set orientation="vertical" marginLeft="1rem" marginRight="1rem" isFilled>
        <FieldValues>
          <NormalLabel>
            <UserNameTrans />
          </NormalLabel>
          <Box alignY="center">{agent?.username}</Box>

          <NormalLabel>
            <RealNameTrans />
          </NormalLabel>
          <Box alignY="center">{agent?.realName}</Box>

          <Box alignY="center">
            <UpperLevelAgentTrans />
          </Box>
          <Box alignY="center">{agent?.parentUsername}</Box>

          <NormalLabel>
            <RegistrationTimeTrans />
          </NormalLabel>
          <Box alignY="center">
            <FormattedDateTime value={agent?.registeredOn} />
          </Box>

          <NormalLabel>
            <BalanceTrans />
          </NormalLabel>
          <Box alignY="center">
            <FormattedNumberDecimal value={agent?.balance} />
          </Box>

          <NormalLabel>
            <AgentTypeTrans />
          </NormalLabel>
          <Box alignY="center">
            <AgentTypeLabel value={agent?.type} />
          </Box>

          <NormalLabel>
            <AgentLevelTrans />
          </NormalLabel>
          <Box alignY="center">
            <AgentLevelLabel value={agent?.levelType} />
          </Box>

          {isCash && (
            <ProfitSharingBox agentDividendType={brand?.agentDividendType} />
          )}
        </FieldValues>
      </Set>
    </Set>
  )
}
