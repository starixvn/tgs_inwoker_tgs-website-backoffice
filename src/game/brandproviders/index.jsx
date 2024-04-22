import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { Level, Set, Text, Box } from "bumbag"
import {
  PlatformPageContent,
  usePlatformId,
  usePlatformPageContentWidth
} from "../../page/PlatformPageContent"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute
} from "../../user/context"
import { Code, Update } from "./menu"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { Trans, useTrans } from "../../i18n"
import { SearchButton } from "../../button/SearchButton"
import equals from "fast-deep-equal"
import { useBrandGameProviderList } from "./client"
import { useFormattedTimeString } from "../../date/format"
import { useFormattedDay } from "../../date/week"
import { StatusMenu } from "./status"
import { EditButton } from "./edit"
import { EditPresetButton } from "./PresetMaintenance"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { InputField } from "../../input/Input"
import AlertDialog from "../../dialog/Alert"
import { ActionTrans } from "../../trans/Action"
import { StatusTrans } from "../../trans/Status"
import {
  GameProviderListTrans,
  GameProviderNameTrans,
  useGameProviderNameTrans
} from "../../trans/Game"
import { PeriodicMaintenanceTimeTrans } from "../../trans/Date"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return (
    <PlatformPageContent title={<GameProviderListTrans />}>
      <Body />
    </PlatformPageContent>
  )
}

export const CodeContentPair = [Code, Content]

const Body = () => {
  let brandId = usePlatformId()
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId,
    keyword: ""
  })

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  let { isLoading, data, error, mutate, deleteCache } =
    useBrandGameProviderList({
      ...toApiParams(state),
      sortby: "gameProviderName"
    })

  let columns = useColumns({ items: data?.items, mutate })

  return (
    <Set orientation="vertical" isFilled height="100%">
      <Level alignY="bottom" alignX="left" verticalBelow="mobile">
        <SearchBar
          keyword={state.keyword}
          search={(data = {}) => {
            setState({
              pageIndex: 0,
              ...data
            })
            mutate()
          }}
        />
      </Level>
      <Table
        columns={columns}
        data={data?.items}
        pageCount={pageCount(state.pageSize, data?.totalCount)}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        isLoading={isLoading}
      />
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </Set>
  )
}

const SearchBar = ({ name: keyword = "", search, isLoading, ...props }) => {
  let formMethods = useForm({
    defaultValues: {
      keyword: ""
    }
  })

  let searchPlaceHolder = useGameProviderNameTrans()

  const onSubmit = (data) => search(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <InputField
            name="keyword"
            showEmptyFieldValueAddonAfter
            placeholder={searchPlaceHolder}
            autocomplete="off"
          />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ items = [], mutate }) => {
  let hasUpdateMenu = useIsDisplayMenuByRoute([Update])

  return useMemo(() => {
    let columns = [
      {
        accessor: "id",
        Header: <Trans zh="ID" en="ID" />,
        disableSortBy: true,
        headCell: {
          textAlign: "center"
        },
        cell: {
          textAlign: "center"
        }
      },
      {
        accessor: "gameProviderName",
        Header: <GameProviderNameTrans />,
        disableSortBy: true,
        headCell: {
          textAlign: "center"
        },
        cell: {
          textAlign: "center"
        }
      },
      {
        id: "maintenanceTime",
        accessor: (record) => record,
        Header: <PeriodicMaintenanceTimeTrans />,
        disableSortBy: true,
        headCell: {
          textAlign: "center"
        },
        cell: {
          textAlign: "center"
        },
        Cell: ({ value }) => {
          let { dayOfWeek, from, to } = value
          return (
            <Text.Block whiteSpace="nowrap">
              {`${useFormattedDay(dayOfWeek)} ${useFormattedTimeString(
                from
              )} - ${useFormattedTimeString(to)}`}
            </Text.Block>
          )
        }
      },
      {
        id: "status",
        accessor: (record) => record,
        Header: <StatusTrans />,
        disableSortBy: true,
        headCell: {
          textAlign: "center"
        },
        cell: {
          textAlign: "center"
        },
        Cell: ({ value }) => {
          return (
            <Box alignX="center">
              <StatusMenu record={value} onSubmitted={mutate} />
            </Box>
          )
        }
      }
    ]

    if (hasUpdateMenu) {
      columns.push({
        id: "actions",
        accessor: (row) => row,
        disableSortBy: true,
        Header: <ActionTrans />,
        headCell: {
          textAlign: "center"
        },
        cell: {
          textAlign: "center"
        },
        Cell: ({ value }) => {
          return (
            <Set orientation="vertical" alignX="center">
              <EditButton record={value} onSubmitted={mutate} />
              <EditPresetButton record={value} onSubmitted={mutate} />
            </Set>
          )
        }
      })
    }
    return columns
  }, [JSON.stringify(items)])
}
