import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { Box, Set, Button, Text, Switch, Stack } from "bumbag"
import PageContent from "../../page/Content"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute
} from "../../user/context"
import { Code, Update } from "./menu"
import { Trans, useTrans } from "../../i18n"
import { Table, toApiParams, useTable, pageCount } from "../../table"
import { useMaintenanceList } from "./client"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import { SearchButton } from "../../button/SearchButton"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { InputField } from "../../input/Input"
import equals from "fast-deep-equal"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"

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

  let { isLoading, data, error, mutate, deleteCache } = useMaintenanceList({
    ...toApiParams(state),
    sortby: "code"
  })

  let columns = useColumns({ items: data?.items, mutate })

  return (
    <PageContent
      title={<Trans zh="維護管理" en="Maintenance " />}
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
          <Set orientation="horizontal" alignX="right"></Set>
        </>
      }
    >
      <Table
        columns={columns}
        data={data?.items}
        initialState={state}
        controlledState={state}
        pageCount={pageCount(pageSize, data?.totalCount)}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        isLoading={isLoading}
        getRowId={(row, index) => row.id ?? index}
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
    zh: "关键字输入框",
    en: "Search"
  })

  const onSubmit = (data) => search(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <InputField
            name="keyword"
            showEmptyFieldValueAddonAfter
            placeholder={searchPlaceHolder}
          />

          <SearchButton isLoading={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

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
        accessor: "code",
        Header: <Trans zh="平台代码" en="Code" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "name",
        Header: <Trans zh="平台名称" en="Name" />,
        disableSortBy: true
      }),
      dateTimeColumn({
        Header: <Trans zh="維護时间" en="Maintenance Time" />,
        accessor: "maintenanceOn",
        disableSortBy: true
      })
    ]

    if (hasAnyMenu) {
      columns.push(
        textColumn({
          id: "actions",
          disableSortBy: true,
          Header: <Trans zh="操作" en="Actions" />,
          accessor: (row) => row,
          Cell: ({ value }) => {
            return <Set orientation="horizontal" alignX="center"></Set>
          }
        })
      )
    }
    return columns
  }, [JSON.stringify(items)])
}
