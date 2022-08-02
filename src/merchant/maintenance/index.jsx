import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { Box, Set, Button, Text, Switch, Stack } from "bumbag"
import PageContent from "../../page/Content"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute
} from "../../user/context"
import { Code, Update } from "./menu"
import { FormattedDateTime, Trans, useTrans } from "../../i18n"
import { Table, toApiParams, useTable, pageCount } from "../../table"
import {
  useUpdateAllMaintenance,
  useUpdateMaintenance,
  useMaintenanceList
} from "./client"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import { SearchButton } from "../../button/SearchButton"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { InputField } from "../../input/Input"
import equals from "fast-deep-equal"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { MaintenanceTimeRangeDialogDisclosure } from "./MaintenanceTimeRangeDialog"
import { toDate } from "../../date/toDate"
import { formatHourMinute } from "../../date/format"
import {
  EditMaintenanceMessageDisclosure,
  ViewMaintenanceMessageDisclosure
} from "./MaintenanceMessageDialog"
import { useChangeBrandStatus } from "../platforms/client"
import { MerchantStatusMenu, MerchantStatus } from "../MerchantStatus"
import { StartMaintenanceDialogDisclosure } from "./StartMaintenanceDialog"
import { parseTimeOnly } from "../../date/parse"
import { isValidDate } from "../../date/isValidDate"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return <Body />
}

export const CodeContentPair = [Code, Content]

const Body = () => {
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    keyword: ""
  })
  let { pageIndex, pageSize, keyword } = state

  let {
    isLoading,
    data: items,
    error,
    mutate,
    deleteCache
  } = useMaintenanceList({
    ...toApiParams(state)
  })

  let columns = useColumns({ items, mutate })

  return (
    <PageContent
      title={<Trans zh="維護管理" en="Maintenance Management" />}
      actionBar={
        <>
          <SearchForm
            search={(data = {}) => {
              setState({
                pageIndex: 0,
                ...data
              })
              mutate()
            }}
            isLoading={isLoading}
          />
          <Set orientation="horizontal" alignX="right">
            <MaintenanceTimeRangeDialogDisclosure
              useFetch={useUpdateAllMaintenance}
              onSubmitted={mutate}
            />
            <StartMaintenanceDialogDisclosure onSubmitted={mutate} />
          </Set>
        </>
      }
    >
      <Table
        columns={columns}
        data={items}
        initialState={state}
        controlledState={state}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        isLoading={isLoading}
        stickyHead
      />
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

const SearchForm = ({ search, isLoading, ...props }) => {
  let formMethods = useForm({
    defaultValues: {
      keyword: ""
    }
  })

  let searchPlaceHolder = useTrans({
    zh: "平台代码",
    en: "Platform Code"
  })

  const onSubmit = (data) => search(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <InputField
            name="brandCode"
            showEmptyFieldValueAddonAfter
            placeholder={searchPlaceHolder}
          />

          <SearchButton isLoading={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const enabledStatusList = [MerchantStatus.Active, MerchantStatus.Maintenance]
const isStatusChangeAvailable = (value) => enabledStatusList.includes(value)

const useColumns = ({ items = [], mutate }) => {
  let hasAnyMenu = useHasSubMenuByRoute()
  let hasUpdateAuth = useIsDisplayMenuByRoute([Update])

  return useMemo(() => {
    let columns = [
      sequenceColumn(),
      textColumn({
        accessor: "licenseeName",
        Header: <Trans zh="所属公司" en="Licensee Name" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "brandCode",
        Header: <Trans zh="平台代码" en="Code" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "brandName",
        Header: <Trans zh="平台名称" en="Name" />,
        disableSortBy: true
      }),
      textColumn({
        id: "brandStatus",
        accessor: (record) => record,
        Header: <Trans zh="状态" en="Status" />,
        disableSortBy: true,
        Cell: ({ value: record }) => {
          return (
            <Box alignX="center">
              <MerchantStatusMenu
                record={{
                  id: record?.brandId,
                  status: record?.brandStatus
                }}
                useChangeStatus={useChangeBrandStatus}
                onSubmitted={mutate}
                readOnly={!hasUpdateAuth}
                disabled={!hasUpdateAuth}
                enableMenuItem={isStatusChangeAvailable}
              />
            </Box>
          )
        }
      }),
      textColumn({
        id: "maintenanceTimeRange",
        accessor: (row) => row,
        Header: <Trans zh="維護时间" en="Maintenance Time" />,
        disableSortBy: true,
        Cell: ({ value: record }) => {
          let start = formatHourMinute(parseTimeOnly(record?.beginTime))
          let end = formatHourMinute(parseTimeOnly(record?.endTime))
          return (
            <Set alignX="center">
              {start ?? record?.beginTime} - {end ?? record?.endTime}
            </Set>
          )
        }
      })
    ]

    if (hasAnyMenu) {
      columns.push(
        textColumn({
          id: "actions",
          disableSortBy: true,
          Header: <Trans zh="操作" en="Actions" />,
          accessor: (row) => row,
          Cell: ({ value: record }) => {
            return (
              <Set orientation="horizontal" alignX="center">
                <ViewMaintenanceMessageDisclosure
                  id={record?.brandMaintenanceId}
                />
                <EditMaintenanceMessageDisclosure
                  id={record?.brandMaintenanceId}
                />
                <MaintenanceTimeRangeDialogDisclosure
                  useFetch={useUpdateMaintenance}
                  brandId={record?.brandId}
                  brandName={record?.brandName}
                  beginTime={parseTimeOnly(record?.beginTime)}
                  endTime={parseTimeOnly(record?.endTime)}
                  onSubmitted={mutate}
                />
              </Set>
            )
          }
        })
      )
    }
    return columns
  }, [JSON.stringify(items)])
}
