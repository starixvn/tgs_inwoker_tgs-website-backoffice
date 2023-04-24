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
  FormattedNumberDecimal,
  useLangCode
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
import { useWinlossReportPath, useWinlossReport } from "./client"
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
import { UsernameInputGroup } from "./UsernameInputGroup"
import { UserTypeLabel, UserType } from "./UserType"
import { useColumns as usePlayerOrderColumns } from "../order-report/index"

const MainTable = "main"
const TableLocalStorageKey = `${ModuleCode}:${PageCode}:${MainTable}`

export const WinlossReport = ({ brandId }) => {
  let [path, setPath] = useState([])
  let [downline, setDownline] = useState(false)

  let [reportUsername, setReportUsername] = useState()
  let [reportUserType, setReportUserType] = useState()

  const resetPath = (path = []) => {
    setPath(path)
  }

  const appendPath = (node) => {
    setReportUsername(node.username)
    setReportUserType(node.type)
    setDownline(true)

    setPath((paths) => {
      return [...paths, node]
    })
  }

  const backToPath = (node) => {
    setReportUsername(node.username)
    setReportUserType(node.type)
    setDownline(true)
    let index = path.findIndex((item) => item.username === node.username)

    let isLast = isLastIndex(index, path)
    if (isLast) {
      return //skip
    }

    if (index >= 0) {
      setPath((paths) => {
        let result = paths.slice(0, index + 1)
        return result
      })
    }
  }

  let dateRange = yesterday()

  let [hiddenColumns] = useTableColumnHiddenLocalStorage(
    TableLocalStorageKey,
    []
  )

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId,
    username: "",
    from: dateRange.start,
    to: dateRange.end
    /*
    type: "",
    roundId: null
    hiddenColumns
    */
  })

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  let { pageSize, from, to } = state

  //TODO for download api params
  const toPathSearchParams = () => ({
    ...toApiParams(state)
    /*
    sortby: "username",
    from,
    to: startOfNextDay(to)
    */
  })

  let {
    isLoading: isLoadingPathData,
    data: pathData,
    error: pathDataError,
    mutate: mutatePathData,
    deleteCache: deletePathDataCache
  } = useWinlossReportPath(toPathSearchParams())

  useEffect(() => {
    resetPath(pathData?.items)
  }, [JSON.stringify(pathData?.items)])

  let culture = useLangCode()
  //TODO: need diff sort/order param for user/order data type?
  const toReportSearchParams = () => {
    let result = {
      ...toApiParams(state),
      username: reportUsername ?? state?.username,
      type: reportUserType ?? state?.type,
      downline,
      culture
      /*
    sortby: "username",
    from,
    to: startOfNextDay(to)
    */
    }
    return result
  }

  let {
    isLoading: isLoadingReportData,
    data: reportData,
    error: reportDataError,
    mutate: mutateReportData,
    deleteCache: deleteReportDataCache
  } = useWinlossReport(toReportSearchParams())

  let isLoading = isLoadingPathData || isLoadingReportData
  let error = pathDataError || reportDataError

  const reset = () => {
    deletePathDataCache()
    mutatePathData(null, false)

    deleteReportDataCache()
    mutateReportData(null, false)
  }

  let columns = useColumns({
    items: reportData?.items,
    path,
    appendPath
  })
  return (
    <Set orientation="vertical" isFilled height="100%" spacing="major-2">
      <Level alignY="bottom" alignX="left" verticalBelow="mobile">
        <SearchBar
          brandId={brandId}
          username={state?.username}
          type={state?.type}
          from={state?.from}
          to={state?.to}
          search={(data = {}) => {
            reset()

            setReportUsername(undefined)
            setReportUserType(undefined)
            setDownline(false)
            resetPath()

            setState({
              pageIndex: 0,
              ...data
            })
          }}
        />
      </Level>
      {/* 
      TODO: rm debug info code
      <Heading>Breadcrumb params</Heading>
      <Box>{JSON.stringify(toPathSearchParams())}</Box>
      <Heading>Report params</Heading>
      <Box>{JSON.stringify(toReportSearchParams())}</Box> 
      */}
      <UserBreadcrumb treePaths={path} backToTreePath={backToPath} />
      <AutoSizer>
        {({ height, width }) => {
          return (
            <Table
              columns={columns}
              data={reportData?.items}
              initialState={state}
              controlledState={state}
              pageCount={pageCount(pageSize, reportData?.totalCount)}
              setPageIndex={setPageIndex}
              setSortOrder={setSortOrder}
              isLoading={isLoading}
              maxSize={{ height, width }}
            />
          )
        }}
      </AutoSizer>
      {error && <AlertDialog {...error} onClickClose={reset} />}
    </Set>
  )
}

const UserBreadcrumb = ({ treePaths = [], backToTreePath }) => {
  if (treePaths.length === 0) {
    return null
  }

  return (
    <Breadcrumb
      separator={
        <Icon icon={faChevronRight} type="font-awesome" color="gray" />
      }
    >
      {treePaths.map((user, index, list) => {
        let isCurrent = isLastIndex(index, list)
        return (
          <Breadcrumb.Item isCurrent={isCurrent} key={user?.id ?? index}>
            <Breadcrumb.Link
              onClick={(event) => {
                if (!isCurrent) {
                  backToTreePath(user)
                }
              }}
            >
              {user?.username}
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        )
      })}
    </Breadcrumb>
  )
}

const SearchBar = ({
  username,
  type = UserType.Agent,
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
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
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
      </form>
    </FormProvider>
  )
}

const useUserColumns = ({ items = [], appendPath }) => {
  return useMemo(() => {
    let columns = [
      textColumn({
        id: "username",
        accessor: (row) => row,
        Header: <Trans zh="用户名" en="Username" />,
        disableSortBy: true,
        Cell: ({ value: record }) => {
          return (
            <Link.Block
              onClick={() => {
                appendPath(record)
              }}
            >
              {record.username}
            </Link.Block>
          )
        }
      }),
      textColumn({
        accessor: "type",
        Header: <Trans zh="类型" en="Type" />,
        disableSortBy: true,
        Cell: UserTypeLabel
      })
    ]
    return columns
  }, [JSON.stringify(items)])
}

const useColumns = ({ path = [], ...props }) => {
  let isPlayerOrderData = last(path)?.type === UserType.Player

  return isPlayerOrderData
    ? usePlayerOrderColumns(props)
    : useUserColumns(props)
}
