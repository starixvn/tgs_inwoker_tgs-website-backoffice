import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { useUpdatePlayerContact } from "./client"
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
  LineTrans,
  MessengerTrans,
  PhoneTrans,
  QQTrans,
  TelegramTrans,
  ViberTrans,
  WeChatTrans,
  WhatsAppTrans,
  ZaloTrans
} from "../../trans/User"

export const Key = "contact"

export const Tab = ({ ...props }) => {
  return (
    <_Tab tabId={Key} {...props}>
      <ContactInfoTrans />
    </_Tab>
  )
}

export const Panel = ({ player = {}, ...props }) => {
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

        <QQTrans />
        <Text>{player?.properties?.Qq}</Text>

        <WeChatTrans />
        <Text>{player?.properties?.Wechat}</Text>

        <TelegramTrans />
        <Text>{player?.properties?.Telegram}</Text>

        <ViberTrans />
        <Text>{player?.properties?.Viber}</Text>

        <MessengerTrans />
        <Text>{player?.properties?.FacebookMessenger}</Text>

        <LineTrans />
        <Text>{player?.properties?.Line}</Text>

        <WhatsAppTrans />
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
  let { result, error, mutate, deleteCache } = useUpdatePlayerContact(
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

    let { properties } = formData

    setSubmit({
      ...properties
    })
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
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
          <AreaPhoneInputGruop
            name="properties.Phone"
            area={{ name: "properties.AreaCode" }}
          />
        </Box>

        <EmailTrans />
        <Box>
          <EmailInput name="properties.Email" />
        </Box>

        <QQTrans />
        <Box>
          <Input name="properties.Qq" />
        </Box>

        <WeChatTrans />
        <Box>
          <Input name="properties.Wechat" />
        </Box>

        <TelegramTrans />
        <Box>
          <Input name="properties.Telegram" />
        </Box>

        <ViberTrans />
        <Box>
          <Input name="properties.Viber" />
        </Box>

        <MessengerTrans />
        <Box>
          <Input name="properties.FacebookMessenger" />
        </Box>

        <LineTrans />
        <Box>
          <Input name="properties.Line" />
        </Box>

        <WhatsAppTrans />
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
