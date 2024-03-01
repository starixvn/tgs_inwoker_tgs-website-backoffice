import React, { useState, useEffect, useMemo, useRef, useContext } from "react"
import { css, Global } from "@emotion/react"
import { useUpdatePlayer, toUpdatePlayerFormData } from "./client"
import {
  Spinner,
  Stack,
  Columns,
  Box,
  Set,
  Button,
  Text,
  Group,
  Heading,
  FieldStack
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
import { EditIdNumber } from "./menu"
import { useIsAdminUser, useIsDisplayMenuByRoute } from "../../user/context"
import { isDev } from "../../env"
import { DateInput } from "../../date/DateInput"
import Textarea from "../../textarea"
import { isValid, parse } from "date-fns"
import { defaultFormatDate } from "../../date/format"
import { PlayerIdentityStateIcon } from "../player-identity/PlayerIdentityState"
import { PlayerBucketListDialogDisclosure } from "./PlayerBucketList"
import { diff } from "../../object/diff"
import {
  AgentTrans,
  UpperLevelAgentTrans,
  useAgentUsernameTrans
} from "../../trans/Agent"
import {
  BalanceTrans,
  BirthdayTrans,
  ICNumberTrans,
  LastLoginIPTrans,
  LastLoginTimeTrans,
  RealNameTrans,
  RegisterIPTrans,
  RegistrationTimeTrans,
  UserNameTrans
} from "../../trans/User"
import {
  AccountTypeTrans,
  PlayerCodeTrans,
  PlayerInfoTrans,
  PlayerTrans,
  RegistrationDomainTrans,
  WageringRequirementTrans
} from "../../trans/Player"
import { StatusTrans } from "../../trans/Status"
import {
  CurrentVipLevelTrans,
  VipAccumulationStatusTrans,
  VipLevelTrans,
  VipTotalDepositTrans,
  VipTotalValidBetTrans,
  VipUpgradeTrans
} from "../../trans/Vip"
import { RemarkTrans } from "../../trans/Action"
import {
  TotalDepositAmountTrans,
  TotalWithdrawAmountTrans
} from "../../trans/Field"
import {
  AutoOrManualSwitch,
  AutoOrManualSwitchLabel
} from "../../switch/AutoOrManualSwitch"

export const PlayerInfoKey = "player"

export const PlayerInfoTab = ({ ...props }) => {
  return (
    <_Tab tabId={PlayerInfoKey} {...props}>
      <PlayerInfoTrans />
    </_Tab>
  )
}

export const PlayerInfoEditPanel = (props) => {
  return <UpdatePlayerInfoPanel {...props} />
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
    fullLevel,
    nextVipLevel,
    nextVipLevelId,
    ...data
  } = {}) => {
    //drop wageringRequirement, banks, fullLevel, nextVipLevel, nextVipLevelId  not updatable value

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
    <TabPanel tabId={PlayerInfoKey} {...props}>
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

const PlayerIdNumberInputGroup = ({ player, showIdentityAuth }) => {
  let editable = useIsDisplayMenuByRoute([EditIdNumber])
  let disabled = !editable

  return (
    <Group>
      <Input
        name="idNumber"
        defaultValue={player?.idNumber}
        disabled={disabled}
        readOnly={disabled}
      />
      {showIdentityAuth && player.idNumber && (
        <Button disabled>
          <PlayerIdentityStateIcon value={player.identityAuthentication} />
        </Button>
      )}
    </Group>
  )
}

const AccountTypeBox = ({ player }) => {
  return (
    <>
      <AccountTypeTrans />
      {!!player?.upgradePlayerAgentId ? <AgentTrans /> : <PlayerTrans />}
    </>
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
  let agentUsernamePlaceholder = useAgentUsernameTrans()

  let allAgentUpperLevelPlaceholder = useTrans({
    zh: "全民代理上級",
    en: "All Agent Upper Level"
  })

  const WageringRequirementFieldName = "wageringRequirement"
  let wageringRequirement = useWatch({
    control,
    name: WageringRequirementFieldName
  })

  const VipUpgradeField = "vipLevelAutoState"

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

        <UserNameTrans />
        <Text>{username}</Text>

        <RealNameTrans />
        <Box>
          <Input name="realName" />
        </Box>

        <BirthdayTrans />
        <Box>
          <DateInput name="birthdate" />
        </Box>

        <ICNumberTrans />
        <PlayerIdNumberInputGroup
          player={player}
          showIdentityAuth={brand?.enablePlayerIdentity}
        />

        <VipLevelTrans />
        <Box>
          <VipLevelSelect
            name="vipId"
            defaultValue={player?.vipId}
            required
            brandId={brandId}
          />
        </Box>

        <VipUpgradeTrans />
        <AutoOrManualSwitch name={VipUpgradeField} {...props} />

        <UpperLevelAgentTrans />
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

        <RegistrationTimeTrans />
        <Box>
          <FormattedDateTime value={registeredOn} />
        </Box>

        <BalanceTrans />
        <Box>
          <FormattedNumberDecimal value={balance} />
        </Box>

        <Box alignY="center">
          <WageringRequirementTrans />
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

        <StatusTrans />
        <Box>
          <PlayerStatusSelect name="status" required placeholder={false} />
        </Box>

        <RemarkTrans />
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

export const PlayerInfoPanel = ({
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
    <TabPanel tabId={PlayerInfoKey} {...props}>
      <Columns>
        <Columns.Column>
          <FieldValues spacing="major-2">
            {isAdmin && (
              <>
                <PlayerCodeTrans />
                <Text>{player.playerCode}</Text>
              </>
            )}

            <UserNameTrans />
            <Text data-field="username">{username}</Text>

            <RealNameTrans />
            <Box>
              <Text data-field="realName">{realName}</Text>
            </Box>

            <BirthdayTrans />
            <Box>
              <FormattedDate
                value={parse(player?.birthdate, "yyyy/MM/dd", new Date())}
              />
            </Box>

            <ICNumberTrans />
            <Set orientation="horizontal" alignY="center">
              <Text.Block>{player.idNumber}</Text.Block>
              {brand?.enablePlayerIdentity && player.idNumber && (
                <PlayerIdentityStateIcon
                  value={player.identityAuthentication}
                />
              )}
            </Set>

            <AccountTypeBox player={player} />

            <UpperLevelAgentTrans />
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

            <BalanceTrans />
            <Box>
              <FormattedNumberDecimal value={balance} />
            </Box>

            <Box alignY="center">
              <WageringRequirementTrans />
            </Box>
            <Set>
              <FormattedNumberDecimal value={player?.wageringRequirement} />
              <PlayerBucketListDialogDisclosure
                playerCode={player.playerCode}
              />
            </Set>

            <StatusTrans />
            <Box>
              <PlayerStatusLabel value={status} />
            </Box>

            <RemarkTrans />
            <Box>
              <Text>{player?.remark}</Text>
            </Box>

            <RegisterIPTrans />
            <Box>{player?.registerIp}</Box>

            <RegistrationTimeTrans />
            <Box>
              <FormattedDateTime value={registeredOn} />
            </Box>

            <LastLoginTimeTrans />
            <Box>
              <FormattedDateTime value={player?.lastLoginOn} />
            </Box>

            <LastLoginIPTrans />
            <Box>{player?.lastLoginIp}</Box>

            <RegistrationDomainTrans />
            <Box>{player?.registerHost}</Box>

            <TotalDepositAmountTrans />
            <FormattedNumberDecimal value={playerPayment?.totalDepositAmount} />

            <TotalWithdrawAmountTrans />
            <FormattedNumberDecimal
              value={playerPayment?.totalWithdrawAmount}
            />
          </FieldValues>
        </Columns.Column>
        <Columns.Column>
          <Heading use="h5">
            <VipAccumulationStatusTrans />
          </Heading>
          <FieldValues>
            <VipUpgradeTrans />
            <AutoOrManualSwitchLabel value={player.vipLevelAutoState} />

            <CurrentVipLevelTrans />
            <VipLevelLabel value={vipLevel} />

            <VipTotalValidBetTrans />
            <Set orientation="horizontal" alignY="center">
              <FormattedNumberDecimal value={player.accumTurnover} />
              <Box>/</Box>
              <FormattedNumberDecimal
                value={player.levelUpAccumulateBetAmount}
              />
            </Set>

            <VipTotalDepositTrans />
            <Set orientation="horizontal" alignY="center">
              <FormattedNumberDecimal value={player.accumDeposit} />
              <Box>/</Box>
              <FormattedNumberDecimal value={player.levelUpAccumulateDeposit} />
            </Set>
          </FieldValues>
        </Columns.Column>
      </Columns>
    </TabPanel>
  )
}

const AllAgentUpperLevelLabel = () => (
  <Trans zh="全民代理上級" en="All Agent Upper Level" />
)
