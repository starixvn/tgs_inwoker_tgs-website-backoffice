import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { Box, Button, Set, Icon, Flex, Text } from "bumbag"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserRoleType,
  useUserRoleId
} from "../../user/context"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { Code } from "./menu"
import { ellipsisTextColumn, textColumn } from "../../table/column/textColumn"
import dateTimeColumn from "../../table/column/dateTime"
import { useForm, FormProvider } from "react-hook-form"
import { InputField } from "../../input/Input"
import SearchButton from "../../button/SearchButton"
import { PageContent } from "../../page/Content"
import AlertDialog from "../../dialog/Alert"
import { Trans, useTrans, getAcceptLangCulture, useLangCode } from "../../i18n"
import { MerchantIdSelect } from "../../merchant/MerchantSelect"
import GameProviderSelect from "../../game/providers/GameProviderSelect"
import equals from "fast-deep-equal"
import { usePlatformGameProviderList } from "./client"
import { faCheck } from "@fortawesome/free-solid-svg-icons"

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
    brand: "",
    gameProviderId: ""
  })

  let { isLoading, data, error, mutate, deleteCache } =
    usePlatformGameProviderList(toApiParams(state))

  let gameProviders = data?.gameProviders
  let items = data?.items
  let columns = useColumns({ gameProviders, items, mutate })

  return (
    <PageContent
      actionBar={
        <SearchBar
          brand={state.brand}
          gameProviderId={state.gameProviderId}
          isLoading={isLoading}
          search={({ ...rest }) => {
            setState({
              pageIndex: 0,
              ...rest
            })
            mutate()
          }}
        />
      }
    >
      <Table
        columns={columns}
        data={items}
        isLoading={isLoading}
        isSticky
        css={css`
          th {
            position: sticky;
            top: 0;
            z-index: 1;
            background-color: var(--bb-palette-white600, #000000);
          }

          th:first-child {
            position: sticky;
            left: 0;
            z-index: 2;
          }

          td:first-child {
            position: sticky;
            left: 0;
            background-color: var(--bb-palette-white600, #000000);
          }
        `}
      />
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

const SearchBar = ({ brand, gameProviderId, search, isLoading, ...props }) => {
  let formMethods = useForm({
    defaultValues: {
      brand,
      gameProviderId
    }
  })

  const onSubmit = (data) => search?.(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <MerchantIdSelect brandProps={{ name: "brand" }} required={false} />
          <GameProviderSelect name="gameProviderId" />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ gameProviders = [], items = [] }) => {
  return useMemo(() => {
    let columns = [
      textColumn({
        id: "platform",
        accessor: (row) => row,
        Header: <Trans zh="平台" en="Platform" />,
        disableSortBy: true,
        Cell: ({ value: platform }) => {
          let { brandName = "", brabdCode } = platform
          return (
            <span
              title={brabdCode}
              css={css`
                font-weight: bold;
              `}
            >
              {brandName}
            </span>
          )
        }
      }),
      ...gameProviders.map(
        ({ gameProviderCode, gameProviderName, ...gameProvider }) =>
          textColumn({
            id: gameProviderCode,
            accessor: (row) => row,
            Header: <span title={gameProviderCode}>{gameProviderName}</span>,
            disableSortBy: true,
            Cell: ({ value: platform }) => {
              let { gameProvider: platformGameProvider } = platform

              let hasGameProvider = Reflect.get(
                platformGameProvider,
                gameProviderCode
              )

              if (hasGameProvider) {
                return <Text fontWeight="bold">✔</Text>
              }

              return ""
            }
          })
      )
    ]
    return columns
  }, [JSON.stringify(items), JSON.stringify(gameProviders)])
}
