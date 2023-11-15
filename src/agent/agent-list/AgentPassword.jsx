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
import { useAgent, useUpdateAgent, useUpdateAgentLoginPassword } from "./client"
import clone from "clone-deep"
import { PasswordInputField } from "../../input/PasswordInput"
import { isDev } from "../../env"

const Key = "AgentPassword"

export const AgentPasswordTab = ({ ...props }) => {
  return (
    <_Tab tabId={Key} {...props}>
      <Trans zh="修改登入密码" en="Change Login Password" />
    </_Tab>
  )
}

//TODO:1.39: rm isDev(), use UpdateAgentLoginPasswordPanel
export const AgentPasswordPanel = (props) => {
  return isDev() ? (
    <UpdateAgentLoginPasswordPanel {...props} />
  ) : (
    <CurrentAgentLoginPasswordPanel {...props} />
  )
}

const UpdateAgentLoginPasswordPanel = ({
  record,
  onSubmitted,
  onClickClose,
  ...props
}) => {
  let agentId = record?.id
  let formMethods = useForm({
    defaultValues: {}
  })
  let { watch } = formMethods
  let password = watch("password")

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useUpdateAgentLoginPassword(agentId, formData)

  useEffect(() => {
    if (result) {
      onSubmitted?.()
    }
  }, [result])

  const onSubmit = ({ password }) => {
    setSubmit(password)
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
              <Trans zh="新密码" en="New password" />
              <Box>
                <PasswordInputField name="password" />
              </Box>

              <Trans zh="确认新密码" en="Confirm password" />
              <Box>
                <PasswordInputField
                  name="confirmPassword"
                  matchPassword={password}
                />
              </Box>
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

//TODO:1.40 > rm CurrentAgentLoginPasswordPanel
const CurrentAgentLoginPasswordPanel = ({
  record,
  onSubmitted,
  onClickClose,
  ...props
}) => {
  let agentId = record?.id
  let formMethods = useForm({
    defaultValues: clone(record)
  })
  let { watch } = formMethods
  let password = watch("password")

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } = useUpdateAgent(
    agentId,
    formData
  )

  useEffect(() => {
    if (result) {
      onSubmitted?.()
    }
  }, [result])

  const onSubmit = ({ password }) => {
    setSubmit({
      ...record,
      updateType: "password",
      password
    })
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
              <Trans zh="新密码" en="New password" />
              <Box>
                <PasswordInputField name="password" />
              </Box>

              <Trans zh="确认新密码" en="Confirm password" />
              <Box>
                <PasswordInputField
                  name="confirmPassword"
                  matchPassword={password}
                />
              </Box>
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
