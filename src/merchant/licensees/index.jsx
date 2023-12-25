import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { Box, Set, Button } from "bumbag"
import PageContent from "../../page/Content"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute
} from "../../user/context"
import { Code, Update } from "./menu"
import { Trans, useTrans } from "../../i18n"
import { Table, toApiParams, useTable, pageCount } from "../../table"
import { useLicenseeList, useChangeLicenseeStatus } from "./client"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import { AddButton, EditButton, ViewButton } from "./edit"
import { SearchButton } from "../../button/SearchButton"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { InputField } from "../../input/Input"
import equals from "fast-deep-equal"
import { MerchantStatusMenu } from "../MerchantStatus"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { ActionTrans } from "../../trans/Action"
import { CreatedTimeTrans, UpdatedTimeTrans } from "../../trans/Date"
import { StatusTrans } from "../../trans/Status"

export { Code }

export const Licensee = "Licensee"

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

  let { isLoading, data, error, mutate, deleteCache } = useLicenseeList({
    ...toApiParams(state),
    sortby: "code",
    hideArchieved: false
  })

  let columns = useColumns({ items: data?.items, mutate })

  return (
    <PageContent
      title={<Trans zh="公司列表" en="Licensees" />}
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
          <AddButton onSubmitted={mutate} />
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
        accessor: "code",
        Header: <Trans zh="公司代码" en="Code" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "name",
        Header: <Trans zh="公司名称" en="Name" />,
        disableSortBy: true
      }),
      {
        accessor: "description",
        Header: <Trans zh="公司简介" en="Description" />,
        disableSortBy: true,
        headCell: {
          textAlign: "center",
          whiteSpace: "nowrap"
        },
        cell: {
          textAlign: "center"
        }
      },
      {
        accessor: "operationalEmail",
        Header: <Trans zh="公司邮箱" en="Email" />,
        disableSortBy: true,
        headCell: {
          textAlign: "center",
          whiteSpace: "nowrap"
        },
        cell: {
          textAlign: "center"
        }
      },
      textColumn({
        id: "status",
        accessor: (record) => record,
        Header: <StatusTrans />,
        disableSortBy: true,
        Cell: ({ value }) => {
          return (
            <Box alignX="center">
              <MerchantStatusMenu
                record={value}
                useChangeStatus={useChangeLicenseeStatus}
                onSubmitted={mutate}
                readOnly={!hasUpdateAuth}
                disabled={!hasUpdateAuth}
              />
            </Box>
          )
        }
      }),
      dateTimeColumn({
        Header: <CreatedTimeTrans />,
        accessor: "createdOn",
        disableSortBy: true
      }),
      dateTimeColumn({
        Header: <UpdatedTimeTrans />,
        accessor: "updatedOn",
        disableSortBy: true
      })
    ]

    if (hasAnyMenu) {
      columns.push(
        textColumn({
          id: "actions",
          accessor: (row) => row,
          Header: <ActionTrans />,
          disableSortBy: true,
          Cell: ({ value }) => {
            return (
              <Set orientation="horizontal" alignX="center">
                <ViewButton record={value} />
                <EditButton record={value} onSubmitted={mutate} />
              </Set>
            )
          }
        })
      )
    }
    return columns
  }, [JSON.stringify(items)])
}
