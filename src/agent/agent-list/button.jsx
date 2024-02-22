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
  Text,
  Spinner
} from "bumbag"
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
import Disclosure, {
  AddDisclosure,
  EditDisclosure,
  ViewDisclosure
} from "../../dialog/Disclosure"
import { Tabs, TabList, useTabState } from "../../tab"
import { AgentInfoKey, AgentInfoPanel, AgentInfoTab } from "./AgentInfo"
import { AgentContactInfoPanel, AgentContactInfoTab } from "./AgentContactInfo"
//TODO
// import { AgentBankInfoPanel, AgentBankInfoTab } from "./AgentBankInfo"
import { AgentPasswordPanel, AgentPasswordTab } from "./AgentPassword"
import {
  AgentWithdrawPasswordPanel,
  AgentWithdrawPasswordTab
} from "./AgentWithdrawPassword"
import FormDialog from "../../form/FormDialog"
import { FieldValues, TwoColumns } from "../../layout/Grid"
import { NormalLabel } from "../../form/Label"
import Input, { InputField } from "../../input/Input"
import { PasswordInputField } from "../../input/PasswordInput"
import { useFormContext, useWatch } from "react-hook-form"
import AgentLevel, {
  AgentLevelLabel,
  AgentLevelSelect,
  isAgentParentRequired
} from "../AgentLevel"
import AgentType, {
  AgentTypeLabel,
  AgentTypeSelect,
  isAgentTypeCash,
  isAgentTypeCredit
} from "../AgentType"
import Textarea from "../../textarea"
import { AgentOneLayerDividendPercentageInputField } from "../AgentOneLayerDividendPercentage"
import clone from "clone-deep"
import {
  AgentBalanceChangePanel,
  AgentBalanceChangeTab
} from "./AgentBalanceChange"
import { isDev, isLocalDev } from "../../env"
import { AgentMultipleLayerProfitSharingSettingDialogDisclosure } from "../AgentMultipleLayerProfitSharingSetting"
import { AgentDomainListTab, AgentDomainListPanel } from "./AgentDomainList"
import {
  isAgentProfitSharingOneLayer,
  isAgentProfitSharingMultipleLayer
} from "../AgentProfitSharingType"
import { AgentHistoryListPanel, AgentHistoryListTab } from "./AgentHistoryList"
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
import { RemarkTrans } from "../../trans/Action"

export const AddAgentButton = ({ brand, onSubmitted, ...props }) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([UpdateMenu])
  if (!isDisplay) {
    return null
  }

  if (!!brand?.enablePlayerAgent) {
    return null
  }

  return (
    <>
      <AddDisclosure {...dialog} {...props} />
      {dialog.visible && (
        <AddDialog brand={brand} onSubmitted={onSubmitted} dialog={dialog} />
      )}
    </>
  )
}

const AddDialog = ({ brand, onSubmitted, dialog }) => {
  let brandId = brand.id
  let [formData, setSubmit] = useState()
  let { result, error, mutate, deleteCache, isLoading } = useAddAgent(formData)

  const onSubmit = (data) => {
    setSubmit(data)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  let title = useTrans({
    zh: "新增代理",
    en: "Add Agent"
  })

  return (
    <FormDialog
      id="add-agent-dialog"
      defaultValues={{
        levelType: AgentLevel.Chief,
        type: AgentType.Cash,
        brandId
      }}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={onSubmitted}
      title={title}
      dialog={dialog}
      maxWidth="100vw"
      minWidth="60vw"
      placement="top"
    >
      <FormBody isAdd brand={brand} />
    </FormDialog>
  )
}

const AlphabetNumberOnly = new RegExp("^[A-Za-z0-9]+$")

const BrandIdField = "brandId"
const ParentUsernameFieldName = "parentUsername"

const FormBody = ({ isAdd, brand }) => {
  let { control, getValues } = useFormContext()

  const LevelTypeFieldName = "levelType"
  let levelType = useWatch({
    control,
    name: LevelTypeFieldName
  })
  let parentAgentRequired = isAgentParentRequired(levelType)

  const PasswordFieldName = "password"
  let password = useWatch({
    control,
    name: PasswordFieldName
  })

  const AgentTypeFieldName = "type"
  let agentType = useWatch({
    control,
    name: AgentTypeFieldName
  })
  let isCash = isAgentTypeCash(agentType)

  let alphabetOnlyMessage = useTrans({
    zh: "仅限字母和数字",
    en: "Alphabet and Number Only"
  })

  return (
    <Set orientation="vertical" isFilled marginLeft="1rem">
      <Heading use="h5">
        <Trans zh="基本资料" en="Basic info" />
      </Heading>
      <Set orientation="vertical" marginLeft="1rem" marginRight="1rem" isFilled>
        <FieldValues>
          <NormalLabel required>
            <UserNameTrans />
          </NormalLabel>
          <InputField
            name="username"
            required
            autoComplete="off"
            validate={(value) => {
              let result = AlphabetNumberOnly.test(value) || alphabetOnlyMessage
              return result
            }}
            registerOptions={{
              setValueAs: (value = "") => value?.trim?.()
            }}
          />

          <NormalLabel required>
            <Trans zh="登入密码" en="Password" />
          </NormalLabel>
          <PasswordInputField name={PasswordFieldName} />

          <NormalLabel required>
            <Trans zh="确认密码" en="Confirm password" />
          </NormalLabel>
          <PasswordInputField name="confirmPassword" matchPassword={password} />

          {!parentAgentRequired && (
            <>
              <NormalLabel>
                <AgentTypeTrans />
              </NormalLabel>
              <AgentTypeSelect name={AgentTypeFieldName} required />
            </>
          )}

          <NormalLabel>
            <AgentLevelTrans />
          </NormalLabel>
          <AgentLevelSelect
            name={LevelTypeFieldName}
            required
            placeholder={false}
          />

          {parentAgentRequired && (
            <>
              <NormalLabel required>
                <Trans zh="上级用户名" en="Upper Level Username" />
              </NormalLabel>
              <InputField name={ParentUsernameFieldName} required />
            </>
          )}

          {isCash && (
            <ProfitSharingBox
              isAdd={isAdd}
              agentDividendType={brand?.agentDividendType}
            />
          )}

          <NormalLabel required>
            <RemarkTrans />
          </NormalLabel>
          <Textarea name="remarks" required />
        </FieldValues>
      </Set>
      <Input
        type="hidden"
        name={BrandIdField}
        value={getValues(BrandIdField)}
      />
    </Set>
  )
}

const ProfitSharingBox = ({ isAdd = false, agentDividendType }) => {
  let label = (
    <NormalLabel required>
      <Trans zh="代理分红" en="Profit Sharing" />
    </NormalLabel>
  )
  let { control, getValues } = useFormContext()

  let parentUsername = useWatch({
    control,
    name: ParentUsernameFieldName
  })

  let brandId = getValues(BrandIdField)

  if (isAgentProfitSharingOneLayer(agentDividendType)) {
    return (
      <>
        {label}
        <Box alignY="center">
          <AgentOneLayerDividendPercentageInputField
            brandId={brandId}
            parentUsername={parentUsername}
          />
        </Box>
      </>
    )
  }

  //Note. when add agent, MultipleLayer use template setting directly
  if (isAdd) {
    return null
  }

  //multipleLayer
  return (
    <>
      {label}
      <Box>
        <AgentMultipleLayerProfitSharingSettingDialogDisclosure />
      </Box>
    </>
  )
}

const ConfigFormBody = ({ brand, agent }) => {
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
            <FormattedDateTime value={agent?.registration} />
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

export const ViewButton = ({ brand, agent, ...props }) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([ViewMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <ViewDisclosure {...dialog} {...props} />
      {dialog.visible && (
        <TabsDialog
          brand={brand}
          agent={agent}
          readonly
          dialog={dialog}
          dialogId="view-agent-dialog"
        />
      )}
    </>
  )
}

export const EditButton = ({ brand, agent, onSubmitted, ...props }) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([UpdateMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <EditDisclosure {...dialog} {...props} />
      {dialog.visible && (
        <TabsDialog
          brand={brand}
          agent={agent}
          onSubmitted={onSubmitted}
          dialog={dialog}
          dialogId="edit-agent-dialog"
        />
      )}
    </>
  )
}

export const ConfigButton = ({ brand, agent, onSubmitted, ...props }) => {
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
          brand={brand}
          agentId={agent.id}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

const ConfigDialog = (props) => {
  return <UpdateConfigDialog {...props} />
}

const UpdateConfigDialog = ({ brand, agentId, onSubmitted, dialog }) => {
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
    setSubmit(undefined)
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
      <ConfigFormBody agent={agent} brand={brand} />
    </FormDialog>
  )
}

const TabsDialog = ({
  brand,
  agent,
  readonly = false,
  dialog,
  dialogId,
  ...props
}) => {
  let agentId = agent?.id
  let tab = useTabState({
    selectedId: AgentInfoKey
  })

  let title = useTrans({
    zh: "代理详情",
    en: "Agent Info"
  })

  const { isLoading, data, error, mutate, deleteCache } = useAgent(agentId)

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} {...dialog} onClickClose={dialog.hide} />
  }

  const onSubmitted = () => {
    props?.onSubmitted()
    dialog.hide()
    mutate()
  }

  const onBankSubmitted = () => {
    mutate()
  }

  const onClickClose = dialog.hide

  let editable = !readonly
  return (
    <Dialog.Modal
      id={dialogId}
      title={title}
      hideOnClickOutside={false}
      showCloseButton={true}
      placement="top"
      {...dialog}
      minWidth="80vw"
      minHeight="85vh"
      css={css`
        & .bb-DialogContent {
          min-height: 85vh;
        }
      `}
    >
      {readonly && (
        <ViewTabs
          agentId={agentId}
          brand={brand}
          agent={clone(data)}
          tab={tab}
        />
      )}
      {editable && (
        <EditTabs
          agentId={agentId}
          brand={brand}
          agent={clone(data)}
          tab={tab}
          onSubmitted={onSubmitted}
          onBankSubmitted={onBankSubmitted}
          onClickClose={onClickClose}
        />
      )}
    </Dialog.Modal>
  )
}

const ViewTabs = ({ brand, agent, tab }) => {
  let brandId = brand?.id

  let disabledAgentPlayer = !brand.enablePlayerAgent
  return (
    <Tabs isFitted>
      <TabList use={TabList} {...tab}>
        <AgentInfoTab {...tab} />
        {disabledAgentPlayer && <AgentContactInfoTab {...tab} />}
        <AgentHistoryListTab {...tab} />
        <AgentBalanceChangeTab {...tab} />
        <AgentDomainListTab {...tab} />
      </TabList>

      <AgentInfoPanel brand={brand} agent={agent} readonly {...tab} />

      {disabledAgentPlayer && (
        <AgentContactInfoPanel agent={agent} readonly {...tab} />
      )}

      <AgentHistoryListPanel agentId={agent?.id} brandId={brandId} {...tab} />
      <AgentBalanceChangePanel brandId={brandId} agentId={agent?.id} {...tab} />
      <AgentDomainListPanel
        brandId={brandId}
        agentId={agent?.id}
        readOnly
        {...tab}
      />
    </Tabs>
  )
}

const EditTabs = ({
  brand,
  agent,
  tab,
  onSubmitted,
  onBankSubmitted,
  onClickClose
}) => {
  let disabledAgentPlayer = !brand.enablePlayerAgent
  let brandId = brand?.id
  let agentId = agent?.id

  let hasChangeWithdrawPasswordAuth = useIsDisplayMenuByRoute([
    ChangeWithdrawalPassword
  ])
  return (
    <Tabs isFitted>
      <TabList use={TabList} {...tab}>
        <AgentInfoTab {...tab} />
        {disabledAgentPlayer && <AgentContactInfoTab {...tab} />}
        {disabledAgentPlayer && <AgentPasswordTab {...tab} />}
        {disabledAgentPlayer && hasChangeWithdrawPasswordAuth && (
          <AgentWithdrawPasswordTab {...tab} />
        )}
        <AgentDomainListTab {...tab} />
      </TabList>
      <AgentInfoPanel
        brand={brand}
        agent={agent}
        onSubmitted={onSubmitted}
        onClickClose={onClickClose}
        {...tab}
      />
      {disabledAgentPlayer && (
        <AgentContactInfoPanel
          agent={agent}
          onSubmitted={onSubmitted}
          onClickClose={onClickClose}
          {...tab}
        />
      )}
      {disabledAgentPlayer && (
        <AgentPasswordPanel
          agent={agent}
          onSubmitted={onSubmitted}
          onClickClose={onClickClose}
          {...tab}
        />
      )}
      {disabledAgentPlayer && hasChangeWithdrawPasswordAuth && (
        <AgentWithdrawPasswordPanel
          agentId={agentId}
          onSubmitted={onSubmitted}
          onClickClose={onClickClose}
          {...tab}
        />
      )}
      <AgentDomainListPanel
        brandId={brandId}
        agentId={agentId}
        onSubmitted={onSubmitted}
        onClickClose={onClickClose}
        {...tab}
      />
    </Tabs>
  )
}
