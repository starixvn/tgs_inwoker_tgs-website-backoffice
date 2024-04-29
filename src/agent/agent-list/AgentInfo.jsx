import React, { useState, useEffect, useMemo, useRef, useContext } from "react"
import { css, Global } from "@emotion/react"
import { Spinner, Stack, Box, Heading, Set, Text, Columns, Alert } from "bumbag"
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
import {
  useUpdateAgentV2,
  useAgentUpdateFormData,
  useAgentProductFee
} from "./client"
import { AgentStatusLabel, AgentStatusSelect } from "../AgentStatus"
import { AgentLevelLabel, AgentLevelSelect, isAgentHead } from "../AgentLevel"
import { AgentTypeLabel, AgentTypeSelect } from "../AgentType"
import clone from "clone-deep"
import { AgentOneLayerDividendPercentageInputField } from "../AgentOneLayerDividendPercentage"
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
import {
  AgentLevelTrans,
  AgentTypeTrans,
  AgentUsernameTrans,
  DirectPlayersTrans,
  NegativeDividendTrans,
  ProfitSharingPercentageTrans,
  UpperLevelAgentTrans,
  useAgentUsernameTrans
} from "../../trans/Agent"
import {
  BalanceTrans,
  RealNameTrans,
  RegistrationTimeTrans
} from "../../trans/User"
import { RemarkTrans } from "../../trans/Action"
import { StatusTrans } from "../../trans/Status"
import { LiableOrNotSwitchLabel } from "../../switch/LiableOrNotSwitch"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { ProductFee } from "./menu"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import { ProductFeeTrans } from "../../trans/Platform"
import {
  CardGameTrans,
  EGameTrans,
  LiveDealerTrans,
  LotteryTrans,
  SportsbookTrans,
  VirtualSportsTrans
} from "../../trans/Game"

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
  return <UpdateAgentPanel {...props} />
}

const UpdateAgentPanel = ({
  brand,
  agent,
  onSubmitted,
  onClickClose,
  ...props
}) => {
  let enableAgentPlayer = brand.enablePlayerAgent
  let brandId = brand?.id
  let agentDividendType = brand?.agentDividendType
  let formMethods = useForm({
    defaultValues: clone(agent)
  })
  let { control, setValue } = formMethods

  let agentId = agent?.id
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

  let agentUsernamePlaceholder = useAgentUsernameTrans()

  const ParentUsernameFieldName = "parentUsername"
  let currentParentUsername = agent.parentUsername
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

  let isAgent = levelType == AgentLevel.Agent

  let oneLayer = isAgentProfitSharingOneLayer(agentDividendType)
  let multipleLayer = isAgentProfitSharingMultipleLayer(agentDividendType)

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
      agentDividendType
    )
    setSubmit(formData)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  let agentHead = isAgentHead(agent?.levelType)

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
              <UsernameBox value={agent?.username} />

              <RealNameBox>
                <Input name="realName" disabled={enableAgentPlayer} />
              </RealNameBox>

              <AgentTypeBox>
                <Box alignY="center">
                  {!agentHead && (
                    <>
                      <AgentTypeSelect
                        name={AgentTypeField}
                        value={agent?.type}
                        display="none"
                      />
                      <AgentTypeSelect value={agent?.type} disabled />
                    </>
                  )}
                  {agentHead && (
                    <AgentTypeSelect
                      name={AgentTypeField}
                      disabled={enableAgentPlayer}
                    />
                  )}
                </Box>
              </AgentTypeBox>

              <AgentLevelBox>
                <AgentLevelSelect
                  name={LevelTypeFieldName}
                  disabled={agentHead}
                  onChange={(event) => {
                    let isChief = event.target.value === AgentLevel.Chief
                    let isAgent = event.target.value === AgentLevel.Agent
                    if (isChief) {
                      setValue(ParentUsernameFieldName, "")
                    } else if (isAgent) {
                      setValue(
                        ParentUsernameFieldName,
                        agent?.parentUsername ?? ""
                      )
                    }
                  }}
                />
              </AgentLevelBox>

              {isAgent && (
                <>
                  <ParentAgentUsername>
                    <Set orientation="vertical" isFilled>
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

              <RegistrationBox value={agent?.registeredOn} />

              <BalanceBox value={agent?.balance} />

              <AccumulatedProfitSharingBox value={accumulatedProfitSharing}>
                <ClearProfitShareDialogDisclosure
                  agentId={agentId}
                  onSubmitted={() => {
                    setValue(ProfitSharingField, 0)
                  }}
                />
              </AccumulatedProfitSharingBox>

              <AgentStatusBox>
                <AgentStatusSelect
                  name="status"
                  placeholder={false}
                  required
                  disabled={enableAgentPlayer}
                />
              </AgentStatusBox>

              {oneLayer && !willChangeParent && (
                <>
                  <ProfitSharingPercentageTrans />
                  <Box>
                    <AgentOneLayerDividendPercentageInputField
                      brandId={brandId}
                      parentUsername={parentUsername}
                    />
                  </Box>
                </>
              )}
              {multipleLayer && (
                <>
                  <ProfitSharingPercentageTrans />
                  <Box>
                    <AgentMultipleLayerProfitSharingSettingDialogDisclosure
                      brandId={brandId}
                      parentUsername={agent.parentUsername}
                    />
                  </Box>
                </>
              )}

              <RemarkTrans />
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

const ChangeParentWarning = () => {
  let warning = useTrans({
    zh: "更改上級需重新配置",
    en: "Change the upper level agent required to re-config."
  })
  return <Alert variant="tint" title={warning} type="warning" />
}

const ViewPanel = ({ agent, brand, ...props }) => {
  let agentDividendType = brand?.agentDividendType
  let oneLayer = isAgentProfitSharingOneLayer(agentDividendType)
  let multipleLayer = isAgentProfitSharingMultipleLayer(agentDividendType)
  let productFeeAuth = useIsDisplayMenuByRoute([ProductFee])
  console.log("agent", agent)
  return (
    <TabPanel tabId={Key} {...props}>
      <Columns>
        <Columns.Column>
          <FieldValues>
            <UsernameBox value={agent?.username} />

            <Box alignY="center">
              <Trans zh="邀请码" en="Invitation Code" />
            </Box>
            <Text>{agent?.invitationCode}</Text>

            <RealNameBox value={agent?.realName} />

            <ParentAgentUsername value={agent?.parentUsername} />

            <RegistrationBox value={agent?.registeredOn} />

            <BalanceBox value={agent?.balance} />

            <AgentStatusBox value={agent?.status} />

            <NegativeDividendBox
              value={agent?.negativeAgentDividendCarryForward}
            />

            <AgentTypeBox value={agent?.type} />

            <LevelTypeBox value={agent?.levelType} />

            {oneLayer && (
              <>
                <Box alignY="center">
                  <ProfitSharingPercentageTrans />
                </Box>
                <Box>
                  <FormattedNumberDecimalPercentage
                    value={agent?.dividendPercentage}
                  />
                </Box>
              </>
            )}

            {multipleLayer && (
              <>
                <Box alignY="center">
                  <ProfitSharingPercentageTrans />
                </Box>
                <Box>
                  <AgentProfitSharingSettingRecordDialogDisclosure
                    record={agent?.agentDividendConditions}
                  />
                </Box>
              </>
            )}

            <AccumulatedProfitSharingBox
              value={agent?.accumulatedProfitSharing}
            />

            <Box alignY="center">
              <DirectPlayersTrans />
            </Box>
            <Box>
              <FormattedNumber value={agent?.playerNumber} />
            </Box>

            <RemarkTrans />
            <Textarea value={agent?.remarks} disabled />
          </FieldValues>
        </Columns.Column>
        {agent?.id && productFeeAuth && (
          <Columns.Column>
            <ProductFeeBox agentId={agent?.id} />
          </Columns.Column>
        )}
      </Columns>
    </TabPanel>
  )
}

const ProductFeeBox = ({ agentId }) => {
  let { isLoading, data: productFee, error } = useAgentProductFee(agentId)
  if (isLoading) {
    return <Spinner />
  }

  console.log("productFee", productFee)
  return (
    <>
      <Heading use="h5">
        <ProductFeeTrans />
      </Heading>
      <FieldValues>
        <LiveDealerTrans />
        <FormattedNumberDecimalPercentage
          value={productFee?.liveDealerPercentage}
        />

        <SportsbookTrans />
        <FormattedNumberDecimalPercentage
          value={productFee?.sportsPercentage}
        />

        <EGameTrans />
        <FormattedNumberDecimalPercentage value={productFee?.slotPercentage} />

        <CardGameTrans />
        <FormattedNumberDecimalPercentage
          value={productFee?.cardGamePercentage}
        />

        <LotteryTrans />
        <FormattedNumberDecimalPercentage
          value={productFee?.lotteryPercentage}
        />

        <VirtualSportsTrans />
        <FormattedNumberDecimalPercentage
          value={productFee?.virtualSportsPercentage}
        />
      </FieldValues>
    </>
  )
}

const UsernameBox = ({ value = "", children }) => {
  return (
    <>
      <Box alignY="center">
        <AgentUsernameTrans />
      </Box>
      <Text>{value}</Text>
    </>
  )
}

const RealNameBox = ({ value = "", children }) => {
  return (
    <>
      <Box alignY="center">
        <RealNameTrans />
      </Box>
      {children ? children : <Text data-field="realName">{value}</Text>}
    </>
  )
}

const AgentLevelBox = ({ value = "", children }) => {
  return (
    <>
      <Box alignY="center">
        <AgentLevelTrans />
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
        <UpperLevelAgentTrans />
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
      <RegistrationTimeTrans />
      <Text>
        <FormattedDateTime value={value} />
      </Text>
    </>
  )
}

const BalanceBox = ({ value = "", ...props }) => {
  return (
    <>
      <BalanceTrans />
      <Text>
        <FormattedNumberDecimal data-value={value} value={value} {...props} />
      </Text>
    </>
  )
}

const NegativeDividendBox = ({ value, children, ...props }) => {
  return (
    <>
      <NegativeDividendTrans />
      {children ? (
        children
      ) : (
        <Text>
          <LiableOrNotSwitchLabel value={value} />
        </Text>
      )}
    </>
  )
}

const AgentStatusBox = ({ value = "", children, ...props }) => {
  return (
    <>
      <StatusTrans />

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
      <AgentLevelTrans />

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
      <AgentTypeTrans />
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

const AccumulatedProfitSharingBox = ({ value, children, ...props }) => {
  return (
    <>
      <Box alignY="center">
        <Trans zh="累计结算分红金额" en="Accumulated Profit Sharing" />
      </Box>
      <Set>
        <FormattedNumberDecimal data-value={value} value={value} {...props} />
        {children}
      </Set>
    </>
  )
}
