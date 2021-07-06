import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { Box, Set, Button, Text, Switch, Stack } from "bumbag"
import PageContent from "../../page/Content"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute
} from "../../user/context"
import { Code, Update as UpdateMenu } from "./menu"
import { Trans, useTrans, FormattedNumberDecimal } from "../../i18n"
import { Table, toApiParams, useTable, pageCount } from "../../table"
import { usePlatformCreditList } from "./client"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import { SearchButton } from "../../button/SearchButton"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { InputField } from "../../input/Input"
import equals from "fast-deep-equal"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { EditPlatformCreditDialogDisclosure } from "./PlatformCreditDialog"
import { PlatformCreditPaymentDialogDisclosure } from "./PlatformCreditPaymentDialog"

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
    licenseeName: "",
    keyword: ""
  })
  let { pageIndex, pageSize, keyword } = state

  let { isLoading, data, error, mutate, deleteCache } = usePlatformCreditList({
    ...toApiParams(state),
    sortby: "code"
  })

  let columns = useColumns({ items: data?.items, mutate })

  return (
    <PageContent
      title={<Trans zh="平台额度" en="Platform Credit" />}
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
        </>
      }
    >
      <Table
        id="platform-credit"
        columns={columns}
        data={data?.items}
        getRowId={(row, index) => {
          return row.code
        }}
        initialState={state}
        controlledState={state}
        pageCount={pageCount(pageSize, data?.totalCount)}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        isLoading={isLoading}
      />
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

const SearchForm = ({ search, isLoading, ...props }) => {
  let formMethods = useForm({
    defaultValues: {
      licenseeName: "",
      keyword: ""
    }
  })

  let licenseePlaceholder = useTrans({
    zh: "所属公司输入框",
    en: "Licensee Input"
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
            name="licenseeName"
            showEmptyFieldValueAddonAfter
            placeholder={licenseePlaceholder}
          />
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

  return useMemo(() => {
    let columns = [
      sequenceColumn(),
      textColumn({
        accessor: "licenseeName",
        Header: <Trans zh="所属公司" en="Licensee Name" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "name",
        Header: <Trans zh="平台名称" en="Name" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "code",
        Header: <Trans zh="平台代码" en="Code" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "credit",
        Header: <Trans zh="平台额度" en="Credit" />,
        disableSortBy: true,
        Cell: ({ value }) => <FormattedNumberDecimal value={value} />
      }),
      textColumn({
        accessor: "balance",
        Header: <Trans zh="额度余额" en="Balance" />,
        disableSortBy: true,
        Cell: ({ value }) => <FormattedNumberDecimal value={value} />
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
            return (
              <Set orientation="horizontal" alignX="center">
                <EditPlatformCreditDialogDisclosure
                  record={value}
                  onSubmitted={mutate}
                />
                <PlatformCreditPaymentDialogDisclosure
                  record={value}
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
