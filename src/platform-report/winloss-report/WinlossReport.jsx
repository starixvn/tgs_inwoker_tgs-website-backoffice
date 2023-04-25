import React, { useState, useEffect, useMemo } from "react"
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
  FormattedNumberDecimal
} from "../../i18n"
import SearchButton from "../../button/SearchButton"
import equals from "fast-deep-equal"
import { InputField } from "../../input/Input"
import { DateInputRange } from "../../date/DateTimeRangeInput"
import { today, yesterday } from "../../date/range"
import { startOfNextDay } from "../../date/startOfNextDay"
import {
  numberDecimalColumn,
  numberDecimalPercentageColumn
} from "../../table/column/numberColumn"
import { startOfToday, subDays } from "date-fns"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { useWinlossReportTreePath, useWinlossReport } from "./client"
import { AgentTypeSelect } from "../../agent/AgentType"
import { isDev } from "../../env"
import { urlWith } from "../../client"
import DownloadButton from "../../button/DownloadButton"
import { BonusDialogDisclosure } from "../BonusDialog"
import headOf from "../../list/head"
import lastOf, { isLastIndex } from "../../list/last"
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
import { UsernameInputGroup } from "./UsernameInputGroup"

const MainTable = "main"
const TableLocalStorageKey = `${ModuleCode}:${PageCode}:${MainTable}`

export const WinlossReport = ({ brandId }) => {
  //TODO: append tree path and
  // { type: Agent | Player, name, id }
  let [treePaths, setTreePaths] = useState([])

  //TODO: when click on agent or player
  const appendTreePath = (node) => {
    setTreePaths((paths) => {
      return [...paths, node]
    })
  }

  //TODO click parent
  const backToTreePath = (node) => {}

  let dateRange = yesterday()

  let [hiddenColumns] = useTableColumnHiddenLocalStorage(
    TableLocalStorageKey,
    []
  )

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId,
    username: "",
    type: "",
    from: dateRange.start,
    to: dateRange.end,
    orderId: null
    /*
    hiddenColumns
    */
  })

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  let { pageSize, from, to } = state
  //TODO for download api params
  const toSearchParams = () => ({
    ...toApiParams(state)
    /*
    sortby: "username",
    from,
    to: startOfNextDay(to)
    */
  })

  let {
    isLoading: isLoadingTreePath,
    data: treePathData,
    error: winlossTreePathError,
    mutate: mutateWinlossTreePath,
    deleteCache: deleteWinlossTreePathCache
  } = useWinlossReportTreePath()
  let { isLoading: isLoadingWinlossReport } = useWinlossReport()

  //TODO: useEffect > update when user click search btn

  console.log("treePathData", treePathData)
  //TODO: useColumns
  return (
    <Set orientation="vertical" isFilled height="100%">
      <Level alignY="bottom" alignX="left" verticalBelow="mobile">
        <SearchBar />
      </Level>
    </Set>
  )
}

//TODO: set type = Agent as default?
const SearchBar = ({
  brandId,
  username,
  type,
  from,
  to,
  search,
  isLoading
}) => {
  let formMethods = useForm({
    defaultValues: {
      username,
      type,
      from,
      to
    }
  })

  let roundIdPlaceholder = useTrans({
    zh: "订单ID",
    en: "Round ID"
  })

  const onSubmit = (data) => search?.(data)

  let QueryMaxRangeDays = 31
  let todayRange = today()
  let DataRetentionDays = 180
  let minDate = subDays(todayRange.start, DataRetentionDays)
  let maxDate = todayRange.end

  return (
    <FormProvider {...formMethods}>
      <Set>
        <DateInputRange
          showDateDropdownMenu
          maxRangeDays={QueryMaxRangeDays}
          minDate={minDate}
          maxDate={maxDate}
          startProps={{
            name: "from"
          }}
          endProps={{
            name: "to"
          }}
          dateDropdownMenuProps={{
            thisWeekProps: {
              end: maxDate
            },
            thisMonthProps: {
              end: maxDate
            }
          }}
          fakeTimeLabel
          required
        />
        <UsernameInputGroup />
        <InputField
          name="roundId"
          showEmptyFieldValueAddonAfter
          placeholder={roundIdPlaceholder}
        />
        <SearchButton isLoading={isLoading} disabled={isLoading} />
      </Set>
    </FormProvider>
  )
}
