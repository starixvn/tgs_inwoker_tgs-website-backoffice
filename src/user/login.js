import React, { useState } from "react"
import { css } from "@emotion/react"
import { useAuth, useIsAuthLoading } from "./context"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import {
  Flex,
  Box,
  Card,
  Set,
  Button,
  Dialog,
  Modal,
  Text,
  Heading,
  Image
} from "bumbag"
import Input from "../input/Input"
import { PasswordInputField } from "../input/PasswordInput"
import { LangDropdownMenu, useLocale, useTrans } from "../i18n"
import { CloseText } from "../button/ActionButtons"
import {
  getLoginButtonBackground,
  getLoginButtonColor,
  getLoginTitle,
  getLoginTitleColor,
  getLoginTitleFontSize,
  getLoginTitleFontWeight,
  getLoginSubTitle,
  getLoginSubTitleFontSize,
  getLoginImageUrl
} from "../env"

export const Path = "/login"

export const Form = () => {
  let formMethods = useForm({
    defaultValues: { username: "", password: "" }
  })

  const login = useAuth()
  let isAuthLoading = useIsAuthLoading()

  const dialog = Modal.useState()
  let [error, setError] = useState()

  const onSubmit = (data) => {
    setError(null)

    login(data).catch((error) => {
      setError(error.message ?? error.title)
      dialog.show()
    })
  }

  let loginLabel = useTrans({
    zh: "登录",
    en: "Login"
  })

  let usernameLabel = useTrans({
    zh: "帐号",
    en: "Username"
  })

  let passwordLabel = useTrans({
    zh: "密码",
    en: "Password"
  })

  let imgUrl = getLoginImageUrl()
  let title = getLoginTitle()
  let subTitle = getLoginSubTitle()
  return (
    <Box
      alignX="center"
      alignY="center"
      css={css`
        height: 80vh;
      `}
    >
      {imgUrl && (
        <Box aspectRatio="500/175" marginBottom="1rem" width="200px">
          <Image src={imgUrl} width="100%" filter="none" />
        </Box>
      )}
      {title && (
        <Box marginBottom="1rem" alignX="center">
          <Text.Block
            color={getLoginTitleColor()}
            fontSize={getLoginTitleFontSize()}
            fontWeight={getLoginTitleFontWeight()}
          >
            {title}
          </Text.Block>
          {subTitle && (
            <Text.Block
              color={getLoginTitleColor()}
              fontWeight={getLoginTitleFontWeight()}
              fontSize={getLoginSubTitleFontSize()}
            >
              {subTitle}
            </Text.Block>
          )}
        </Box>
      )}
      <Card
        title={loginLabel}
        headerAddon={
          <Set>
            <LangDropdownMenu />
          </Set>
        }
        css={css`
          width: 370px;
          @media screen and (max-width: 576px) {
            width: 95%;
          }
        `}
      >
        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)}>
            <Set orientation="vertical" isFilled>
              <Input
                name="username"
                placeholder={usernameLabel}
                autoComplete="username"
              />
              <PasswordInputField
                name="password"
                type="password"
                placeholder={passwordLabel}
                autoComplete="current-password"
              />
              <Button
                type="submit"
                color={getLoginButtonColor()}
                background={getLoginButtonBackground()}
                isLoading={isAuthLoading}
              >
                {loginLabel}
              </Button>
            </Set>
          </form>
        </FormProvider>
      </Card>
      <ErrorDialog error={error} dialog={dialog} />
    </Box>
  )
}

const ErrorDialog = ({ dialog, error, ...props }) => {
  return (
    <Dialog.Modal
      type="danger"
      variant="alert"
      title={error}
      placement="top"
      footer={
        <Flex
          alignX="right"
          css={css`
            width: 100%;
          `}
        >
          <Modal.Disclosure use={Button} {...dialog}>
            <CloseText />
          </Modal.Disclosure>
        </Flex>
      }
      {...dialog}
    ></Dialog.Modal>
  )
}
