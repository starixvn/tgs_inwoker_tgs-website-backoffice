import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import {
  Heading,
  Stack,
  Box,
  Button,
  Set,
  Level,
  Text,
  Link,
  FieldStack,
  Alert,
  List,
  Icon,
  Breadcrumb
} from "bumbag"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import {
  FormattedNumber,
  Trans,
  useTrans,
  FormattedNumberDecimal,
  useLangCode
} from "../../i18n"
import SearchButton from "../../button/SearchButton"
import equals from "fast-deep-equal"
import { InputField } from "../../input/Input"
import { DateInputRange } from "../../date/DateTimeRangeInput"
import { today, yesterday } from "../../date/range"
import { startOfNextDay } from "../../date/startOfNextDay"
import numberColumn, {
  numberDecimalColumn,
  numberDecimalPercentageColumn
} from "../../table/column/numberColumn"
import { startOfToday, subDays } from "date-fns"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import {
  useWinlossReportPath,
  useWinlossReport,
  useExportWinlossReportUrl
} from "./client"
import { isDev } from "../../env"
import { urlWith } from "../../client"
import DownloadButton from "../../button/DownloadButton"
import headOf from "../../list/head"
import { isLastIndex, last } from "../../list/last"
import {
  faAngleDown,
  faAngleRight,
  faCaretRight,
  faCaretDown,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons"
import AutoSizer from "react-virtualized-auto-sizer"
import { Code as PageCode } from "./menu"
import { Code as ModuleCode } from "../menu"
import { useTableColumnHiddenLocalStorage } from "../../table/ActionBar"
import { TypeInputGroup } from "./TypeInputGroup"
import { TypeLabel, Type, isPlayer } from "./Type"
import { useColumns as usePlayerOrderColumns } from "../order-report/index"
import { PlayerSpecialDialogDisclosure } from "./PlayerSpecial"
import { AgentTotalDialogDisclosure } from "./AgentTotal"
import { CompanyTotalDialogDisclosure } from "./CompanyTotal"
import { isNil, isEmpty, either } from "ramda"
import { isArray } from "lodash-es"
import { useMeasure } from "react-use"
import { useResellerPageContentWidth } from "../../page/ResellerPageContent"

let isNilOrEmpty = either(isNil, isEmpty)

const MainTable = "main"
const TableLocalStorageKey = `${ModuleCode}:${PageCode}:${MainTable}`

export const BalanceAdjustReport = ({ resellerId }) => {
  //TODO:
  // 1. page layout
  // 2. useBalanceAdjustReportList > fake data
  // 3. columns & table
  // 4. dialogs
}
