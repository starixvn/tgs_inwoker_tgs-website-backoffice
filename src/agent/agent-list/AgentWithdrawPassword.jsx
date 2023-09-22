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
import { useAgent, useUpdateAgentWithdrawPassword } from "./client"
import clone from "clone-deep"
import { PasswordInputField } from "../../input/PasswordInput"

const Key = "AgentWithdrawPassword"

export const AgentWithdrawPasswordTab = ({ ...props }) => {
  return (
    <_Tab tabId={Key} {...props}>
      <Trans zh="修改提款密码" en="Change Withdrawal Password" />
    </_Tab>
  )
}

//TODO: add pay password test case
const PasswordFieldName = "payPassword"
export const AgentWithdrawPasswordPanel = ({
  agentId,
  onSubmitted,
  onClickClose,
  ...props
}) => {
  let formMethods = useForm({
    defaultValues: {
      agentId
    }
  })
  let { watch } = formMethods
  let password = watch(PasswordFieldName)

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useUpdateAgentWithdrawPassword(formData)

  useEffect(() => {
    if (result) {
      onSubmitted?.()
    }
  }, [result])

  const onSubmit = ({ payPassword }) => {
    setSubmit({
      agentId,
      payPassword
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
              <Trans zh="新提款密码" en="New Withdrawal Password" />
              <Box>
                <PasswordInputField
                  name={PasswordFieldName}
                  minLength={6}
                  maxLength={20}
                  atLeastOneAlphabet={false}
                  atLeastOneNumber={false}
                />
              </Box>

              <Trans zh="确认新提款密码" en="Confirm New Withdrawal Password" />
              <Box>
                <PasswordInputField
                  name="confirmPassword"
                  matchPassword={password}
                  minLength={6}
                  maxLength={20}
                  atLeastOneAlphabet={false}
                  atLeastOneNumber={false}
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
