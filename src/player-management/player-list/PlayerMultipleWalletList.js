import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Spinner, Stack, Flex, Box, Card, Set } from "bumbag"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import dateTimeColumn from "../../table/column/dateTime"
import { useOperations } from "./client"
import { Trans } from "../../i18n"
import { pastWeek } from "../../date/range"
import DateTimeRangeInput from "../../date/DateTimeRangeInput"
import SearchButton from "../../button/SearchButton"
import { Tab as _Tab, TabPanel } from "../../tab"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import textColumn from "../../table/column/textColumn"
import { Descending } from "../../table/order"
import AlertDialog from "../../dialog/Alert"

export const Key = "multiple-wallet"

export const PlayerMultipleWalletListTab = ({ ...props }) => {
  return (
    <_Tab tabId={Key} {...props}>
      <Trans zh="转帐钱包厂商余额" en="Balance at Multiple Wallet GP" />
    </_Tab>
  )
}

export const PlayerMultipleWalletListPanel = ({ playerCode, ...props }) => {
  let { selectedId } = props
  let isActive = selectedId === Key

  
  return (
    <TabPanel tabId={Key} {...props}>
      <Stack spacing="major-2">
        
      </Stack>
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </TabPanel>
  )
}
