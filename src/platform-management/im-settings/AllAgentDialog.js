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
  FieldWrapper,
  SwitchField
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
import { useFormContext, useWatch } from "react-hook-form"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import { JsonEditor } from "../../text/editor/JsonEditor"
import { stringifyJSON } from "../../text/json"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import {
  useAllAgentSetting,
  useUpdateAllAgentSwitch
} from "../../agent/all-agent/client"
import { Tabs, Tab, TabList, TabPanel, useTabState } from "../../tab"

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
  let { isLoading, data, error, mutate, deleteCache } =
    useAllAgentSetting(brandId)

  const reset = () => {
    deleteCache()
    mutate(null, false)
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
      onChange={reset}
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
  onChange,
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
      <DialogBody brandId={brandId} record={record} onChange={onChange} />
    </Dialog.Modal>
  )
}

//TODO: need to reload data when onChange? no need?
const DialogBody = ({ brandId, record = {}, onChange }) => {
  return (
    <Stack>
      <AllAgentMainSwitch brandId={brandId} defaultValue={record?.switch} />
      <AllAgentGameTypeTabs />
    </Stack>
  )
}

const AllAgentMainSwitch = ({ brandId, defaultValue, onChange }) => {
  let [mainSwitch, setMainSwitch] = useState(defaultValue)

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useUpdateAllAgentSwitch(brandId, formData)

  let onLabel = useTrans({
    zh: "开启",
    en: "On"
  })

  let offLabel = useTrans({
    zh: "开启",
    en: "On"
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

const AllAgentGameTypeTabs = ({ record = {} }) => {
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

      <GameTypePanel gameType={GameType.LiveDealer} {...tab} />
      <GameTypePanel gameType={GameType.Slot} {...tab} />
      <GameTypePanel gameType={GameType.Sportsbook} {...tab} />
      <GameTypePanel gameType={GameType.VirtualSports} {...tab} />
      <GameTypePanel gameType={GameType.CardGame} {...tab} />
      <GameTypePanel gameType={GameType.Lottery} {...tab} />
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

const GameTypePanel = ({ gameType, ...props }) => {
  return (
    <TabPanel tabId={gameType} {...props}>
      {gameType}
    </TabPanel>
  )
}
