import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { Box, Button, Set, Icon, Flex } from "bumbag"
import {
    useIsDisplayMenuByRoute,
    useHasSubMenuByRoute,
    useUserRoleType,
    useUserRoleId
} from "../../user/context"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { Code, Update } from "./menu"
import { ellipsisTextColumn, textColumn } from "../../table/column/textColumn"
import dateTimeColumn from "../../table/column/dateTime"
import { useForm, FormProvider } from "react-hook-form"
import { InputField } from "../../input/Input"
import SearchButton from "../../button/SearchButton"
import { PageContent } from "../../page/Content"
import AlertDialog from "../../dialog/Alert"
import { Trans, useTrans, getAcceptLangCulture, useLangCode } from "../../i18n"
import { useLanguageList } from "../../language/client"
import equals from "fast-deep-equal"
import { useGameRoundList } from "../../game/round/client"
import { CopyTextBox } from "../../text/CopyTextBox"
import { DateInputRange } from "../../date/DateTimeRangeInput"
import GameProviderSelect from "../../game/providers/GameProviderSelect"
import {
    GameRoundStatusLabel,
    GameRoundStatusSelect
  } from "../../game/round/GameRoundStatus"

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
    //TODO: open round status
    let { state, setState, setPageIndex, setSortOrder } = useTable({
    })

    let { isLoading, data, error, mutate, deleteCache } = useGameRoundList(toApiParams(state))
    let columns = useColumns({ items: data?.items })

    return <PageContent
            actionBar={<SearchBar
            start={state.from}
            end={state.to}
            search={({ start, end, ...rest }) => {
                setState({
                    pageIndex: 0,
                    from: start,
                    to: end,
                    ...rest
                })
                mutate()
            }}
        />}
        title={<Trans zh="Game Round" en="Game Round" />}
    >
        <Table
            columns={columns}
            data={data?.items}
            initialState={state}
            controlledState={state}
            pageCount={pageCount(state.pageSize, data?.totalCount)}
            setPageIndex={setPageIndex}
            setSortOrder={setSortOrder}
            isLoading={isLoading}
        />
        {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
}

const SearchBar = ({
    start,
    end,
    search, 
    isLoading,
    ...props }) => {
    let formMethods = useForm({
        defaultValues: {
            start,
            end,
        }
    })

    const onSubmit = (data) => search?.(data)

    let roundIdPlaceholder = useTrans({
        zh: "订单ID",
        en: "Round ID"
      })
    
    let externalRoundIdPlaceholder = useTrans({
        zh: "三方订单ID",
        en: "External ID"
    })

    return (
        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)}>
            <Set>
              <DateInputRange
                // minDate={minDate}
                // maxDate={maxDate}
                // maxRangeDays={maxRangeDays}
                required
              />
              <InputField
                name="roundId"
                showEmptyFieldValueAddonAfter
                placeholder={roundIdPlaceholder}
              />
              <InputField
                name="externalRoundId"
                showEmptyFieldValueAddonAfter
                placeholder={externalRoundIdPlaceholder}
              />
              <GameRoundStatusSelect name="status" />
              <GameProviderSelect name="gameProviderId" />
              <SearchButton isLoading={isLoading} disabled={isLoading} />
            </Set>
          </form>
        </FormProvider>
      )
}

const useColumns = ({ items = [] }) => {
    let hasUpdateAuth = useIsDisplayMenuByRoute([Update])
    return useMemo(() => {
        let columns = [
            ellipsisTextColumn({
                accessor: "externalRoundId",
                Header: <Trans zh="三方订单ID" en="External Id" />,
                disableSortBy: true,
                maxWidth: "8rem",
                Cell: ({ value = "" }) => <CopyTextBox value={value} />
            }),
            ellipsisTextColumn({
                accessor: "id",
                Header: <Trans zh="订单ID" en="Id" />,
                disableSortBy: true,
                maxWidth: "8rem",
                Cell: ({ value = "" }) => <CopyTextBox value={value} />
            }),
        ]

        if (hasUpdateAuth) {
            columns.push(
                textColumn({
                    id: "actions",
                    Header: <Trans zh="操作" en="Actions" />,
                    accessor: (row) => row,
                    disableSortBy: true,
                    Cell: ({ value: record }) => {
                        return (
                            <Set>
                            </Set>
                        )
                    }
                })
            )
        }

        return columns
    }, [JSON.stringify(items)])
}