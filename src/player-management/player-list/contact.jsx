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

export const Key = "contact"

export const Tab = ({ ...props }) => {
  return (
    <_Tab tabId={Key} {...props}>
      <Trans zh="联系信息" en="Contact Info" />
    </_Tab>
  )
}

export const Panel = ({ player = {}, ...props }) => {
  let { phone, email, qq, weChat } = player
  return (
    <TabPanel tabId={Key} {...props}>
      <FieldValues spacing="major-2">
        <MobileLabel />
        <Text>
          {player.areaCode} <Text data-field="phone">{phone}</Text>
        </Text>

        <EmailLabel />
        <Text data-field="email">{email}</Text>

        <QQLabel />
        <Text>{qq}</Text>

        <WeChatLabel />
        <Text>{weChat}</Text>

        <TelegramLabel />
        <Text>{player?.telegram}</Text>

        <ViberLabel />
        <Text>{player?.viber}</Text>

        <MessengerLabel />
        <Text>{player?.facebookMessenger}</Text>

        <LineLabel />
        <Text>{player?.line}</Text>

        <WhatsappLabel />
        <Text>{player?.whatsApp}</Text>
      </FieldValues>
    </TabPanel>
  )
}

//TODO:1.39 > rm isDev()
export const EditPanel = (props) => {
  return isDev() ? (
    <UpdateContactPanel {...props} />
  ) : (
    <CurrentPlayerContactPanel {...props} />
  )
}

//TODO:1.40 rm CurrentPlayerContactPanel
const CurrentPlayerContactPanel = ({
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

    setSubmit(formData)
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
        <MobileLabel />
        <Box>
          <AreaPhoneInputGruop name="phone" />
        </Box>

        <EmailLabel />
        <Box>
          <EmailInput name="email" />
        </Box>

        <QQLabel />
        <Box>
          <Input name="qq" />
        </Box>

        <WeChatLabel />
        <Box>
          <Input name="weChat" />
        </Box>

        <TelegramLabel />
        <Box>
          <Input name="telegram" />
        </Box>

        <ViberLabel />
        <Box>
          <Input name="viber" />
        </Box>

        <MessengerLabel />
        <Box>
          <Input name="facebookMessenger" />
        </Box>

        <LineLabel />
        <Box>
          <Input name="line" />
        </Box>

        <WhatsappLabel />
        <Box>
          <Input name="whatsApp" />
        </Box>
      </FieldValues>
      <Box alignX="right">
        <SubmitCancel onClickCancel={onClickClose} />
      </Box>
    </Stack>
  )
}

export const MobileLabel = () => <Trans zh="手机号码" en="Mobile" />

export const EmailLabel = () => <Trans zh="邮箱" en="Email" />

export const QQLabel = () => <Trans zh="QQ" en="QQ" />

export const WeChatLabel = () => <Trans zh="微信号" en="WeChat" />

export const TelegramLabel = () => <Trans zh="Telegram" en="Telegram" />

export const ViberLabel = () => <Trans zh="Viber" en="Viber" />

export const MessengerLabel = () => <Trans zh="Messenger" en="Messenger" />

export const LineLabel = () => <Trans zh="Line" en="Line" />

export const WhatsappLabel = () => <Trans zh="Whatsapp" en="Whatsapp" />
