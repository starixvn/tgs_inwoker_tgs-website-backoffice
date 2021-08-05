import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  Stack,
  Heading,
  Box,
  Button,
  Text,
  Group,
  Set,
  Flex,
  FieldStack,
  useModalState,
  Dialog,
  Card,
  FieldWrapper,
  Columns,
  DropdownMenu
} from "bumbag"
import { AddDisclosure } from "../../dialog/Disclosure"
import { usePaymentMethodChannelList } from "../../payment/client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import { Table } from "../../table"
import textColumn from "../../table/column/textColumn"
import { PaymentProviderLabel } from "../../payment/PaymentProvider"
import { PaymentMethodLabel } from "../../payment/method/PaymentMethod"
import { PaymentChannelLabel } from "../../payment/channel/PaymentChannel"
import { Trans } from "../../i18n"

export const AddPaymentChannelDisclosure = ({ onSubmitted }) => {
  let dialog = useModalState()

  return (
    <>
      <AddDisclosure {...dialog} />
    </>
  )
}
