import React, { useState, useEffect, useMemo, useRef, useContext } from "react"
import { css, Global } from "@emotion/react"
import {
  Spinner,
  Stack,
  Flex,
  Box,
  Card,
  Set,
  Button,
  Text,
  Dialog,
  Modal,
  Table,
  useClassName,
  Alert
} from "bumbag"
import { FieldValues } from "../../layout/Grid"
import {
  Trans,
  FormattedDateTime,
  FormattedNumber,
  useTrans,
  FormattedNumberDecimal,
  FormattedNumberDecimalPercentage
} from "../../i18n"
import AlertDialog from "../../dialog/Alert"
import { SubmitCancel } from "../../button/ActionButtons"
import { Tab as _Tab, TabPanel } from "../../tab"
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch
} from "react-hook-form"
import { Input, InputField } from "../../input/Input"
import { useAgent, useUpdateAgent, useUpdateAgentV2 } from "./client"
import { AgentStatusLabel, AgentStatusSelect } from "../AgentStatus"
import { AgentLevelLabel, AgentLevelSelect, isAgentHead } from "../AgentLevel"
import {
  AgentTypeLabel,
  AgentTypeSelect,
  isAgentTypeCash,
  isAgentTypeCredit
} from "../AgentType"
import clone from "clone-deep"
import Select from "../../select/Select"
import {
  AgentOneLayerDividendPercentageInputField,
  Name as AgentDividendPercentageField
} from "../AgentOneLayerDividendPercentage"
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
import AgentLevel from "../AgentLevel"
import { isDev } from "../../env"
import {
  AgentMultipleLayerProfitSharingSettingDialogDisclosure,
  AgentProfitSharingSettingRecordDialogDisclosure
} from "../AgentMultipleLayerProfitSharingSetting"
import {
  isAgentProfitSharingMultipleLayer,
  isAgentProfitSharingOneLayer
} from "../AgentProfitSharingType"
import Textarea from "../../textarea"
import { ClearProfitShareDialogDisclosure } from "./ClearProfitShareDialog"
import { isEmpty, isNil } from "lodash-es"
import { either } from "ramda"
import { diff } from "../../object/diff"

let isNilOrEmpty = either(isNil, isEmpty)

const Key = "AgentInfo"

export const AgentInfoKey = Key

export const AgentInfoTab = ({ ...props }) => {
  return (
    <_Tab tabId={Key} {...props}>
      <Trans zh="代理信息" en="Agent Info" />
    </_Tab>
  )
}

export const AgentInfoPanel = ({ readonly = false, ...props }) =>
  readonly ? <ViewPanel {...props} /> : <EditPanel {...props} />

const EditPanel = (props) => {
  return isDev() ? (
    <UpdateAgentPanel {...props} />
  ) : (
    <CurrentAgentPanel {...props} />
  )
}

//TODO
const UpdateAgentPanel = ({
  brandId,
  agentProfitSharingType,
  record,
  onSubmitted,
  onClickClose,
  ...props
}) => {
  let formMethods = useForm({
    defaultValues: clone(record)
  })
  let { control, setValue } = formMethods

  let agentId = record?.id
  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } = useUpdateAgentV2(
    agentId,
    formData
  )

  useEffect(() => {
    if (result && !error) {
      reset()
      onSubmitted && onSubmitted()
    }
  }, [result])

  let agentUsernamePlaceholder = useTrans({
    zh: "代理用户名",
    en: "Agent Username"
  })

  const ParentUsernameFieldName = "parentUsername"
  let currentParentUsername = record.parentUsername
  let parentUsername = useWatch({
    control,
    name: ParentUsernameFieldName
  })

  let willChangeParent =
    currentParentUsername &&
    parentUsername &&
    currentParentUsername != parentUsername

  const LevelTypeFieldName = "levelType"
  let levelType = useWatch({
    control,
    name: LevelTypeFieldName
  })

  let changeLevelType = levelType != record.levelType

  let isChief = levelType == AgentLevel.Chief
  let isAgent = levelType == AgentLevel.Agent
  //TODO: rm displayParentUsername?
  let displayParentUsername = changeLevelType && isChief ? "none" : "block"

  let oneLayer = isAgentProfitSharingOneLayer(agentProfitSharingType)
  let multipleLayer = isAgentProfitSharingMultipleLayer(agentProfitSharingType)

  //TODO: diff
  const onSubmit = ({
    type,
    parentUsername,
    dividendPercentage,
    agentDividendConditions,
    status,

    realName,
    remarks,

    ...data
  } = {}) => {
    //TODO: diffs first

    //TODO: isNil?
    let formData = { status: { status }, info: { realName, remarks } }

    if (oneLayer) {
      formData = {
        ...formData,
        oneLayer: {
          type,
          parentUsername,
          dividendPercentage
        }
      }
    }

    if (multipleLayer) {
      formData = {
        ...formData,
        multipleLayer: {
          type,
          parentUsername,
          agentDividendConditions
        }
      }
    }

    console.log("formData", formData)
    setSubmit(formData)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  let agentHead = isAgentHead(record?.levelType)

  const AgentTypeField = "type"

  const ProfitSharingField = "accumulatedProfitSharing"
  let accumulatedProfitSharing = useWatch({
    name: ProfitSharingField,
    control
  })

  return (
    <TabPanel tabId={Key} {...props}>
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          <Stack>
            <FieldValues>
              <UsernameBox value={record?.username} />

              <RealNameBox>
                <Input name="realName" />
              </RealNameBox>

              <AgentTypeBox>
                <Box alignY="center">
                  {!agentHead && (
                    <>
                      <AgentTypeSelect
                        name={AgentTypeField}
                        value={record?.type}
                        display="none"
                      />
                      <AgentTypeSelect value={record?.type} disabled />
                    </>
                  )}
                  {agentHead && <AgentTypeSelect name={AgentTypeField} />}
                </Box>
              </AgentTypeBox>

              <AgentLevelBox>
                <AgentLevelSelect
                  name={LevelTypeFieldName}
                  disabled={agentHead}
                  onChange={(event) => {
                    let isChief = event.target.value === AgentLevel.Chief
                    let isAgent = event.target.value === AgentLevel.Agent
                    let isOriginAgent = record.levelType === AgentLevel.Agent
                    if (isChief) {
                      setValue(ParentUsernameFieldName, "")
                    } else if (isAgent) {
                      //TODO: need reset back to origin value?
                      setValue(ParentUsernameFieldName, record?.parentUsername)
                    }
                  }}
                />
              </AgentLevelBox>

              {isAgent && (
                <>
                  <ParentAgentUsername display={displayParentUsername}>
                    <Set
                      orientation="vertical"
                      isFilled
                      display={displayParentUsername}
                    >
                      <Input
                        name={ParentUsernameFieldName}
                        placeholder={agentUsernamePlaceholder}
                        required
                      />
                      {willChangeParent && <ChangeParentWarning />}
                    </Set>
                  </ParentAgentUsername>
                </>
              )}

              <RegistrationBox value={record?.registeredOn} />

              <BalanceBox value={record?.balance} />

              <AccumulatedProfitSharingBox value={accumulatedProfitSharing}>
                <ClearProfitShareDialogDisclosure
                  agentId={agentId}
                  onSubmitted={() => {
                    setValue(ProfitSharingField, 0)
                  }}
                />
              </AccumulatedProfitSharingBox>

              <AgentStatusBox>
                <AgentStatusSelect name="status" placeholder={false} required />
              </AgentStatusBox>

              {oneLayer && (
                <>
                  <Trans zh="分红比例" en="Profit Sharing Percentage" />
                  <Box>
                    <AgentOneLayerDividendPercentageInputField
                      brandId={brandId}
                      parentUsername={record.parentUsername}
                    />
                  </Box>
                </>
              )}
              {multipleLayer && (
                <>
                  <Trans zh="分红比例" en="Profit Sharing Percentage" />
                  <Box>
                    <AgentMultipleLayerProfitSharingSettingDialogDisclosure
                      brandId={brandId}
                      parentUsername={record.parentUsername}
                    />
                  </Box>
                </>
              )}

              <RemarkLabel />
              <Textarea name="remarks" />
            </FieldValues>
            <Input
              type="hidden"
              name="id"
              value={formMethods.getValues("id")}
            />
            <Box alignX="right">
              <SubmitCancel
                isLoading={isLoading}
                onClickCancel={onClickClose}
              />
            </Box>
          </Stack>
        </form>
      </FormProvider>
      {error && <AlertDialog {...error} onClickClose={reset} />}
    </TabPanel>
  )
}

const CurrentAgentPanel = ({
  brandId,
  agentProfitSharingType,
  record,
  onSubmitted,
  onClickClose,
  ...props
}) => {
  let formMethods = useForm({
    defaultValues: clone(record)
  })
  let { control, setValue } = formMethods

  let agentId = record?.id
  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } = useUpdateAgent(
    agentId,
    formData
  )

  useEffect(() => {
    if (result && !error) {
      reset()
      onSubmitted && onSubmitted()
    }
  }, [result])

  let agentUsernamePlaceholder = useTrans({
    zh: "代理用户名",
    en: "Agent Username"
  })

  const ParentUsernameFieldName = "parentUsername"
  let currentParentUsername = record.parentUsername
  let parentUsername = useWatch({
    control,
    name: ParentUsernameFieldName
  })

  let willChangeParent =
    currentParentUsername &&
    parentUsername &&
    currentParentUsername != parentUsername

  const LevelTypeFieldName = "levelType"
  let levelType = useWatch({
    control,
    name: LevelTypeFieldName
  })
  let changeLevelType = levelType != record.levelType
  let displayParentUsername =
    changeLevelType && levelType == AgentLevel.Chief ? "none" : "block"

  const onSubmit = (data) => {
    setSubmit({
      ...record,
      updateType: "info",
      ...data
    })
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  let agentHead = isAgentHead(record?.levelType)

  const AgentTypeField = "type"
  let agentType = useWatch({
    control,
    name: AgentTypeField
  })

  const ProfitSharingField = "accumulatedProfitSharing"
  let accumulatedProfitSharing = useWatch({
    name: ProfitSharingField,
    control
  })

  let oneLayer = isAgentProfitSharingOneLayer(agentProfitSharingType)
  let multipleLayer = isAgentProfitSharingMultipleLayer(agentProfitSharingType)
  return (
    <TabPanel tabId={Key} {...props}>
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          <Stack>
            <FieldValues>
              <UsernameBox value={record?.username} />

              <RealNameBox>
                <Input name="realName" />
              </RealNameBox>

              <AgentTypeBox>
                <Box alignY="center">
                  {!agentHead && (
                    <>
                      <AgentTypeSelect
                        name={AgentTypeField}
                        value={record?.type}
                        display="none"
                      />
                      <AgentTypeSelect value={record?.type} disabled />
                    </>
                  )}
                  {agentHead && <AgentTypeSelect name={AgentTypeField} />}
                </Box>
              </AgentTypeBox>

              <AgentLevelBox>
                <AgentLevelSelect
                  name={LevelTypeFieldName}
                  disabled={agentHead}
                />
              </AgentLevelBox>

              {!agentHead && (
                <>
                  <ParentAgentUsername display={displayParentUsername}>
                    <Set
                      orientation="vertical"
                      isFilled
                      display={displayParentUsername}
                    >
                      <Input
                        name={ParentUsernameFieldName}
                        placeholder={agentUsernamePlaceholder}
                        required
                        disabled={
                          changeLevelType && levelType == AgentLevel.Chief
                        }
                      />
                      {willChangeParent && <ChangeParentWarning />}
                    </Set>
                  </ParentAgentUsername>
                </>
              )}

              <RegistrationBox value={record?.registeredOn} />

              <BalanceBox value={record?.balance} />

              <AccumulatedProfitSharingBox value={accumulatedProfitSharing}>
                <ClearProfitShareDialogDisclosure
                  agentId={agentId}
                  onSubmitted={() => {
                    setValue(ProfitSharingField, 0)
                  }}
                />
              </AccumulatedProfitSharingBox>

              <AgentStatusBox>
                <AgentStatusSelect name="status" placeholder={false} required />
              </AgentStatusBox>

              {oneLayer && (
                <>
                  <Trans zh="分红比例" en="Profit Sharing Percentage" />
                  <Box>
                    <AgentOneLayerDividendPercentageInputField
                      brandId={brandId}
                      parentUsername={record.parentUsername}
                    />
                  </Box>
                </>
              )}
              {multipleLayer && (
                <>
                  <Trans zh="分红比例" en="Profit Sharing Percentage" />
                  <Box>
                    <AgentMultipleLayerProfitSharingSettingDialogDisclosure
                      brandId={brandId}
                      parentUsername={record.parentUsername}
                    />
                  </Box>
                </>
              )}

              <>
                <RemarkLabel />
                <Textarea name="remarks" />
              </>

              {/* {!willChangeParent && (
                <RebateBox
                  label={<AgentLiveDealerRebateText />}
                  type={agentType}
                >
                  <AgentLiveDealerRebatePercentageInputField />
                </RebateBox>
              )}

              {!willChangeParent && (
                <RebateBox label={<AgentEgameRebateText />} type={agentType}>
                  <AgentEgameRebatePercentageInputField />
                </RebateBox>
              )}

              {!willChangeParent && (
                <RebateBox label={<AgentCardGameRebateText />} type={agentType}>
                  <AgentCardGameRebatePercentageInputField />
                </RebateBox>
              )}

              {!willChangeParent && (
                <RebateBox label={<AgentLotteryRebateText />} type={agentType}>
                  <AgentLotteryRebatePercentageInputField />
                </RebateBox>
              )}

              {!willChangeParent && (
                <RebateBox label={<AgentSportsRebateText />} type={agentType}>
                  <AgentSportsRebatePercentageInputField />
                </RebateBox>
              )}

              {!willChangeParent && (
                <RebateBox
                  label={<AgentVirtualSportsRebateText />}
                  type={agentType}
                >
                  <AgentVirtualSportsRebatePercentageInputField />
                </RebateBox>
              )} */}
            </FieldValues>
            <Input
              type="hidden"
              name="id"
              value={formMethods.getValues("id")}
            />
            <Box alignX="right">
              <SubmitCancel
                isLoading={isLoading}
                onClickCancel={onClickClose}
              />
            </Box>
          </Stack>
        </form>
      </FormProvider>
      {error && <AlertDialog {...error} onClickClose={reset} />}
    </TabPanel>
  )
}

const ChangeParentWarning = () => {
  let warning = useTrans({
    zh: "更改上級需重新配置",
    en: "Change the upper level agent required to re-config."
  })
  return <Alert variant="tint" title={warning} type="warning" />
}

const ViewPanel = ({ record, agentProfitSharingType, ...props }) => {
  let oneLayer = isAgentProfitSharingOneLayer(agentProfitSharingType)
  let multipleLayer = isAgentProfitSharingMultipleLayer(agentProfitSharingType)
  return (
    <TabPanel tabId={Key} {...props}>
      <FieldValues>
        <UsernameBox value={record?.username} />

        <Box alignY="center">
          <Trans zh="邀请码" en="Invitation Code" />
        </Box>
        <Text>{record?.invitationCode}</Text>

        <RealNameBox value={record?.realName} />

        <ParentAgentUsername value={record?.parentUsername} />

        <RegistrationBox value={record?.registeredOn} />

        <BalanceBox value={record?.balance} />

        <AgentStatusBox value={record?.status} />

        <AgentTypeBox value={record?.type} />

        <LevelTypeBox value={record?.levelType} />

        {oneLayer && (
          <>
            <Box alignY="center">
              <Trans zh="分红比例" en="Profit Sharing Percentage" />
            </Box>
            <Box>
              <FormattedNumberDecimalPercentage
                value={record?.dividendPercentage}
              />
            </Box>
          </>
        )}

        {multipleLayer && (
          <>
            <Box alignY="center">
              <Trans zh="分红比例" en="Profit Sharing Percentage" />
            </Box>
            <Box>
              <AgentProfitSharingSettingRecordDialogDisclosure
                record={record?.agentDividendConditions}
              />
            </Box>
          </>
        )}

        <AccumulatedProfitSharingBox value={record?.accumulatedProfitSharing} />

        <Box alignY="center">
          <Trans zh="直属玩家人数" en="Direct Players" />
        </Box>
        <Box>
          <FormattedNumber value={record?.playerNumber} />
        </Box>

        <RemarkLabel />
        <Textarea value={record?.remarks} disabled />
        {/* <RebateBox
          label={<AgentLiveDealerRebateText />}
          value={record?.liveDealerRebatePercentage}
          type={record?.type}
        />

        <RebateBox
          label={<AgentEgameRebateText />}
          value={record?.slotRebatePercentage}
          type={record?.type}
        />

        <RebateBox
          label={<AgentCardGameRebateText />}
          value={record?.cardGameRebatePercentage}
          type={record?.type}
        />

        <RebateBox
          label={<AgentLotteryRebateText />}
          value={record?.lotteryRebatePercentage}
          type={record?.type}
        />

        <RebateBox
          label={<AgentSportsRebateText />}
          value={record?.sportsRebatePercentage}
          type={record?.type}
        />

        <RebateBox
          label={<AgentVirtualSportsRebateText />}
          value={record?.virtualSportsRebatePercentage}
          type={record?.type}
        /> */}
      </FieldValues>
    </TabPanel>
  )
}

const UsernameBox = ({ value = "", children }) => {
  return (
    <>
      <Box alignY="center">
        <Trans zh="代理用户名" en="Agent Username" />
      </Box>
      <Text>{value}</Text>
    </>
  )
}

export const RealNameLabel = () => <Trans zh="真实姓名" en="Real name" />

const RealNameBox = ({ value = "", children }) => {
  return (
    <>
      <Box alignY="center">
        <RealNameLabel />
      </Box>
      {children ? children : <Text data-field="realName">{value}</Text>}
    </>
  )
}

const AgentLevelBox = ({ value = "", children }) => {
  return (
    <>
      <Box alignY="center">
        <Trans zh="代理种类" en="Level Type" />
      </Box>
      {children ? (
        children
      ) : (
        <AgentLevelLabel data-value={value} value={value} />
      )}
    </>
  )
}

const ParentAgentUsername = ({ value = "", children, display, ...props }) => {
  return (
    <>
      <Box alignY="center" display={display}>
        <Trans zh="上级代理" en="Upper level agent" />
      </Box>

      {children ? (
        children
      ) : (
        <Text
          data-type="parent-username"
          data-value={value}
          display={display}
          {...props}
        >
          {value}
        </Text>
      )}
    </>
  )
}

const RegistrationBox = ({ value }) => {
  return (
    <>
      <Trans zh="注册时间" en="Registration" />
      <Text>
        <FormattedDateTime value={value} />
      </Text>
    </>
  )
}

const BalanceBox = ({ value = "", ...props }) => {
  return (
    <>
      <Trans zh="余额" en="Balance" />
      <Text>
        <FormattedNumberDecimal data-value={value} value={value} {...props} />
      </Text>
    </>
  )
}

export const StatusLabel = () => <Trans zh="状态" en="Status" />

const AgentStatusBox = ({ value = "", children, ...props }) => {
  return (
    <>
      <StatusLabel />

      {children ? (
        children
      ) : (
        <Text>
          <AgentStatusLabel data-value={value} value={value} {...props} />
        </Text>
      )}
    </>
  )
}

const LevelTypeBox = ({ value = "", children, ...props }) => {
  return (
    <>
      <Trans zh="代理种类" en="Level Type" />

      {children ? (
        children
      ) : (
        <Text>
          <AgentLevelLabel data-value={value} value={value} {...props} />
        </Text>
      )}
    </>
  )
}

const AgentTypeBox = ({ value, children, ...props }) => {
  return (
    <>
      <Trans zh="代理类型" en="Agent Type" />
      {children ? (
        children
      ) : (
        <Text>
          <AgentTypeLabel data-value={value} value={value} {...props} />
        </Text>
      )}
    </>
  )
}

const DividendBox = ({ value, type, children, ...props }) => {
  let isCash = isAgentTypeCash(type)
  if (!isCash) {
    return null
  }

  return (
    <>
      <Trans zh="分红比例" en="Profit Sharing Percentage" />
      {children ? (
        children
      ) : (
        <Text>
          <FormattedNumberDecimal
            data-value={value}
            value={value}
            postfix="%"
            {...props}
          />
        </Text>
      )}
    </>
  )
}

const AccumulatedProfitSharingBox = ({ value, children, ...props }) => {
  return (
    <>
      <Trans zh="累计结算分红金额" en="Accumulated Profit Sharing" />
      <Set>
        <FormattedNumberDecimal data-value={value} value={value} {...props} />
        {children}
      </Set>
    </>
  )
}

export const RemarkLabel = () => <Trans zh="备注" en="Remark" />

const RebateBox = ({ label, value, type, children }) => {
  let isCredit = isAgentTypeCredit(type)
  if (!isCredit) {
    return null
  }

  return (
    <>
      {label}
      {children ? (
        children
      ) : (
        <Text>
          <FormattedNumberDecimal value={value} postfix="%" />
        </Text>
      )}
    </>
  )
}
