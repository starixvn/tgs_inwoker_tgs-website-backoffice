import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Box,
  Dialog,
  useModalState,
  Set,
  Level,
  Heading,
  Button,
  Flex,
  Text
} from "bumbag"
import { View, Update } from "./menu"
import { useIsDisplayMenuByRoute, useUserBrandId } from "../../user/context"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import { useAddAgent, useAgent, useUpdateAgent } from "./client"
import {
  Trans,
  FormattedDateTime,
  FormattedNumber,
  useTrans,
  FormattedNumberDecimal
} from "../../i18n"
import Disclosure, {
  AddDisclosure,
  EditDisclosure,
  ViewDisclosure
} from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import {
  CloseButtonFooter,
  ConfirmCancelFooter
} from "../../form/ConfirmButtonFooter"
import { FieldValues, TwoColumns } from "../../layout/Grid"
import { NormalLabel } from "../../form/Label"
import Input, { InputField } from "../../input/Input"
import { PasswordInputField } from "../../input/PasswordInput"
import { useFormContext, useWatch } from "react-hook-form"
import Textarea from "../../textarea"
import { AgentDividendPercentageInputField } from "../AgentOneLayerDividendPercentage"
import {
  AgentLiveDealerRebatePercentageInputField,
  AgentLiveDealerRebateText
} from "../AgentLiveDealerRebatePercentage"
import {
  AgentEgameRebatePercentageInputField,
  AgentEgameRebateText
} from "../AgentEgameRebatePercentage"
import {
  AgentCardGameRebatePercentageInputField,
  AgentCardGameRebateText
} from "../AgentCardGameRebatePercentage"
import {
  AgentLotteryRebatePercentageInputField,
  AgentLotteryRebateText
} from "../AgentLotteryRebatePercentage"
import {
  AgentSportsRebatePercentageInputField,
  AgentSportsRebateText
} from "../AgentSportsRebatePercentage"
import {
  AgentVirtualSportsRebatePercentageInputField,
  AgentVirtualSportsRebateText
} from "../AgentVirtualSportsRebatePercentage"
import clone from "clone-deep"
import { CreditAgentTypeSelect, isAgentParentRequired } from "./CreditAgentType"

export const AddCreditAgentDialogDisclosure = ({
  brandId,
  onSubmitted,
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([Update])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <AddDisclosure {...dialog} />
      {dialog.visible && (
        <AddDialog
          brandId={brandId}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

const AddDialog = ({ brandId, onSubmitted, dialog }) => {
  let title = useTrans({
    zh: "新增代理",
    en: "Add Agent"
  })

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useAddCreditAgent(formData)

  const onSubmit = (data) => {
    setSubmit({
      ...data,
      brandId
    })
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  return (
    <FormDialog
      defaultValues={{
        brandId
      }}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={onSubmitted}
      dialog={dialog}
      title={title}
      showActionButtons={false}
      footer={<ConfirmCancelFooter dialog={dialog} isLoading={isLoading} />}
      maxWidth="100vw"
      minWidth="60vw"
      placement="top"
    >
      <FormBody />
    </FormDialog>
  )
}

const FormBody = ({}) => {
  let { control } = useFormContext()

  const TypeFieldName = "type"
  const type = useWatch({
    control,
    name: TypeFieldName
  })
  let parentAgentRequired = isAgentParentRequired(type)

  const PasswordFieldName = "password"
  let password = useWatch({
    control,
    name: PasswordFieldName
  })

  return (
    <Set orientation="vertical" isFilled marginLeft="1rem">
      <Heading use="h5">
        <Trans zh="基本资料" en="Basic info" />
      </Heading>
      <Set orientation="vertical" marginLeft="1rem" marginRight="1rem" isFilled>
        <FieldValues>
          <NormalLabel required>
            <Trans zh="代理用户名" en="Username" />
          </NormalLabel>
          <Input name="username" required autoComplete="off" />

          <NormalLabel required>
            <Trans zh="登入密码" en="Password" />
          </NormalLabel>
          <PasswordInputField name={PasswordFieldName} />

          <NormalLabel required>
            <Trans zh="确认密码" en="Confirm password" />
          </NormalLabel>
          <PasswordInputField name="confirmPassword" matchPassword={password} />

          <NormalLabel>
            <Trans zh="代理种类" en="Agent Type" />
          </NormalLabel>
          <CreditAgentTypeSelect name={TypeFieldName} required />

          {parentAgentRequired && (
            <>
              <NormalLabel required>
                <Trans zh="上级用户名" en="Upper Level Username" />
              </NormalLabel>
              <InputField name="parentUsername" required />
            </>
          )}

          <NormalLabel required>
            <Trans zh="代理占成" en="Profit Sharing" />
          </NormalLabel>
          <AgentDividendPercentageInputField />

          <NormalLabel required>
            <AgentLiveDealerRebateText />
          </NormalLabel>
          <TwoColumns columns={["0.7fr"]}>
            <Flex flex="1 50%">
              <AgentLiveDealerRebatePercentageInputField width="100%" />
            </Flex>

            <FieldValues flex="1 50%">
              <NormalLabel required>
                <AgentLotteryRebateText />
              </NormalLabel>

              <AgentLotteryRebatePercentageInputField />
            </FieldValues>
          </TwoColumns>

          <NormalLabel required>
            <AgentEgameRebateText />
          </NormalLabel>
          <TwoColumns columns={["0.7fr"]}>
            <Flex flex="1 50%">
              <AgentEgameRebatePercentageInputField width="100%" />
            </Flex>

            <FieldValues>
              <NormalLabel required>
                <AgentSportsRebateText />
              </NormalLabel>

              <AgentSportsRebatePercentageInputField />
            </FieldValues>
          </TwoColumns>

          <NormalLabel required>
            <AgentCardGameRebateText />
          </NormalLabel>
          <TwoColumns columns={["0.7fr"]}>
            <Flex flex="1 50%">
              <AgentCardGameRebatePercentageInputField width="100%" />
            </Flex>

            <FieldValues>
              <NormalLabel required>
                <AgentVirtualSportsRebateText />
              </NormalLabel>

              <AgentVirtualSportsRebatePercentageInputField />
            </FieldValues>
          </TwoColumns>

          <NormalLabel required>
            <Trans zh="备注" en="Remarks" />
          </NormalLabel>
          <Textarea name="remarks" required />
        </FieldValues>
      </Set>
    </Set>
  )
}
