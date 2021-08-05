import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  Box,
  Button,
  Set,
  Flex,
  FieldStack,
  useModalState,
  Dialog
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { usePaymentList } from "../../payment/client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import { Table } from "../../table"
import textColumn from "../../table/column/textColumn"
import { View, Update } from "./menu"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import dateTimeColumn from "../../table/column/dateTime"

export const PaymentChannelListDialog = ({ dialog, onSubmitted }) => {
  let title = useTrans({
    zh: "支付方式列表",
    en: "Payment Channel List"
  })
}
