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
import numberColumn, {
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
import { MemberTypeLabel, MemberType, isPlayerMemberType } from "./MemberType"
import { useColumns as usePlayerOrderColumns } from "../order-report/index"
import { PlayerSpecialDialogDisclosure } from "./PlayerSpecial"
import { AgentTotalDialogDisclosure } from "./AgentTotal"
import { CompanyTotalDialogDisclosure } from "./CompanyTotal"

const MainTable = "main"
const TableLocalStorageKey = `${ModuleCode}:${PageCode}:${MainTable}`

export const WinlossReport = ({ brandId }) => {
  let [path, setPath] = useState([])

  let [searchParams, setSearchParams] = useState({
    brandId,
    username: "",
    memberType: MemberType.Agent,
    roundId: ""
  })

  let [hiddenColumns] = useTableColumnHiddenLocalStorage(
    TableLocalStorageKey,
    []
  )

  let dateRange = yesterday()
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId,
    from: dateRange.start,
    to: dateRange.end,
    downline: false
    /*
    TODO: here?
    roundId: null
    */
  })

  const resetPath = (path = []) => {
    setPath(path)
  }

  const appendPath = (node = {}) => {
    setState({
      username: node.username,
      memberType: node.memberType,
      downline: true
    })

    setPath((paths) => {
      return [...paths, node]
    })
  }

  const backToPath = (node) => {
    setState({
      username: node.username,
      memberType: node.memberType,
      downline: true
    })

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

  useEffect(() => {
    resetPath()
    setSearchParams((state) => ({ ...state, brandId }))
    setState({ pageIndex: 0, brandId, downline: false })
  }, [brandId])

  let { pageSize, from, to } = state

  let {
    isLoading: isLoadingPathData,
    data: pathData,
    error: pathDataError,
    mutate: mutatePathData,
    deleteCache: deletePathDataCache
  } = useWinlossReportPath(searchParams)

  useEffect(() => {
    console.log("pathData", pathData)
    if (path.length === 0 && state?.downline === false) {
      resetPath(pathData)
    }
  }, [state?.downline, JSON.stringify(pathData)])

  let culture = useLangCode()

  //TODO: sort?
  //TODO: roundId?
  to = startOfNextDay(to)
  let username = state?.username ?? searchParams?.username
  let memberType = state?.memberType ?? searchParams?.memberType
  const toReportSearchParams = () => {
    let result = {
      ...toApiParams(state),
      from,
      to,
      username,
      memberType,
      culture
      /*
    sortby: "username",
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

  const reset = (data) => {
    deletePathDataCache()
    mutatePathData(data, false)

    deleteReportDataCache()
    mutateReportData(data, false)
  }

  let columns = useColumns({
    items: reportData?.items,
    brandId,
    from,
    to,
    path,
    appendPath
  })
  return (
    <Set orientation="vertical" isFilled height="100%" spacing="major-2">
      <Level alignY="bottom" alignX="left" verticalBelow="mobile">
        <SearchBar
          brandId={brandId}
          username={searchParams?.username}
          memberType={searchParams?.memberType}
          from={state?.from}
          to={state?.to}
          search={(data = {}) => {
            resetPath()
            setSearchParams({
              brandId,
              username: data.username,
              memberType: data.memberType,
              roundId: data.roundId
            })
            mutatePathData()

            setState({
              pageIndex: 0,
              ...data,
              downline: !!data?.roundId ? true : false
            })
            mutateReportData()
          }}
        />
      </Level>
      <UserBreadcrumb path={path} backToPath={backToPath} />
      <AutoSizer>
        {({ height, width }) => {
          return (
            <Table
              columns={columns}
              data={reportData?.items}
              total={reportData?.items?.length > 0 && reportData?.total}
              initialState={state}
              controlledState={state}
              pageCount={pageCount(pageSize, reportData?.totalCount)}
              setPageIndex={setPageIndex}
              setSortOrder={setSortOrder}
              isLoading={isLoading}
              maxSize={{ height, width }}
              hasCellDividers
              stickyHead
            />
          )
        }}
      </AutoSizer>
      {error && (
        <AlertDialog
          {...error}
          onClickClose={() => {
            reset({ data: null })
          }}
        />
      )}
    </Set>
  )
}

const UserBreadcrumb = ({ path = [], backToPath }) => {
  if (path.length === 0) {
    return null
  }

  return (
    <Breadcrumb
      separator={
        <Icon icon={faChevronRight} type="font-awesome" color="gray" />
      }
    >
      {path.map((user, index, list) => {
        let isCurrent = isLastIndex(index, list)
        return (
          <Breadcrumb.Item isCurrent={isCurrent} key={user?.id ?? index}>
            <Breadcrumb.Link
              onClick={(event) => {
                if (!isCurrent) {
                  backToPath(user)
                }
              }}
            >
              {user?.username ?? user?.name}
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        )
      })}
    </Breadcrumb>
  )
}

const SearchBar = ({
  username,
  memberType = MemberType.Agent,
  from,
  to,
  search,
  isLoading
}) => {
  let formMethods = useForm({
    defaultValues: {
      username,
      memberType,
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

const useUserColumns = ({ items = [], brandId, from, to, appendPath }) => {
  return useMemo(() => {
    let columns = [
      {
        id: "info",
        Header: "",
        columns: [
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
                  {record?.username}
                </Link.Block>
              )
            },
            TotalCell: () => <Trans zh="总计" en="Total" />
          }),
          textColumn({
            accessor: "memberType",
            Header: <Trans zh="类型" en="Type" />,
            disableSortBy: true,
            Cell: MemberTypeLabel
          }),
          numberColumn({
            accessor: "roundCount",
            Header: <Trans zh="订单数" en="No. of Tickets" />,
            disableSortBy: true
          }),
          numberDecimalColumn({
            accessor: "turnover",
            Header: <Trans zh="投注额" en="Turnover" />,
            disableSortBy: true
          })
        ]
      },
      {
        id: "player",
        Header: <Trans zh="玩家" en="Player" />,
        headCell: {
          textAlign: "center"
        },
        columns: [
          numberDecimalColumn({
            accessor: "winLoss",
            Header: <Trans zh="输赢" en="Winloss" />,
            disableSortBy: true
          }),
          numberDecimalColumn({
            id: "special",
            accessor: (row) => row,
            Header: <Trans zh="特别" en="Special" />,
            disableSortBy: true,
            Cell: ({ value: record }) => {
              if (isPlayerMemberType(record?.memberType)) {
                return <FormattedNumberDecimal value={record?.special} />
              }

              return (
                <PlayerSpecialDialogDisclosure
                  value={record?.special}
                  brandId={brandId}
                  agentId={record?.id}
                  from={from}
                  to={to}
                />
              )
            },
            TotalCell: FormattedNumberDecimal
          })
        ]
      },
      {
        id: "agent",
        Header: <Trans zh="代理" en="Agent" />,
        headCell: {
          textAlign: "center"
        },
        columns: [
          numberDecimalColumn({
            accessor: "agentWinLoss",
            Header: <Trans zh="输赢" en="Winloss" />,
            disableSortBy: true
          }),
          numberDecimalColumn({
            accessor: "agentSpecial",
            Header: <Trans zh="特别" en="Special" />,
            disableSortBy: true
          }),
          numberDecimalColumn({
            id: "agentTotal",
            accessor: (row) => row,
            Header: <Trans zh="总和" en="Total" />,
            disableSortBy: true,
            Cell: ({ value: record }) => {
              if (isPlayerMemberType(record?.memberType)) {
                return <FormattedNumberDecimal value={record?.special} />
              }

              return (
                <AgentTotalDialogDisclosure
                  value={record?.agentTotal}
                  brandId={brandId}
                  agentId={record?.id}
                  from={from}
                  to={to}
                />
              )
            },
            TotalCell: FormattedNumberDecimal
          })
        ]
      },
      {
        id: "company",
        Header: <Trans zh="公司" en="Company" />,
        headCell: {
          textAlign: "center"
        },
        columns: [
          numberDecimalColumn({
            accessor: "companyWinLoss",
            Header: <Trans zh="输赢" en="Winloss" />,
            disableSortBy: true
          }),
          numberDecimalColumn({
            accessor: "companySpecial",
            Header: <Trans zh="特别" en="Special" />,
            disableSortBy: true
          }),
          numberDecimalColumn({
            id: "companyTotal",
            accessor: (row) => row,
            Header: <Trans zh="总和" en="Total" />,
            disableSortBy: true,
            disableSortBy: true,
            Cell: ({ value: record }) => {
              if (isPlayerMemberType(record?.memberType)) {
                return <FormattedNumberDecimal value={record?.special} />
              }

              return (
                <CompanyTotalDialogDisclosure
                  value={record?.companyTotal}
                  brandId={brandId}
                  agentId={record?.id}
                  from={from}
                  to={to}
                />
              )
            },
            TotalCell: FormattedNumberDecimal
          })
        ]
      }
    ]
    return columns
  }, [JSON.stringify(items)])
}

const useColumns = ({ path = [], ...props }) => {
  let isPlayerOrderData = isPlayerMemberType(last(path)?.memberType)

  return isPlayerOrderData
    ? usePlayerOrderColumns(props)
    : useUserColumns(props)
}
