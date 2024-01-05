import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { useEditPlayerContact, useUpdatePlayerContact } from "./client"
import { FormProvider, useForm } from "react-hook-form"
import {
  Spinner,
  Stack,
  Flex,
  Box,
  Card,
  Set,
  Button,
  Text,
  Label,
  useClassName
} from "bumbag"
import { FieldValues } from "../../layout/Grid"
import { Trans, useTrans } from "../../i18n"
import AlertDialog from "../../dialog/Alert"
import { SubmitCancel } from "../../button/ActionButtons"
import { Tab as _Tab, TabPanel } from "../../tab"
import Input from "../../input/Input"
import EmailInput from "../../input/EmailInput"
import { AreaPhoneInputGruop } from "../../input/PhoneInput"
import clone from "clone-deep"
import { Contact } from "./menu"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { diff } from "../../object/diff"
import { isDev } from "../../env"
import {
  ContactInfoTrans,
  EmailTrans,
  PhoneTrans,
  TelegramTrans
} from "../../trans/User"

export const Key = "contact"

export const Tab = ({ ...props }) => {
  return (
    <_Tab tabId={Key} {...props}>
      <ContactInfoTrans />
    </_Tab>
  )
}

const ZaloTrans = () => <Trans zh="Zalo" en="Zalo" />

export const Panel = ({ player = {}, ...props }) => {
  console.log("player?.properties?.Zalo", player?.properties?.Zalo)
  return (
    <TabPanel tabId={Key} {...props}>
      <FieldValues spacing="major-2">
        <PhoneTrans />
        <Text>
          {player?.properties?.AreaCode}
          <Text data-field="phone">{player?.properties?.Phone}</Text>
        </Text>

        <EmailTrans />
        <Text data-field="email">{player?.properties?.Email}</Text>

        <QQLabel />
        <Text>{player?.properties?.Qq}</Text>

        <WeChatLabel />
        <Text>{player?.properties?.Wechat}</Text>

        <TelegramTrans />
        <Text>{player?.properties?.Telegram}</Text>

        <ViberLabel />
        <Text>{player?.properties?.Viber}</Text>

        <MessengerLabel />
        <Text>{player?.properties?.FacebookMessenger}</Text>

        <LineLabel />
        <Text>{player?.properties?.Line}</Text>

        <WhatsappLabel />
        <Text>{player?.properties?.WhatsApp}</Text>

        <ZaloTrans />
        <Text>{player?.properties?.Zalo}</Text>
      </FieldValues>
    </TabPanel>
  )
}

export const EditPanel = (props) => {
  return <UpdateContactPanel {...props} />
}

//TODO:1.40 rm OldPlayerContactPanel
const OldPlayerContactPanel = ({
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
  let { result, error, mutate, clearCache } = useEditPlayerContact(
    playerCode,
    submitData
  )
  useEffect(() => {
    if (result && !error) {
      onSubmitted && onSubmitted()
    }
  }, [result])

  const onSubmit = setSubmit

  const reset = () => {
    clearCache()
    setSubmit(null)
  }

  return (
    <TabPanel tabId={Key} {...props}>
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          <Body onClickClose={onClickClose} />
        </form>
      </FormProvider>
      {error && <AlertDialog {...error} onClickClose={reset} />}
    </TabPanel>
  )
}

const UpdateContactPanel = ({
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
  let { result, error, mutate, clearCache } = useUpdatePlayerContact(
    playerCode,
    submitData
  )
  useEffect(() => {
    if (result && !error) {
      onSubmitted && onSubmitted()
    }
  }, [result])

  const onSubmit = (data) => {
    let formData = diff(data, player)

    let { properties, ...restFormData } = formData

    setSubmit({
      ...restFormData,
      ...properties
    })
  }

  const reset = () => {
    clearCache()
    setSubmit(null)
  }

  return (
    <TabPanel tabId={Key} {...props}>
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          <Body onClickClose={onClickClose} />
        </form>
      </FormProvider>
      {error && <AlertDialog {...error} onClickClose={reset} />}
    </TabPanel>
  )
}

const Body = ({ onClickClose }) => {
  return (
    <Stack spacing="major-1" margin="major-1">
      <FieldValues>
        <PhoneTrans />
        <Box>
          <AreaPhoneInputGruop name="properties.Phone" />
        </Box>

        <EmailTrans />
        <Box>
          <EmailInput name="properties.Email" />
        </Box>

        <QQLabel />
        <Box>
          <Input name="properties.Qq" />
        </Box>

        <WeChatLabel />
        <Box>
          <Input name="properties.Wechat" />
        </Box>

        <TelegramTrans />
        <Box>
          <Input name="properties.Telegram" />
        </Box>

        <ViberLabel />
        <Box>
          <Input name="properties.Viber" />
        </Box>

        <MessengerLabel />
        <Box>
          <Input name="properties.FacebookMessenger" />
        </Box>

        <LineLabel />
        <Box>
          <Input name="properties.Line" />
        </Box>

        <WhatsappLabel />
        <Box>
          <Input name="properties.WhatsApp" />
        </Box>

        <ZaloTrans />
        <Box>
          <Input name="properties.Zalo" />
        </Box>
      </FieldValues>
      <Box alignX="right">
        <SubmitCancel onClickCancel={onClickClose} />
      </Box>
    </Stack>
  )
}

export const QQLabel = () => <Trans zh="QQ" en="QQ" />

export const WeChatLabel = () => <Trans zh="微信号" en="WeChat" />

export const ViberLabel = () => <Trans zh="Viber" en="Viber" />

export const MessengerLabel = () => <Trans zh="Messenger" en="Messenger" />

export const LineLabel = () => <Trans zh="Line" en="Line" />

export const WhatsappLabel = () => <Trans zh="Whatsapp" en="Whatsapp" />
