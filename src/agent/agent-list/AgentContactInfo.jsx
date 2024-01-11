import React, { useState, useEffect, useMemo, useRef, useContext } from "react"
import { css, Global } from "@emotion/react"
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
import { Trans, FormattedDateTime, FormattedNumber, useTrans } from "../../i18n"
import AlertDialog from "../../dialog/Alert"
import { SubmitCancel } from "../../button/ActionButtons"
import { Tab as _Tab, TabPanel } from "../../tab"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import Input from "../../input/Input"
import { useUpdateAgent, useUpdateAgentContact } from "./client"
import clone from "clone-deep"
import { isDev } from "../../env"
import { diff } from "../../object/diff"
import { ContactInfoTrans, EmailTrans, PhoneTrans } from "../../trans/User"

const Key = "AgentContactInfo"

export const AgentContactInfoTab = ({ ...props }) => {
  return (
    <_Tab tabId={Key} {...props}>
      <ContactInfoTrans />
    </_Tab>
  )
}

export const AgentContactInfoPanel = ({ readonly = false, ...props }) =>
  readonly ? <ViewPanel {...props} /> : <EditPanel {...props} />

const EditPanel = (props) => {
  return <UpdateAgentContactPanel {...props} />
}

const UpdateAgentContactPanel = ({
  record,
  onSubmitted,
  onClickClose,
  ...props
}) => {
  let formMethods = useForm({
    defaultValues: {
      phone: record?.phone,
      email: record?.email,
      qq: record?.qq,
      wechat: record?.wechat
    }
  })

  let agentId = record?.id
  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } = useUpdateAgentContact(
    agentId,
    formData
  )

  useEffect(() => {
    if (result && !error) {
      onSubmitted && onSubmitted()
    }
  }, [result])

  const onSubmit = (data) => {
    setSubmit(diff(data, record))
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  return (
    <TabPanel tabId={Key} {...props}>
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          <Stack>
            <FieldValues>
              <MobileBox>
                <Input name="phone" />
              </MobileBox>

              <EmailBox>
                <Input name="email" />
              </EmailBox>

              <QqBox>
                <Input name="qq" />
              </QqBox>

              <WeChatBox>
                <Input name="wechat" />
              </WeChatBox>
            </FieldValues>
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

const ViewPanel = ({ record = {}, ...props }) => {
  return (
    <TabPanel tabId={Key} {...props}>
      <FieldValues spacing="major-2">
        <MobileBox value={record?.phone} />

        <EmailBox value={record?.email} />

        <QqBox value={record?.qq} />

        <WeChatBox value={record?.wechat} />
      </FieldValues>
    </TabPanel>
  )
}

const MobileBox = ({ value = "", children }) => {
  return (
    <>
      <Box alignY="center">
        <PhoneTrans />
      </Box>

      {children ? children : <Text data-field="phone">{value}</Text>}
    </>
  )
}

const EmailBox = ({ value = "", children }) => {
  return (
    <>
      <Box alignY="center">
        <EmailTrans />
      </Box>

      {children ? children : <Text data-field="email">{value}</Text>}
    </>
  )
}

export const QqLabel = () => <Trans zh="QQ" en="QQ" />

const QqBox = ({ value = "", children }) => {
  return (
    <>
      <Box alignY="center">
        <QqLabel />
      </Box>

      {children ? children : <Text>{value}</Text>}
    </>
  )
}

export const WeChatLabel = () => <Trans zh="微信号" en="WeChat" />

const WeChatBox = ({ value = "", children }) => {
  return (
    <>
      <Box alignY="center">
        <WeChatLabel />
      </Box>

      {children ? children : <Text>{value}</Text>}
    </>
  )
}
