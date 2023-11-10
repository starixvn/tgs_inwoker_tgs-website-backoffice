import React, { useState, useEffect, useMemo, useRef } from "react"
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
  Label,
  Input,
  Checkbox,
  FieldStack,
  FieldWrapper,
  SelectField,
  Tabs as _Tabs,
  Dialog,
  Modal,
  Table,
  useClassName
} from "bumbag"
import { FieldValues } from "../../layout/Grid"
import AlertDialog from "../../dialog/Alert"
import { Trans, FormattedDateTime, FormattedNumber } from "../../i18n"
import { useEditPlayerPassword, useUpdatePlayerPassword } from "./client"
import { SubmitCancel } from "../../button/ActionButtons"
import { Tab as _Tab, TabPanel } from "../../tab"
import { PasswordInputField } from "../../input/PasswordInput"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import { isDev } from "../../env"

export const Key = "password"

export const Tab = (props = {}) => {
  return (
    <_Tab tabId={Key} {...props}>
      <Trans zh="修改密码" en="Update Password" />
    </_Tab>
  )
}

//TODO: replace CurrentUpdatePasswordPanel with UpdatePasswordPanel for 1.39
export const Panel = (props) => {
  return isDev() ? (
    <UpdatePasswordPanel {...props} />
  ) : (
    <CurrentUpdatePasswordPanel {...props} />
  )
}

const UpdatePasswordPanel = ({
  playerCode = "",
  onSubmitted,
  onClickClose,
  ...props
}) => {
  let formMethods = useForm()

  let [submitData, setSubmit] = useState()

  let { result, error, isLoading, mutate, deleteCache } =
    useUpdatePlayerPassword(playerCode, submitData)
  useEffect(() => {
    if (result) {
      onSubmitted?.()
    }
  }, [result])

  const onSubmit = (data) => {
    setSubmit(data?.password)
  }

  const reset = () => {
    deleteCache()
    setSubmit(undefined)
  }

  return (
    <TabPanel tabId={Key} {...props}>
      {error && <AlertDialog {...error} onClickClose={reset} />}
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          <Body isLoading={isLoading} onClickClose={onClickClose} />
        </form>
      </FormProvider>
    </TabPanel>
  )
}

const CurrentUpdatePasswordPanel = ({
  playerCode = "",
  onSubmitted,
  onClickClose,
  ...props
}) => {
  let formMethods = useForm()

  let [submitData, setSubmit] = useState()

  let { result, error, isLoading, mutate, deleteCache } = useEditPlayerPassword(
    playerCode,
    submitData
  )
  useEffect(() => {
    if (result) {
      onSubmitted?.()
    }
  }, [result])

  const onSubmit = (data) => {
    setSubmit(data)
  }

  const reset = () => {
    deleteCache()
    setSubmit(undefined)
  }

  return (
    <TabPanel tabId={Key} {...props}>
      {error && <AlertDialog {...error} onClickClose={reset} />}
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          <Body isLoading={isLoading} onClickClose={onClickClose} />
        </form>
      </FormProvider>
    </TabPanel>
  )
}

const Body = ({ isLoading, onClickClose, ...props }) => {
  let { watch } = useFormContext()
  let password = watch("password")
  return (
    <Stack spacing="major-1" margin="major-1">
      <FieldValues>
        <NewPasswordLabel />
        <Box>
          <PasswordInputField name="password" />
        </Box>

        <ConfirmPasswordLabel />
        <Box>
          <PasswordInputField name="confirmPassword" matchPassword={password} />
        </Box>
      </FieldValues>
      <Box alignX="right">
        <SubmitCancel isLoading={isLoading} onClickCancel={onClickClose} />
      </Box>
    </Stack>
  )
}

const NewPasswordLabel = () => <Trans zh="新密码" en="New password" />

const ConfirmPasswordLabel = () => (
  <Trans zh="确认新密码" en="Confirm password" />
)
