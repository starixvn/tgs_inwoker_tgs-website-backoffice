import React, { useState, useEffect, useMemo, useRef, useContext } from "react"
import { css, Global } from "@emotion/react"
import {
  useEditPlayerInfo,
  useUpdatePlayer,
  toUpdatePlayerFormData
} from "./client"
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
  Group
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
import Textarea from "../../textarea"
import { isValid, parse } from "date-fns"
import { defaultFormatDate } from "../../date/format"
import { PlayerIdentityStateIcon } from "../player-identity/PlayerIdentityState"
import { PlayerBucketListDialogDisclosure } from "./PlayerBucketList"
import { diff } from "../../object/diff"
import { UpperLevelAgentTrans } from "../../trans/Agent"
import {
  BalanceTrans,
  BirthdayTrans,
  ICNumberTrans,
  RealNameTrans,
  RegistrationTimeTrans,
  UserNameTrans
} from "../../trans/User"
import { PlayerCodeTrans, RegistrationDomainTrans } from "../../trans/Player"
import { StatusTrans } from "../../trans/Status"
import { VipLevelTrans } from "../../trans/Vip"
import { RemarkTrans } from "../../trans/Action"

export const Key = "player"

export const Tab = ({ ...props }) => {
  return (
    <_Tab tabId={Key} {...props}>
      <Trans zh="玩家信息" en="Player" vi="Thông tin người chơi" />
    </_Tab>
  )
}

//TODO:1.39 > rm isDev(), use UpdatePlayerInfoPanel
export const EditPanel = (props) => {
  return isDev() ? (
    <UpdatePlayerInfoPanel {...props} />
  ) : (
    <CurrentPlayerInfoPanel {...props} />
  )
}

const UpdatePlayerInfoPanel = ({
  brandId,
  brand,
  playerCode = "",
  player,
  showParentUsername,
  onSubmitted,
  onClickClose,
  ...props
}) => {
  let defaultValues = clone({
    ...player,
    birthdate: parse(player?.birthdate ?? "", "yyyy/MM/dd", new Date())
  })

  let formMethods = useForm({
    defaultValues
  })

  let [submitData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } = useUpdatePlayer(
    playerCode,
    submitData
  )

  const reset = () => {
    deleteCache()
    mutate(null, false)
    setSubmit(undefined)
  }

  useEffect(() => {
    if (result && !error) {
      reset()
      onSubmitted?.()
    }
  }, [result])

  const onSubmit = ({
    birthdate,
    wageringRequirement: _,
    banks,
    ...data
  } = {}) => {
    //drop wageringRequirement & banks not updatable value

    //TODO: able to set not valid birthday to null?
    birthdate = isValid(birthdate) ? defaultFormatDate(birthdate) : null

    let formData = diff(
      {
        birthdate,
        ...data
      },
      player
    )
    setSubmit(toUpdatePlayerFormData(formData))
  }

  return (
    <TabPanel tabId={Key} {...props}>
      {error && <AlertDialog {...error} onClickClose={reset} />}
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          <EditForm
            brandId={brandId}
            brand={brand}
            playerCode={playerCode}
            player={player}
            showParentUsername={showParentUsername}
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

//TODO:1.40 > rm CurrentPlayerInfoPanel
const CurrentPlayerInfoPanel = ({
  brandId,
  brand,
  playerCode = "",
  player: { birthdate = "", ...player },
  showParentUsername,
  onSubmitted,
  onClickClose,
  ...props
}) => {
  let formMethods = useForm({
    defaultValues: clone({
      birthdate: parse(birthdate, "yyyy/MM/dd", new Date()),
      ...player
    })
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

  const onSubmit = ({ birthdate, ...data } = {}) => {
    if (isValid(birthdate)) {
      birthdate = defaultFormatDate(birthdate)
    }
    setSubmit({
      birthdate,
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
            brand={brand}
            playerCode={playerCode}
            player={player}
            showParentUsername={showParentUsername}
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
  brand,
  playerCode = "",
  player = {},
  showParentUsername,
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
            <PlayerCodeTrans />
            <Text>{player.playerCode}</Text>
          </>
        )}
        <UserNameLabel />
        <Text>{username}</Text>

        <RealNameLabel />
        <Box>
          <Input name="realName" />
        </Box>

        <BirthdayLabel />
        <Box>
          <DateInput name="birthdate" />
        </Box>

        <IdentityCardNumberLabel />
        <Group>
          <Input
            name="idNumber"
            defaultValue={player?.idNumber}
            disabled
            readOnly
          />
          {brand?.enablePlayerIdentity && player.idNumber && (
            <Button disabled>
              <PlayerIdentityStateIcon value={player.identityAuthentication} />
            </Button>
          )}
        </Group>

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

        {showParentUsername && (
          <>
            <AllAgentUpperLevelLabel />
            <Box>
              <Input
                name="parentUsername"
                placeholder={allAgentUpperLevelPlaceholder}
              />
            </Box>
          </>
        )}

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

export const Panel = ({
  player = {},
  brand,
  showParentUsername,
  onSubmitted,
  ...props
}) => {
  let isAdmin = useIsAdminUser()
  let {
    username = "",
    realName = "",
    vipLevel = "",
    registeredOn,
    balance,
    status,
    playerPayment
  } = player

  return (
    <TabPanel tabId={Key} {...props}>
      <FieldValues spacing="major-2">
        {isAdmin && (
          <>
            <PlayerCodeTrans />
            <Text>{player.playerCode}</Text>
          </>
        )}
        <UserNameLabel />
        <Text data-field="username">{username}</Text>

        <RealNameLabel />
        <Box>
          <Text data-field="realName">{realName}</Text>
        </Box>

        <BirthdayLabel />
        <Box>
          <FormattedDate
            value={parse(player?.birthdate, "yyyy/MM/dd", new Date())}
          />
        </Box>

        <IdentityCardNumberLabel />
        <Set orientation="horizontal" alignY="center">
          <Text.Block>{player.idNumber}</Text.Block>
          {brand?.enablePlayerIdentity && player.idNumber && (
            <PlayerIdentityStateIcon value={player.identityAuthentication} />
          )}
        </Set>

        <VIPLevelLabel />
        <Box>
          <VipLevelLabel value={vipLevel} />
        </Box>

        <AgentUsernameLabel />
        <Box>
          <Text>{player?.agentUsername}</Text>
        </Box>

        {showParentUsername && (
          <>
            <AllAgentUpperLevelLabel />
            <Box>
              <Text>{player?.parentUsername}</Text>
            </Box>
          </>
        )}

        <BalanceLabel />
        <Box>
          <FormattedNumberDecimal value={balance} />
        </Box>

        <Box alignY="center">
          <WageringRequirementLabel />
        </Box>
        <Set>
          <FormattedNumberDecimal value={player?.wageringRequirement} />
          <PlayerBucketListDialogDisclosure playerCode={player.playerCode} />
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

        <Trans zh="总存款" en="Total　Deposit" vi="Tổng nạp" />
        <FormattedNumberDecimal value={playerPayment?.totalDepositAmount} />

        <Trans zh="总提款" en="Total　Withdraw" vi="Tổng rút" />
        <FormattedNumberDecimal value={playerPayment?.totalWithdrawAmount} />
      </FieldValues>
    </TabPanel>
  )
}

export const UserNameLabel = () => <UserNameTrans />

export const RealNameLabel = () => <RealNameTrans />

export const BirthdayLabel = () => <BirthdayTrans />

const IdentityCardNumberLabel = () => <ICNumberTrans />

export const VIPLevelLabel = () => <VipLevelTrans />

export const AgentUsernameLabel = () => <UpperLevelAgentTrans />

const AllAgentUpperLevelLabel = () => (
  <Trans zh="全民代理上級" en="All Agent Upper Level" />
)

const BalanceLabel = () => <BalanceTrans />

const WageringRequirementLabel = () => (
  <Trans
    zh="需滿足提款金額"
    en="Wagering requirement"
    vi="Cần đạt số tiền rút"
  />
)

export const StatusLabel = () => <StatusTrans />

export const RemarkLabel = () => <RemarkTrans />

const RegisterIPLabel = () => (
  <Trans zh="注册IP地址" en="Register IP" vi="Địa chỉ IP đăng ký" />
)

//TODO: rm
const RegistrationLabel = () => <RegistrationTimeTrans />

const LastLoginTimeLabel = () => (
  <Trans
    zh="最后登录时间"
    en="Last Login Time"
    vi="Thời gian đăng nhập cuối cùng "
  />
)

const LoginIPLabel = () => (
  <Trans
    zh="最后登录IP地址"
    en="Last Login IP"
    vi="Địa chỉ IP đăng nhập cuối cùng"
  />
)

//TODO: rm
const RegistrationDomainLabel = () => <RegistrationDomainTrans />
