import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  useModalState,
  Stack,
  FieldStack,
  Card,
  Set,
  Table,
  Button,
  DropdownMenu,
  Icon,
  Box,
  Alert,
  Group,
  Text,
  Link
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Update, View } from "./menu"
import Disclosure from "../../dialog/Disclosure"
import { Trans, useTrans } from "../../i18n"
import FormDialog from "../../form/FormDialog"
import { FieldValues } from "../../layout/Grid"
import Label from "../../form/Label"
import Input from "../../input/Input"
import Textarea from "../../textarea"
import Checkbox from "../../checkbox"
import { RemarkTrans } from "../../trans/Action"

export const TopUpDialogDisclosure = ({ brandId }) => {
  let dialog = useModalState()

  let hasAuth = useIsDisplayMenuByRoute([Update])
  if (!hasAuth) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog}>
        <Trans zh="加值" en="Top-up" />
      </Disclosure>
      {dialog.visible && <TopUpDialog brandId={brandId} dialog={dialog} />}
    </>
  )
}

const TopUpDialog = ({ brandId, dialog }) => {
  let title = useTrans({
    zh: "加值",
    en: "Top-up"
  })

  //TODO: defaultValues
  return (
    <FormDialog defaultValues={{}} dialog={dialog} title={title}>
      <FormBody />
    </FormDialog>
  )
}

const AmountField = "amount"

const FormBody = ({}) => {
  //TODO: top up amount validation
  return (
    <FieldStack marginLeft="1rem">
      <FieldValues>
        <Box>
          <Trans zh="公司" en="Licensee" />
        </Box>
        <Box>TODO: Licensee</Box>

        <Box>
          <Trans zh="平台" en="Platform" />
        </Box>
        <Box>TODO: Platform</Box>

        <Box>
          <Trans zh="剩餘額度" en="Remaining Credits" />
        </Box>
        <Box>TODO: fake remainingCredits</Box>

        <Box>
          <Trans zh="平台額度" en="Total Credits" />
          <Text color="danger">*</Text>
        </Box>
        <Box>TODO: fake totalCredits</Box>

        <Box>
          <Trans zh="加值金額" en="Top-up Amount" />
        </Box>
        <Input name={AmountField} />

        <Box>
          <Trans zh="加值後剩餘額度" en="Remaining Credits" />
        </Box>
        <Box>TODO: calcRemainingCredits</Box>

        <Box>
          <Trans zh="加值後已用額度%" en="Usage P/T" />
        </Box>
        <Box>TODO: calcRemainingCreditsPercentage</Box>

        <Box>
          <Trans zh="已用額度%必須至少低於" en="Usage P/T must be lower than" />
        </Box>
        <Box>TODO: percentage</Box>

        <Box>
          <Trans zh="操作者" en="Issued By" />
        </Box>
        <Box>TODO: username</Box>

        <Box>
          <RemarkTrans />
        </Box>
        <Textarea name="reamrk" />
      </FieldValues>
      <Box>
        <ConfirmCheckbox />
      </Box>
    </FieldStack>
  )
}

//TODO: validation
const ConfirmCheckbox = ({ name = "confirm" }) => {
  return (
    <Checkbox
      name={name}
      label={
        <Trans
          zh="我確認有收到平台款項，將為平台添加額度。"
          en="I confirm that I have received payments from the platform and will be adding credits to the platform."
        />
      }
    />
  )
}
