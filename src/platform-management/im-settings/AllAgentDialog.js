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
  useUpdateAllAgentGameTypeSwitch
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
        <AllAgentDialog brandId={brandId} readOnly={readOnly} dialog={dialog} />
      )}
    </>
  )
}

const AllAgentDialog = ({ brandId, readOnly, dialog, ...props }) => {
  //TODO: move this to each tab?
  let { isLoading, data, error, mutate, deleteCache } =
    useAllAgentSetting(brandId)

  const reset = () => {
    deleteCache()
    mutate(null)
  }

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.close} />
  }

  return (
    <AllAgentSettingDialog
      brandId={brandId}
      record={data}
      readOnly={readOnly}
      dialog={dialog}
      onSubmitted={reset}
      dialog={dialog}
      {...props}
    />
  )
}

//TODO: readOnly
const AllAgentSettingDialog = ({
  brandId,
  record,
  readOnly,
  onSubmitted,
  dialog
}) => {
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
      <DialogBody brandId={brandId} record={record} onSubmitted={onSubmitted} />
    </Dialog.Modal>
  )
}

//TODO: need to reload data when onChange? no need?
const DialogBody = ({ brandId, record = {}, onSubmitted }) => {
  //TODO
  let groupByGameType = record?.brandAllAgentGameTypes?.reduce(
    (record, gameTypeRecord) => {
      let { allAgentGameType } = gameTypeRecord
      Reflect.set(record, allAgentGameType, clone(gameTypeRecord))
      return record
    },
    {}
  )
  return (
    <Stack>
      <AllAgentMainSwitch
        brandId={brandId}
        defaultValue={record?.switch}
        onSubmitted={onSubmitted}
      />
      <AllAgentGameTypeTabs
        brandId={brandId}
        record={groupByGameType}
        onSubmitted={onSubmitted}
      />
    </Stack>
  )
}

const AllAgentMainSwitch = ({ brandId, defaultValue, onChange }) => {
  let [mainSwitch, setMainSwitch] = useState(defaultValue)

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

  //TODO: need to trigger load data from server?
  useEffect(() => {
    if (!isLoading && result) {
      setMainSwitch(formData.switch)
      reset()
    }
  }, [isLoading, result])

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <SwitchField
        label={<Trans zh="总开关" en="Main Switch" />}
        switchLabel={mainSwitch ? onLabel : offLabel}
        value={mainSwitch}
        onChange={(event) => {
          let checked = event.target.checked
          // setMainSwitch(checked)
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

const AllAgentGameTypeTabs = ({ brandId, record = {}, onSubmitted }) => {
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
        record={record[GameType.LiveDealer]}
        onSubmitted={onSubmitted}
        {...tab}
      />
      <GameTypePanel
        brandId={brandId}
        gameType={GameType.Slot}
        record={record[GameType.Slot]}
        onSubmitted={onSubmitted}
        {...tab}
      />
      <GameTypePanel
        brandId={brandId}
        gameType={GameType.Sportsbook}
        record={record[GameType.Sportsbook]}
        onSubmitted={onSubmitted}
        {...tab}
      />
      <GameTypePanel
        brandId={brandId}
        gameType={GameType.VirtualSports}
        record={record[GameType.VirtualSports]}
        onSubmitted={onSubmitted}
        {...tab}
      />
      <GameTypePanel
        brandId={brandId}
        gameType={GameType.CardGame}
        record={record[GameType.CardGame]}
        onSubmitted={onSubmitted}
        {...tab}
      />
      <GameTypePanel
        brandId={brandId}
        gameType={GameType.Lottery}
        record={record[GameType.Lottery]}
        onSubmitted={onSubmitted}
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

const GameTypePanel = ({
  brandId,
  gameType,
  record,
  onSubmitted,
  ...props
}) => {
  return (
    <TabPanel tabId={gameType} {...props}>
      <Stack>
        <GameTypeSettingCard
          brandId={brandId}
          gameType={gameType}
          record={record}
          onSubmitted={onSubmitted}
        />
      </Stack>
    </TabPanel>
  )
}

const GameTypeSettingCard = ({ brandId, gameType, record, onSubmitted }) => {
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
                label={<Trans zh="总开关" en="Main Switch" />}
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
