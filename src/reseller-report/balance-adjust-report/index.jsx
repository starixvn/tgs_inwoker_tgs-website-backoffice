import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { Heading, Stack, Box, Button, Set, Level, Alert, List } from "bumbag"
import PageContent from "../../page/Content"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { FormattedNumber, Trans, useLangCode, useTrans } from "../../i18n"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserLicenseeId,
  useUserResellerId
} from "../../user/context"
import { today, yesterday } from "../../date/range"
import { Code } from "./menu"
import BrandBar from "../../report/BrandBar"
import { startOfNextDay } from "../../date/startOfNextDay"
import numberColumn, {
  numberDecimalColumn
} from "../../table/column/numberColumn"
import AlertDialog from "../../dialog/Alert"
import { Reseller } from "../../merchant/resellers"
import { DateInputRange } from "../../date/DateTimeRangeInput"
import SearchButton from "../../button/SearchButton"
import { subDays, startOfToday } from "date-fns"
import { isDev } from "../../env"
import textColumn, { wrapTextColumn } from "../../table/column/textColumn"
import DownloadButton from "../../button/DownloadButton"
import { urlWith } from "../../client/index"
import Big from "big.js"
import { Code as PageCode } from "./menu"
import { Code as ModuleCode } from "../menu"
import { useTableColumnHiddenLocalStorage } from "../../table/ActionBar"
import { ResellerPageContent } from "../../page/ResellerPageContent"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return <Report />
}

export const CodeContentPair = [Code, Content]

const Report = () => {
  return (
    <ResellerPageContent
      title={<Trans zh="调帐报表" en="Balance Adjust Report" />}
    >
      <ReportBody />
    </ResellerPageContent>
  )
}

const ReportBody = () => {
  return ""
}
