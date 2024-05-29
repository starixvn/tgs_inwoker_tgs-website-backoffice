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
import {
  useSmsList,
  usePlatformSmsList,
  useDeletePlatformSms
} from "../../sms/client"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { DeleteSmsDialogDisclosure } from "./DeleteSmsDialog"
import { ActionTrans } from "../../trans/Action"
import { MerchantIdSelect } from "../../merchant/MerchantSelect"
import { Trans } from "../../i18n"
import { SmsListDialogDisclosure } from "./SmsListDialog"
import { AddPlatformSmsDialog } from "./AddPlatformSmsDialog"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return (
    <PageContent title={<Trans zh="簡訊商管理" en="SMS Management" />}>
      <Body />
    </PageContent>
  )
}

export const CodeContentPair = [Code, Content]

const Body = () => {
  let { state, setState, setPageIndex, setSortOrder } = useTable({})
  let {
    isLoading,
    data: items,
    error,
    mutate
  } = usePlatformSmsList(state.brandId)

  let columns = useColumns({ items, mutate })
  return (
    <Set orientation="vertical" isFilled height="100%">
      <Level alignY="bottom" alignX="left" verticalBelow="mobile">
        <SearchBar
          search={(data) => {
            setState(data)
          }}
          isLoading={isLoading}
        />
        <Set>
          <SmsListDialogDisclosure />
          <AddPlatformSmsDialog
            brandId={state.brandId}
            onSubmitted={() => {
              console.log("before mutate platform sms")
              mutate()
            }}
          />
        </Set>
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
        Header: <Trans zh="簡訊商名稱" en="Name" />,
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
              <DeleteSmsDialogDisclosure
                name={record?.name}
                smsSettingId={record?.smsSettingId}
                useDelete={useDeletePlatformSms}
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

const SearchBar = ({ search, isLoading }) => {
  let formMethods = useForm()
  const onSubmit = (data) => search?.(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <MerchantIdSelect
            resellerProps={{ required: false }}
            licenseeProps={{ required: false }}
            brandProps={{
              required: true
            }}
          />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}
