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
import { AgentBankInfoPanel, AgentBankInfoTab } from "./AgentBankInfo"
import {
  AgentOperationListPanel,
  AgentOperationListTab
} from "./AgentOperationList"
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
import AgentUpdateType from "./AgentUpdateType"
import { AgentOneLayerDividendPercentageInputField } from "../AgentOneLayerDividendPercentage"
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
import {
  AgentBalanceChangePanel,
  AgentBalanceChangeTab
} from "./AgentBalanceChange"
import { isAgentConfigRequired } from "../AgentConfigStatus"
import { isDev } from "../../env"
import { AgentMultipleLayerProfitSharingSettingDialogDisclosure } from "../AgentMultipleLayerProfitSharingSetting"
import { AgentDomainListTab, AgentDomainListPanel } from "./AgentDomainList"
import {
  isAgentProfitSharingOneLayer,
  isAgentProfitSharingMultipleLayer
} from "../AgentProfitSharingType"
import { useBrand } from "../../merchant/platforms/client"
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

export const AddAgentButton = ({
  brandId,
  agentProfitSharingType,
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
      <AddDisclosure {...dialog} {...props} />
      {dialog.visible && (
        <AddDialog
          brandId={brandId}
          agentProfitSharingType={agentProfitSharingType}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

const AddDialog = ({
  brandId,
  agentProfitSharingType,
  onSubmitted,
  dialog
}) => {
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
      <FormBody isAdd agentProfitSharingType={agentProfitSharingType} />
    </FormDialog>
  )
}

const AlphabetNumberOnly = new RegExp("^[A-Za-z0-9]+$")

const BrandIdField = "brandId"
const ParentUsernameFieldName = "parentUsername"
const FormBody = ({ isAdd, agentProfitSharingType }) => {
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
  let isCredit = isAgentTypeCredit(agentType)

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
              agentProfitSharingType={agentProfitSharingType}
            />
          )}

          {/* {isCredit && (
            <>
              <NormalLabel required>
                <AgentLiveDealerRebateText />
              </NormalLabel>
              <TwoColumns columns={["0.7fr"]}>
                <Flex flex="1 50%">
                  <AgentLiveDealerRebatePercentageInputField width="100%" />
                </Flex>

                <FieldValues flex="1 50%">
                  <NormalLabel required>
                    <AgentLotteryRebateText />
                  </NormalLabel>

                  <AgentLotteryRebatePercentageInputField />
                </FieldValues>
              </TwoColumns>
            </>
          )}

          {isCredit && (
            <>
              <NormalLabel required>
                <AgentEgameRebateText />
              </NormalLabel>
              <TwoColumns columns={["0.7fr"]}>
                <Flex flex="1 50%">
                  <AgentEgameRebatePercentageInputField width="100%" />
                </Flex>

                <FieldValues>
                  <NormalLabel required>
                    <AgentSportsRebateText />
                  </NormalLabel>

                  <AgentSportsRebatePercentageInputField />
                </FieldValues>
              </TwoColumns>
            </>
          )}

          {isCredit && (
            <>
              <NormalLabel required>
                <AgentCardGameRebateText />
              </NormalLabel>
              <TwoColumns columns={["0.7fr"]}>
                <Flex flex="1 50%">
                  <AgentCardGameRebatePercentageInputField width="100%" />
                </Flex>

                <FieldValues>
                  <NormalLabel required>
                    <AgentVirtualSportsRebateText />
                  </NormalLabel>

                  <AgentVirtualSportsRebatePercentageInputField />
                </FieldValues>
              </TwoColumns>
            </>
          )} */}

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

const ProfitSharingBox = ({ isAdd = false, agentProfitSharingType }) => {
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

  if (isAgentProfitSharingOneLayer(agentProfitSharingType)) {
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

const ConfigFormBody = ({ record, agentProfitSharingType }) => {
  let isCash = isAgentTypeCash(record?.type)
  let isCredit = isAgentTypeCredit(record?.type)

  return (
    <Set orientation="vertical" isFilled>
      <Set orientation="vertical" marginLeft="1rem" marginRight="1rem" isFilled>
        <FieldValues>
          <NormalLabel>
            <UserNameTrans />
          </NormalLabel>
          <Text.Block alignY="center">{record?.username}</Text.Block>

          <NormalLabel>
            <RealNameTrans />
          </NormalLabel>
          <Text.Block alignY="center">{record?.realName}</Text.Block>

          <Box alignY="center">
            <UpperLevelAgentTrans />
          </Box>
          <Text.Block alignY="center">{record?.parentUsername}</Text.Block>

          <NormalLabel>
            <RegistrationTimeTrans />
          </NormalLabel>
          <Text.Block alignY="center">
            <FormattedDateTime value={record?.registration} />
          </Text.Block>

          <NormalLabel>
            <BalanceTrans />
          </NormalLabel>
          <Text.Block alignY="center">
            <FormattedNumberDecimal value={record?.balance} />
          </Text.Block>

          <NormalLabel>
            <AgentTypeTrans />
          </NormalLabel>
          <Text.Block alignY="center">
            <AgentTypeLabel value={record?.type} />
          </Text.Block>

          <NormalLabel>
            <AgentLevelTrans />
          </NormalLabel>
          <Text.Block alignY="center">
            <AgentLevelLabel value={record?.levelType} />
          </Text.Block>

          {isCash && (
            <ProfitSharingBox agentProfitSharingType={agentProfitSharingType} />
          )}

          {/* {isCredit && (
            <>
              <NormalLabel required>
                <AgentLiveDealerRebateText />
              </NormalLabel>
              <AgentLiveDealerRebatePercentageInputField />
            </>
          )}

          {isCredit && (
            <>
              <NormalLabel required>
                <AgentEgameRebateText />
              </NormalLabel>
              <AgentEgameRebatePercentageInputField />
            </>
          )}

          {isCredit && (
            <>
              <NormalLabel required>
                <AgentCardGameRebateText />
              </NormalLabel>
              <AgentCardGameRebatePercentageInputField />
            </>
          )}

          {isCredit && (
            <>
              <NormalLabel required>
                <AgentLotteryRebateText />
              </NormalLabel>
              <AgentLotteryRebatePercentageInputField />
            </>
          )}

          {isCredit && (
            <>
              <NormalLabel required>
                <AgentSportsRebateText />
              </NormalLabel>
              <AgentSportsRebatePercentageInputField />
            </>
          )}

          {isCredit && (
            <>
              <NormalLabel required>
                <AgentVirtualSportsRebateText />
              </NormalLabel>
              <AgentVirtualSportsRebatePercentageInputField />
            </>
          )} */}
        </FieldValues>
      </Set>
    </Set>
  )
}

export const ViewButton = ({
  record,
  brandId,
  agentProfitSharingType,
  ...props
}) => {
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
          record={record}
          brandId={brandId}
          agentProfitSharingType={agentProfitSharingType}
          readonly
          dialog={dialog}
          dialogId="view-agent-dialog"
        />
      )}
    </>
  )
}

export const EditButton = ({
  brandId,
  agentProfitSharingType,
  record,
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
      <EditDisclosure {...dialog} {...props} />
      {dialog.visible && (
        <TabsDialog
          brandId={brandId}
          agentProfitSharingType={agentProfitSharingType}
          record={record}
          onSubmitted={onSubmitted}
          dialog={dialog}
          dialogId="edit-agent-dialog"
        />
      )}
    </>
  )
}

export const ConfigButton = ({
  brandId,
  agentId,
  agentProfitSharingType,
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
          agentProfitSharingType={agentProfitSharingType}
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

const UpdateConfigDialog = ({
  brandId,
  agentId,
  agentProfitSharingType,
  onSubmitted,
  dialog
}) => {
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
    let formData = useAgentUpdateFormData(
      {
        ...diff(data, agent),
        type,
        parentUsername,
        dividendPercentage,
        agentDividendConditions
      },
      agentProfitSharingType
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
      <ConfigFormBody
        record={agent}
        agentProfitSharingType={agentProfitSharingType}
      />
    </FormDialog>
  )
}

const TabsDialog = ({
  record,
  brandId,
  agentProfitSharingType,
  readonly = false,
  dialog,
  dialogId,
  ...props
}) => {
  let agentId = record?.id
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
          brandId={brandId}
          agentProfitSharingType={agentProfitSharingType}
          record={clone(data)}
          tab={tab}
        />
      )}
      {editable && (
        <EditTabs
          agentId={agentId}
          brandId={brandId}
          agentProfitSharingType={agentProfitSharingType}
          record={clone(data)}
          tab={tab}
          onSubmitted={onSubmitted}
          onBankSubmitted={onBankSubmitted}
          onClickClose={onClickClose}
        />
      )}
    </Dialog.Modal>
  )
}

const ViewTabs = ({ brandId, agentProfitSharingType, record, tab }) => {
  return (
    <Tabs isFitted>
      <TabList use={TabList} {...tab}>
        <AgentInfoTab {...tab} />
        <AgentContactInfoTab {...tab} />
        {/* <AgentBankInfoTab {...tab} /> */}
        <AgentHistoryListTab {...tab} />
        <AgentBalanceChangeTab {...tab} />
        <AgentDomainListTab {...tab} />
      </TabList>

      <AgentInfoPanel
        brandId={brandId}
        agentProfitSharingType={agentProfitSharingType}
        record={record}
        readonly
        {...tab}
      />
      <AgentContactInfoPanel record={record} readonly {...tab} />
      <AgentHistoryListPanel agentId={record?.id} brandId={brandId} {...tab} />
      <AgentBalanceChangePanel
        brandId={brandId}
        agentId={record?.id}
        {...tab}
      />
      <AgentDomainListPanel
        brandId={brandId}
        agentId={record?.id}
        readOnly
        {...tab}
      />
    </Tabs>
  )
}

const EditTabs = ({
  brandId,
  agentProfitSharingType,
  agentId,
  record,
  tab,
  onSubmitted,
  onBankSubmitted,
  onClickClose
}) => {
  let hasChangeWithdrawPasswordAuth = useIsDisplayMenuByRoute([
    ChangeWithdrawalPassword
  ])
  return (
    <Tabs isFitted>
      <TabList use={TabList} {...tab}>
        <AgentInfoTab {...tab} />
        <AgentContactInfoTab {...tab} />
        {/* <AgentBankInfoTab {...tab} /> */}
        <AgentPasswordTab {...tab} />
        {hasChangeWithdrawPasswordAuth && <AgentWithdrawPasswordTab {...tab} />}
        <AgentDomainListTab {...tab} />
      </TabList>
      <AgentInfoPanel
        record={record}
        brandId={brandId}
        agentProfitSharingType={agentProfitSharingType}
        agentId={agentId}
        onSubmitted={onSubmitted}
        onClickClose={onClickClose}
        {...tab}
      />
      <AgentContactInfoPanel
        record={record}
        brandId={brandId}
        agentId={agentId}
        onSubmitted={onSubmitted}
        onClickClose={onClickClose}
        {...tab}
      />
      {/* <AgentBankInfoPanel
        record={record}
        brandId={brandId}
        agentId={agentId}
        onSubmitted={onBankSubmitted}
        {...tab}
      /> */}
      <AgentPasswordPanel
        record={record}
        brandId={brandId}
        agentId={agentId}
        onSubmitted={onSubmitted}
        onClickClose={onClickClose}
        {...tab}
      />
      {hasChangeWithdrawPasswordAuth && (
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
