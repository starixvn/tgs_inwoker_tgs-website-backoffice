import React, { useState, useEffect, useMemo, useRef, useContext } from "react"
import { css, Global } from "@emotion/react"
import { useEditPlayerInfo } from "./client"
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
  useClassName
} from "bumbag"
import { FieldValues } from "../../layout/Grid"
import {
  Trans,
  FormattedDate,
  FormattedDateTime,
  FormattedNumber,
  useTrans,
  FormattedNumberDecimal
} from "../../i18n"
import { PlayerStatusSelect, PlayerStatusLabel } from "../PlayerStatus"
import { VipLevelSelect } from "../../vip-levels/VipLevelSelect"
import AlertDialog from "../../dialog/Alert"
import { SubmitCancel } from "../../button/ActionButtons"
import { Tab as _Tab, TabPanel } from "../../tab"
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch
} from "react-hook-form"
import Input from "../../input/Input"
import clone from "clone-deep"
import { VipLevelLabel } from "../../vip-levels/VipLevel"
import { PlayerClearWageringRequirementDisclosure } from "./PlayerClearWageringRequirement"
import { useIsAdminUser } from "../../user/context"
import { isDev } from "../../env"
import { DateInput } from "../../date/DateInput"
import { PlayerWageringRequirementDialogDisclosure } from "./PlayerWageringRequirementDialog"
import Textarea from "../../textarea"
import { isValid } from "date-fns"
import { defaultFormatDate } from "../../date/format"

export const Key = "player"

export const Tab = ({ ...props }) => {
  return (
    <_Tab tabId={Key} {...props}>
      <Trans zh="玩家信息" en="Player" />
    </_Tab>
  )
}

export const EditPanel = ({
  brandId,
  playerCode = "",
  player = {},
  onSubmitted,
  onClickClose,
  ...props
}) => {
  let formMethods = useForm({
    defaultValues: clone(player)
  })

  let [submitData, setSubmit] = useState()
  let { isLoading, result, error, mutate } = useEditPlayerInfo(
    playerCode,
    submitData
  )

  const reset = () => {
    mutate(null, false)
    setSubmit(undefined)
  }

  useEffect(() => {
    if (result && !error) {
      reset()
      onSubmitted?.()
    }
  }, [result])

  const onSubmit = ({ birthday, ...data } = {}) => {
    if (isValid(birthday)) {
      birthday = defaultFormatDate(birthday)
    }
    setSubmit({
      birthday,
      ...data
    })
  }

  return (
    <TabPanel tabId={Key} {...props}>
      {error && <AlertDialog {...error} onClickClose={reset} />}
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          <EditForm
            brandId={brandId}
            playerCode={playerCode}
            player={player}
            isLoading={isLoading}
            onClickClose={() => {
              reset()
              onClickClose?.()
            }}
          />
        </form>
      </FormProvider>
    </TabPanel>
  )
}

const EditForm = ({
  brandId,
  playerCode = "",
  player = {},
  isLoading,
  onClickClose,
  ...props
}) => {
  let { control, setValue } = useFormContext()
  let isAdmin = useIsAdminUser()
  let agentUsernamePlaceholder = useTrans({
    zh: "代理用户名",
    en: "Agent Username"
  })
  let allAgentUpperLevelPlaceholder = useTrans({
    zh: "全民代理上級",
    en: "All Agent Upper Level"
  })

  const WageringRequirementFieldName = "wageringRequirement"
  let wageringRequirement = useWatch({
    control,
    name: WageringRequirementFieldName
  })
  let { username = "", registeredOn, balance } = player

  return (
    <Stack spacing="major-1" margin="major-1">
      <FieldValues>
        {isAdmin && (
          <>
            <Trans zh="玩家代码" en="Player Code" />
            <Text>{player.playerCode}</Text>
          </>
        )}
        <UserNameLabel />
        <Text>{username}</Text>

        <RealNameLabel />
        <Box>
          <Input name="realName" />
        </Box>

        {/* 
        <BirthdayLabel />
        <Box>
          <DateInput name="birthday" />
        </Box> 
        */}

        <IdentityCardNumberLabel />
        <Box>
          <Input name="idNumber" />
        </Box>

        <VIPLevelLabel />
        <Box>
          <VipLevelSelect
            name="vipId"
            defaultValue={player?.vipId}
            required
            brandId={brandId}
          />
        </Box>

        <AgentUsernameLabel />
        <Box>
          <Input name="agentUsername" placeholder={agentUsernamePlaceholder} />
        </Box>

        <AllAgentUpperLevelLabel />
        <Box>
          <Input
            name="parentUsername"
            placeholder={allAgentUpperLevelPlaceholder}
          />
        </Box>

        <RegistrationLabel />
        <Box>
          <FormattedDateTime value={registeredOn} />
        </Box>

        <BalanceLabel />
        <Box>
          <FormattedNumberDecimal value={balance} />
        </Box>

        <Box alignY="center">
          <WageringRequirementLabel />
        </Box>
        <Set>
          <FormattedNumberDecimal value={wageringRequirement} />
          <Input type="hidden" name={WageringRequirementFieldName} />
          <PlayerClearWageringRequirementDisclosure
            id="clear-player-wagering-requirement-dialog-disclosure"
            playerCode={player?.playerCode}
            onSubmitted={() => {
              setValue(WageringRequirementFieldName, 0)
            }}
          />
        </Set>

        <StatusLabel />
        <Box>
          <PlayerStatusSelect name="status" required placeholder={false} />
        </Box>

        <RemarkLabel />
        <Box>
          <Textarea name="remark" />
        </Box>
      </FieldValues>
      <Box alignX="right">
        <SubmitCancel onClickCancel={onClickClose} isLoading={isLoading} />
      </Box>
    </Stack>
  )
}

export const Panel = ({ player = {}, onSubmitted, ...props }) => {
  let isAdmin = useIsAdminUser()
  let {
    username = "",
    realName = "",
    vipLevel = "",
    registeredOn,
    balance,
    status
  } = player

  return (
    <TabPanel tabId={Key} {...props}>
      <FieldValues spacing="major-2">
        {isAdmin && (
          <>
            <Trans zh="玩家代码" en="Player Code" />
            <Text>{player.playerCode}</Text>
          </>
        )}
        <UserNameLabel />
        <Text>{username}</Text>

        <RealNameLabel />
        <Box>
          <Text data-field="realName">{realName}</Text>
        </Box>

        {/* 
        <BirthdayLabel />
        <Box>
          <FormattedDate value={player?.birthday} />
        </Box> 
        */}

        <IdentityCardNumberLabel />
        <Box>{player.idNumber}</Box>

        <VIPLevelLabel />
        <Box>
          <VipLevelLabel value={vipLevel} />
        </Box>

        <AgentUsernameLabel />
        <Box>
          <Text>{player?.agentUsername}</Text>
        </Box>

        <AllAgentUpperLevelLabel />
        <Box>
          <Text>{player?.parentUsername}</Text>
        </Box>

        <BalanceLabel />
        <Box>
          <FormattedNumberDecimal value={balance} />
        </Box>

        <Box alignY="center">
          <WageringRequirementLabel />
        </Box>
        <Set>
          <FormattedNumberDecimal value={player?.wageringRequirement} />
          <PlayerWageringRequirementDialogDisclosure
            id="wagering-requirement-dialog-disclosure"
            playerCode={player.playerCode}
          />
        </Set>

        <StatusLabel />
        <Box>
          <PlayerStatusLabel value={status} />
        </Box>

        <RemarkLabel />
        <Box>
          <Text>{player?.remark}</Text>
        </Box>

        <RegisterIPLabel />
        <Box>{player?.registerIp}</Box>

        <RegistrationLabel />
        <Box>
          <FormattedDateTime value={registeredOn} />
        </Box>

        <LastLoginTimeLabel />
        <Box>
          <FormattedDateTime value={player?.lastLoginOn} />
        </Box>

        <LoginIPLabel />
        <Box>{player?.lastLoginIp}</Box>

        <RegistrationDomainLabel />
        <Box>{player?.registerHost}</Box>
      </FieldValues>
    </TabPanel>
  )
}

const UserNameLabel = () => <Trans zh="用户名" en="User name" />

const RealNameLabel = () => <Trans zh="真实姓名" en="Real name" />

const BirthdayLabel = () => <Trans zh="生日" en="Birthday" />

const IdentityCardNumberLabel = () => <Trans zh="身分证" en="IC Number" />

const VIPLevelLabel = () => <Trans zh="VIP等级" en="VIP Level" />

const AgentUsernameLabel = () => <Trans zh="上级代理" en="Upper Level Agent" />

const AllAgentUpperLevelLabel = () => (
  <Trans zh="全民代理上級" en="All Agent Upper Level" />
)

const BalanceLabel = () => <Trans zh="余额" en="Balance" />

const WageringRequirementLabel = () => (
  <Trans zh="需滿足提款金額" en="Wagering requirement" />
)

const StatusLabel = () => <Trans zh="状态" en="Status" />

const RemarkLabel = () => <Trans zh="备注" en="Remark" />

const RegisterIPLabel = () => <Trans zh="注册IP地址" en="Register IP" />

const RegistrationLabel = () => <Trans zh="注册时间" en="Registered Time" />

const LastLoginTimeLabel = () => (
  <Trans zh="最后登录时间" en="Last Login Time" />
)

const LoginIPLabel = () => <Trans zh="最后登录IP地址" en="Last Login IP" />

const RegistrationDomainLabel = () => (
  <Trans zh="注册域名" en="Registration Domain" />
)
