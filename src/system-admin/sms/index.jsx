import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { Box, Button, Set, Icon, Level, Spinner } from "bumbag"
import { PageContent } from "../../page/Content"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Code, View, Update } from "./menu"
import { useFormContext, useForm, FormProvider } from "react-hook-form"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { SearchButton } from "../../button/SearchButton"
import {
  PlatformPageContent,
  usePlatformId
} from "../../page/PlatformPageContent"
import { useSmsList, usePlatformSmsList } from "./client"
import AlertDialog from "../../dialog/Alert"
import { AddSmsDialogDisclosure, UpdateSmsDialogDisclosure } from "./SmsDialog"
import textColumn from "../../table/column/textColumn"
import { DeleteSmsDialogDisclosure } from "./DeleteSmsDialog"
import { PlatformSmsListDialogDisclosure } from "./PlatformSmsList"
import { ActionTrans } from "../../trans/Action"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  //TODO: title
  return (
    <PageContent title="Sms">
      <Body />
    </PageContent>
  )
}

export const CodeContentPair = [Code, Content]

const Body = () => {
  let { isLoading, data: items, error, mutate } = useSmsList()

  let { state, setPageIndex, setSortOrder } = useTable({})
  let columns = useColumns({ items, mutate })
  return (
    <Set orientation="vertical" isFilled height="100%">
      <Level alignY="bottom" alignX="left" verticalBelow="mobile">
        <Box>
          <AddSmsDialogDisclosure onSubmitted={mutate} />
        </Box>
        <Box>
          <PlatformSmsListDialogDisclosure />
        </Box>
      </Level>
      <Table
        columns={columns}
        data={items}
        controlledState={state}
        autoPaging={true}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        isLoading={isLoading}
      />
      {error && (
        <AlertDialog {...error} onClickClose={() => mutate([], false)} />
      )}
    </Set>
  )
}

const useColumns = ({ items = [], mutate }) => {
  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "name",
        Header: "Name",
        disableSortBy: true
      }),
      textColumn({
        accessor: "code",
        Header: "Code",
        disableSortBy: true
      }),
      textColumn({
        id: "actions",
        accessor: (row) => row,
        Header: <ActionTrans />,
        disableSortBy: true,
        Cell: ({ value: record }) => {
          return (
            <Set alignX="center">
              <UpdateSmsDialogDisclosure
                smsSettingId={record?.smsSettingId}
                record={record}
                onSubmitted={mutate}
              />
              <DeleteSmsDialogDisclosure
                name={record?.name}
                smsSettingId={record?.smsSettingId}
                onSubmitted={mutate}
              />
            </Set>
          )
        }
      })
    ]
    return columns
  }, [JSON.stringify(items)])
}

//TODO: seems no need?
const SearchBar = ({ search, isLoading }) => {
  let formMethods = useForm()
  const onSubmit = (data) => search?.(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}
