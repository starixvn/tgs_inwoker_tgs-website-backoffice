import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { Box, Flex, Set, Button, Text, Stack, Level } from "bumbag"
import PageContent from "../../page/Content"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId,
  useUserRoleType
} from "../../user/context"
import { Code } from "./menu"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import { Trans } from "../../i18n"
import {
  PlatformPageContent,
  usePlatformId
} from "../../page/PlatformPageContent"
import { View, Update } from "./menu"
import { useFormContext, useForm, FormProvider } from "react-hook-form"
import AlertDialog from "../../dialog/Alert"
import { SortOrder } from "../../table/order"
import { ConfirmDeleteDialogDisclosure } from "../../dialog/ConfirmDeleteDialog"
import { Input } from "../../input/Input"
import { useLetterList } from "./client"
import AutoSizer from "react-virtualized-auto-sizer"
import { AddLetterDisclosure } from "./AddLetter"
import textColumn from "../../table/column/textColumn"
import {
  LetterBoxType,
  LetterBoxTypeButtons,
  isSentLetterBox
} from "./LetterBoxType"
import SearchButton from "../../button/SearchButton"
import { ViewLetterDisclosure } from "./ViewLetter"
import { ReplyLetterDisclosure } from "./ReplyLetter"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return (
    <PlatformPageContent title={<Trans zh="站内信" en="Station Letter" />}>
      <Body />
    </PlatformPageContent>
  )
}

const Body = () => {
  let brandId = usePlatformId()

  let [letterBoxType, setLetterBoxType] = useState(LetterBoxType.Inbox)

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId
  })

  useEffect(() => {
    setState({ pageIndex: 0 })
  }, [brandId])

  let toSearchParams = () => ({ ...toApiParams(state) })

  let { isLoading, data, error, mutate, deleteCache } = useLetterList(
    brandId,
    letterBoxType,
    toSearchParams()
  )

  let items = data?.items
  let columns = useColumns({
    brandId,
    items,
    letterBoxType
  })

  return (
    <Set orientation="vertical" isFilled>
      <Level alignY="bottom" alignX="left" verticalBelow="mobile">
        <SearchBar
          search={(data = {}) => {
            setState({
              pageIndex: 0,
              ...data
            })
            mutate(null, true)
          }}
        />
        <Box>
          <AddLetterDisclosure
            brandId={brandId}
            onSubmitted={() => {
              if (isSentLetterBox(letterBoxType)) {
                mutate()
              }
            }}
          />
        </Box>
      </Level>
      <LetterBoxTypeButtons
        onChange={(value) => {
          setLetterBoxType(value)
        }}
      />
      <AutoSizer>
        {({ height, width }) => {
          return (
            <Table
              columns={columns}
              data={items}
              initialState={state}
              controlledState={state}
              pageCount={pageCount(state?.pageSize, data?.totalCount)}
              setPageIndex={setPageIndex}
              setSortOrder={setSortOrder}
              isLoading={isLoading}
              maxSize={{ height, width }}
              stickyHead
            />
          )
        }}
      </AutoSizer>
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </Set>
  )
}

const SearchBar = ({ search, isLoading }) => {
  let formMethods = useForm({
    defaultValues: {}
  })

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

const useColumns = ({ brandId, items = [], letterBoxType }) => {
  return useMemo(() => {
    let columns = [
      dateTimeColumn({
        accessor: "sentOn",
        Header: <Trans zh="时间" en="Date" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "sender",
        Header: <Trans zh="用户名" en="Username" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "subject",
        Header: <Trans zh="用户名" en="Username" />,
        disableSortBy: true
      }),
      textColumn({
        id: "actions",
        accessor: (row) => row,
        Header: <Trans zh="操作" en="Actions" />,
        disableSortBy: true,
        Cell: ({ value: record }) => {
          return (
            <Set alignX="center">
              <ViewLetterDisclosure
                brandId={brandId}
                letterBoxType={letterBoxType}
                letterId={record?.id}
              />
              <ReplyLetterDisclosure
                brandId={brandId}
                letterBoxType={letterBoxType}
                letterId={record?.id}
              />
            </Set>
          )
        }
      })
    ]

    return columns
  }, [JSON.stringify(items)])
}
