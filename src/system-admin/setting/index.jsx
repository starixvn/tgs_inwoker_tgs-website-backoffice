import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { Box, Button, Set, Icon, Level } from "bumbag"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserRoleType,
  useUserRoleId
} from "../../user/context"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { Code, View, Update } from "./menu"
import { useSystemSettingList } from "./client"
import textColumn from "../../table/column/textColumn"
import dateTimeColumn from "../../table/column/dateTime"
import { useForm, FormProvider } from "react-hook-form"
import { InputField } from "../../input/Input"
import SearchButton from "../../button/SearchButton"
import { PageContent } from "../../page/Content"
import AlertDialog from "../../dialog/Alert"
import { Trans } from "../../i18n"
import {
  AddSettingDisclosure,
  EditSettingDisclosure,
  ViewSettingDisclosure
} from "./edit"
import equals from "fast-deep-equal"
import { LocalizationDropdownMenu } from "./Localization"
import { ActionTrans, OperatorTrans } from "../../trans/Action"
import { CreatedTimeTrans, UpdatedTimeTrans } from "../../trans/Date"

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
    key: ""
  })

  let { isLoading, data, error, mutate, emptyData } = useSystemSettingList({
    ...toApiParams(state),
    sortby: "key"
  })

  let columns = useColumns({ mutate, items: data?.items })
  return (
    <PageContent
      title={<Trans zh="设定" en="Setting" />}
      actionBar={
        <Level>
          <SearchBar
            key={state?.key}
            search={(data) => {
              setState({
                pageIndex: 0,
                ...data
              })
              mutate()
            }}
            isLoading={isLoading}
          />
          <Set>
            <LocalizationDropdownMenu />
            <AddSettingDisclosure onSubmitted={mutate} />
          </Set>
        </Level>
      }
    >
      <Table
        columns={columns}
        data={data?.items}
        initialState={state}
        controlledState={state}
        pageCount={pageCount(state?.pageSize, data?.totalCount)}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        isLoading={isLoading}
      />
      {error && <AlertDialog {...error} onClickClose={emptyData} />}
    </PageContent>
  )
}

const SearchBar = ({ key = "", search, isLoading }) => {
  let formMethods = useForm({
    defaultValues: { key }
  })

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(search)}>
        <Set>
          <InputField
            name="key"
            showEmptyFieldValueAddonAfter
            placeholder="Key"
          />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ items = [], mutate }) => {
  let hasViewAuth = useIsDisplayMenuByRoute([View])
  let hasUpdateAuth = useIsDisplayMenuByRoute([Update])
  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "key",
        Header: <Trans zh="Key" en="Key" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "description",
        Header: <Trans zh="说明" en="Description" />,
        whiteSpace: "normal",
        disableSortBy: true
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
      }),
      textColumn({
        accessor: "createdByUsername",
        Header: <Trans zh="创建人" en="Created By" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "updatedByUsername",
        Header: <OperatorTrans />,
        disableSortBy: true
      })
    ]

    if (hasViewAuth || hasUpdateAuth) {
      columns.push(
        textColumn({
          id: "actions",
          Header: <ActionTrans />,
          accessor: (row) => row,
          disableSortBy: true,
          Cell: ({ value: record }) => {
            return (
              <Set orientation="horizontal" alignX="center">
                <ViewSettingDisclosure record={record} />
                <EditSettingDisclosure record={record} onSubmitted={mutate} />
              </Set>
            )
          }
        })
      )
    }

    return columns
  }, [JSON.stringify(items)])
}
