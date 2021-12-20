import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Set,
  Card,
  Stack,
  Box,
  Text,
  Dialog,
  Icon,
  useModalState,
  Alert,
  FieldStack,
  Group,
  Spinner,
  FieldWrapper
} from "bumbag"
import { ViewAllAgent, UpdateAllAgent } from "./menu"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Disclosure, DeleteDisclosure } from "../../dialog/Disclosure"
import { FormattedNumber, Trans, useTrans } from "../../i18n"
import FormDialog from "../../form/FormDialog"
import { FieldValues, TwoColumns } from "../../layout/Grid"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import clone from "clone-deep"
import { Input, InputField } from "../../input/Input"
import Backdrop from "../../dialog/Backdrop"
import ImageUploadButton from "../../file/upload/ImageUploadButton"
import { ImageLinkButton } from "../../button/LinkButton"
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch
} from "react-hook-form"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import { JsonEditor } from "../../text/editor/JsonEditor"
import { stringifyJSON } from "../../text/json"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import {
  useAllAgentSetting,
  useUpdateAllAgentSwitch,
  useUpdateAllAgentGameTypeSwitch,
  useAllAgentValidBetCondition,
  useUpdateAllAgentValidBetCondition,
  useAllAgentWinLossCondition,
  useUpdateAllAgentWinLossCondition
} from "../../agent/all-agent/client"
import { Tabs, Tab, TabList, TabPanel, useTabState } from "../../tab"
import { SwitchField } from "../../switch/Switch"
import { CheckboxField } from "../../checkbox"
import { SubmitButton } from "../../button/SubmitButton"

export const AllAgentDialogDisclosure = ({ brandId, ...props }) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([ViewAllAgent])
  let editable = useIsDisplayMenuByRoute([UpdateAllAgent])
  if (!isDisplay) {
    return null
  }

  let readOnly = !editable
  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="全民代理设定" en="All Agent Setting" />
      </Disclosure>
      {dialog.visible && (
        <AllAgentSettingDialog
          brandId={brandId}
          readOnly={readOnly}
          dialog={dialog}
        />
      )}
    </>
  )
}

//TODO: readOnly
const AllAgentSettingDialog = ({ brandId, readOnly, dialog }) => {
  let title = useTrans({
    zh: "全民代理设定",
    en: "All Agent Setting"
  })

  return (
    <Dialog.Modal
      title={title}
      showCloseButton
      hideOnClickOutside={false}
      {...dialog}
    >
      <DialogBody brandId={brandId} />
    </Dialog.Modal>
  )
}

const DialogBody = ({ brandId, dialog }) => {
  return (
    <FieldStack>
      <AllAgentMainSwitch brandId={brandId} dialog={dialog} />
      <AllAgentGameTypeTabs brandId={brandId} dialog={dialog} />
    </FieldStack>
  )
}

const AllAgentMainSwitch = ({ brandId, dialog }) => {
  let {
    isLoading: isLoadingAllAgent,
    data: allAgent,
    error: allAgentError,
    mutate: mutateAllAgent,
    deleteCache: deleteAllAgentCache
  } = useAllAgentSetting(brandId)

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useUpdateAllAgentSwitch(formData)

  let onLabel = useTrans({
    zh: "开启",
    en: "On"
  })

  let offLabel = useTrans({
    zh: "關閉",
    en: "Off"
  })

  const reset = () => {
    setSubmit(undefined)

    deleteCache()
    mutate(null, undefined)
  }

  useEffect(() => {
    if (!isLoading && result) {
      deleteAllAgentCache()
      mutateAllAgent(null)

      reset()
    }
  }, [isLoading, result])

  if (isLoadingAllAgent || isLoading) {
    return <Spinner />
  }

  if (allAgentError) {
    return <AlertDialog {...allAgentError} onClickClose={dialog.close} />
  }

  return (
    <>
      <SwitchField
        label={<Trans zh="总开关" en="Main Switch" />}
        switchLabel={allAgent?.switch ? onLabel : offLabel}
        defaultValue={allAgent?.switch}
        onChange={(event) => {
          let checked = event.target.checked
          setSubmit({
            brandId,
            switch: checked
          })
        }}
      />
      {error && <AlertDialog {...error} onClickClose={reset} />}
    </>
  )
}

const GameType = {
  Sportsbook: "Sportsbook",
  VirtualSports: "VirtualSports",
  LiveDealer: "LiveDealer",
  CardGame: "CardGame",
  Lottery: "Lottery",
  Slot: "Slot"
}

const GameTypeTrans = {
  Sportsbook: {
    zh: "体育",
    en: "Sports"
  },
  VirtualSports: {
    zh: "虚拟体育",
    en: "Virtual Sports"
  },
  LiveDealer: {
    zh: "真人",
    en: "Live Dealer"
  },
  CardGame: {
    zh: "棋牌",
    en: "Card Game"
  },
  Lottery: {
    zh: "彩票",
    en: "Lottery"
  },
  Slot: {
    zh: "电子",
    en: "EGame"
  }
}

const AllAgentGameTypeTabs = ({ brandId, dialog }) => {
  let tab = useTabState({
    selectedId: GameType.LiveDealer
  })

  return (
    <Tabs isFitted>
      <TabList use={TabList} {...tab}>
        <GameTypeTab gameType={GameType.LiveDealer} {...tab} />
        <GameTypeTab gameType={GameType.Slot} {...tab} />
        <GameTypeTab gameType={GameType.Sportsbook} {...tab} />
        <GameTypeTab gameType={GameType.VirtualSports} {...tab} />
        <GameTypeTab gameType={GameType.CardGame} {...tab} />
        <GameTypeTab gameType={GameType.Lottery} {...tab} />
      </TabList>

      <GameTypePanel
        brandId={brandId}
        gameType={GameType.LiveDealer}
        dialog={dialog}
        {...tab}
      />
      <GameTypePanel brandId={brandId} gameType={GameType.Slot} {...tab} />
      <GameTypePanel
        brandId={brandId}
        gameType={GameType.Sportsbook}
        dialog={dialog}
        {...tab}
      />
      <GameTypePanel
        brandId={brandId}
        gameType={GameType.VirtualSports}
        dialog={dialog}
        {...tab}
      />
      <GameTypePanel
        brandId={brandId}
        gameType={GameType.CardGame}
        dialog={dialog}
        {...tab}
      />
      <GameTypePanel
        brandId={brandId}
        gameType={GameType.Lottery}
        dialog={dialog}
        {...tab}
      />
    </Tabs>
  )
}

const GameTypeTab = ({ gameType, ...props }) => {
  let trans = GameTypeTrans[gameType]
  return (
    <Tab tabId={gameType} {...props}>
      <Trans {...trans} />
    </Tab>
  )
}

const GameTypePanel = ({ brandId, gameType, dialog, ...props }) => {
  let { selectedId } = props
  let isActive = selectedId === gameType

  return (
    <TabPanel tabId={gameType} {...props}>
      <Stack>
        {isActive && (
          <GameTypeSettingCard
            brandId={brandId}
            gameType={gameType}
            dialog={dialog}
          />
        )}
        <FieldStack orientation="horizontal">
          <ValidBetSettingDialogDisclosure
            brandId={brandId}
            gameType={gameType}
          />
          <WinLossSettingDialogDisclosure
            brandId={brandId}
            gameType={gameType}
          />
        </FieldStack>
      </Stack>
    </TabPanel>
  )
}

//TODO: readOnly?
const ValidBetSettingDialogDisclosure = ({ brandId, gameType, ...props }) => {
  let dialog = useModalState()

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="有效投注返佣设置" en="Valid Bet Rebate Setting" />
      </Disclosure>
      {dialog.visible && (
        <MultileLayerSettingDialog
          brandId={brandId}
          gameType={gameType}
          useFetch={useAllAgentValidBetCondition}
          useUpdate={useUpdateAllAgentValidBetCondition}
          dialog={dialog}
        />
      )}
    </>
  )
}

//TODO: readOnly?
const WinLossSettingDialogDisclosure = ({ brandId, gameType, ...props }) => {
  let dialog = useModalState()

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="玩家输赢返佣设置" en="Player Win Loss Rebate Setting" />
      </Disclosure>
      {dialog.visible && (
        <MultileLayerSettingDialog
          brandId={brandId}
          gameType={gameType}
          useFetch={useAllAgentWinLossCondition}
          useUpdate={useUpdateAllAgentWinLossCondition}
          dialog={dialog}
        />
      )}
    </>
  )
}

const MultileLayerSettingDialog = ({
  name,
  brandId,
  gameType,
  useFetch,
  useUpdate,
  dialog,
  ...props
}) => {
  let { isLoading, data, error, mutate, deleteCache } = useFetch(
    brandId,
    gameType
  )

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.close} />
  }

  return (
    <MultileLayerSettingFormDialog
      brandId={brandId}
      gameType={gameType}
      record={data}
      useUpdate={useUpdate}
      onSubmitted={() => {
        deleteCache()
        mutate(null, false)
      }}
      dialog={dialog}
    />
  )
}

const MultileLayerSettingFormDialog = ({
  brandId,
  gameType,
  record = {},
  useUpdate,
  onSubmitted,
  dialog,
  title,
  ...props
}) => {
  //TODO
  return (
    <FormDialog
      defaultValues={{
        brandId,
        ...clone(record)
      }}
      onSubmitted={onSubmitted}
      dialog={dialog}
    >
      TODO
    </FormDialog>
  )
}

const GameTypeSettingCard = ({ brandId, gameType, dialog }) => {
  let {
    isLoading: isLoadingAllAgent,
    data: allAgent,
    error: allAgentError,
    mutate,
    deleteCache
  } = useAllAgentSetting(brandId)

  const reset = () => {
    deleteCache()
    mutate(null, true)
  }

  if (isLoadingAllAgent) {
    return <Spinner />
  }

  if (allAgentError) {
    return <AlertDialog {...allAgentError} onClickClose={dialog.close} />
  }

  let record = allAgent?.brandAllAgentGameTypes?.find(
    ({ allAgentGameType }) => allAgentGameType === gameType
  )
  return (
    <GameTypeSettingFormCard
      brandId={brandId}
      record={record}
      onSubmitted={reset}
    />
  )
}

const GameTypeSettingFormCard = ({ brandId, record = {}, onSubmitted }) => {
  let formMethods = useForm({
    defaultValues: clone(record)
  })
  let { control, handleSubmit } = formMethods

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useUpdateAllAgentGameTypeSwitch(formData)

  const onSubmit = (data = {}) => {
    setSubmit({
      brandId,
      ...data
    })
  }

  const reset = () => {
    setSubmit(undefined)

    deleteCache()
    mutate(null, false)
  }

  useEffect(() => {
    if (!isLoading && result) {
      reset()
      onSubmitted?.()
    }
  }, [isLoading, reset])

  const SwitchFieldName = "switch"
  let switchValue = useWatch({
    control,
    name: SwitchFieldName
  })
  return (
    <Card>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldStack>
            <FieldStack orientation="horizontal">
              <SwitchField
                name={SwitchFieldName}
                label={<Trans zh="开关" en="Switch" />}
                switchLabel={
                  switchValue ? (
                    <Trans zh="开启" en="On" />
                  ) : (
                    <Trans zh="关闭" en="Off" />
                  )
                }
                disabled={isLoading}
              />
              <CheckboxField
                name="hasValidBet"
                label={<Trans zh="有效投注" en="Valid Bet" />}
                disabled={isLoading}
              />
              <CheckboxField
                name="hasWinLoss"
                label={<Trans zh="玩家输赢" en="Player Win Loss" />}
                disabled={isLoading}
              />
            </FieldStack>
            <SubmitButton isLoading={isLoading} disabled={isLoading} />
          </FieldStack>
        </form>
        {error && <AlertDialog {...error} onClickClose={reset} />}
      </FormProvider>
    </Card>
  )
}
