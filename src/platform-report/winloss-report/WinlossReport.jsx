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
import { UserTypeLabel } from "./UserType"

const MainTable = "main"
const TableLocalStorageKey = `${ModuleCode}:${PageCode}:${MainTable}`

export const WinlossReport = ({ brandId }) => {
  //TODO: append tree path and
  // { type: Agent | Player, name, id }
  //TODO: rename to path?
  let [reportUsername, setReportUsername] = useState()
  let [downline, setDownline] = useState(false)
  let [treePaths, setTreePaths] = useState([])

  const resetPath = (path = []) => {
    setTreePaths(path)
  }

  //TODO: needed?
  const replacePath = (path = []) => {
    setTreePaths(path)
  }

  //TODO: when click on agent or player
  const appendTreePath = (node) => {
    setReportUsername(node.username)
    setDownline(true)

    setTreePaths((paths) => {
      return [...paths, node]
    })
  }

  //TODO click parent
  const backToTreePath = (node) => {
    setReportUsername(node.username)
    setDownline(true)
    let index = treePaths.findIndex((item) => item.username === node.username)

    let isLast = isLastIndex(index, treePaths)
    if (isLast) {
      return //skip
    }

    if (index >= 0) {
      setTreePaths((paths) => {
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
    /*
    brandId,
    */
    username: "",
    from: dateRange.start,
    to: dateRange.end
    /*
    type: "",
    orderId: null
    hiddenColumns
    */
  })

  /*
  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])
  */

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
    isLoading: isLoadingPath,
    data: pathData,
    error: pathError,
    mutate: mutatePath,
    deleteCache: deletePathCache
  } = useWinlossReportTreePath(toSearchParams())

  useEffect(() => {
    resetPath(pathData?.items)
  }, [JSON.stringify(pathData?.items)])

  const toReportSearchParams = () => {
    let result = {
      ...toApiParams(state),
      username: reportUsername ?? state?.username,
      downline
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

  console.log("reportData", reportData)
  let isLoading = isLoadingPath || isLoadingReportData
  //TODO: useEffect > update when user click search btn

  //TODO: useColumns
  let columns = useColumns({
    items: reportData?.items,
    appendTreePath
  })
  return (
    <Set orientation="vertical" isFilled height="100%">
      <Level alignY="bottom" alignX="left" verticalBelow="mobile">
        <SearchBar
          // brandId={brandId}
          username={state?.username}
          type={state?.type}
          from={state?.from}
          to={state?.to}
          search={(data = {}) => {
            setReportUsername(undefined)
            setDownline(false)
            resetPath()

            setState({
              pageIndex: 0,
              ...data
            })
            // deleteCache()
            // mutate(null)
          }}
        />
      </Level>
      <Heading>Breadcrumb params</Heading>
      <Box>{JSON.stringify(toSearchParams())}</Box>
      <Heading>Report params</Heading>
      <Box>{JSON.stringify(toReportSearchParams())}</Box>
      <UserBreadcrumb treePaths={treePaths} backToTreePath={backToTreePath} />
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

//TODO: set type = Agent as default?
const SearchBar = ({ username, type, from, to, search, isLoading }) => {
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

const useColumns = ({ items = [], appendTreePath }) => {
  return useMemo(() => {
    let columns = [
      textColumn({
        id: "username",
        accessor: (row) => row,
        Header: <Trans zh="用户名" en="Username" />,
        /*
        headCell: {
          whiteSpace: "nowrap"
        },
        */
        disableSortBy: true,
        Cell: ({ value: record }) => {
          return (
            <Link.Block
              onClick={() => {
                appendTreePath(record)
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
