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
import { useOpenGameRoundList } from "./client"
import { CopyTextBox } from "../../text/CopyTextBox"
import { DateInputRange } from "../../date/DateTimeRangeInput"
import GameProviderSelect from "../../game/providers/GameProviderSelect"
import {
  GameRoundStatusLabel,
  GameRoundStatusSelect
} from "../../game/round/GameRoundStatus"
import { numberDecimalColumn } from "../../table/column/numberColumn"
import { today, yesterday } from "../../date/range"
import { startOfNextDay } from "../../date/startOfNextDay"
import subDays from "date-fns/subDays"
import { CloseGameOpenRoundDialogDisclosure } from "./CloseGameOpenRound"

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
  let dateRange = today()
  let QueryMaxRangeDays = 31

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    from: dateRange.start,
    to: dateRange.end
  })

  let { from, to } = state

  let culture = useLangCode()
  let { isLoading, data, error, mutate, deleteCache } = useOpenGameRoundList({
    ...toApiParams(state),
    sortby: "createdOn",
    orderby: "descending",
    from,
    to: startOfNextDay(to),
    culture
  })
  let columns = useColumns({ items: data?.items })

  let DataRetentionDays = 180
  let minDate = subDays(dateRange.start, DataRetentionDays)
  return (
    <PageContent
      actionBar={
        <SearchBar
          start={from}
          end={to}
          gameProviderId={state.gameProviderId}
          minDate={minDate}
          maxDate={dateRange.end}
          maxRangeDays={QueryMaxRangeDays}
          isLoading={isLoading}
          search={({ start, end, ...rest }) => {
            setState({
              pageIndex: 0,
              from: start,
              to: end,
              ...rest
            })
            mutate()
          }}
        />
      }
      title={<Trans zh="游戏未结算订单" en="Game Open Round" />}
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
        isSticky
      />
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

const SearchBar = ({
  start,
  end,
  minDate,
  maxDate,
  maxRangeDays,
  gameProviderId,
  search,
  isLoading,
  ...props
}) => {
  let formMethods = useForm({
    defaultValues: {
      start,
      end,
      gameProviderId
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
            minDate={minDate}
            maxDate={maxDate}
            maxRangeDays={maxRangeDays}
            required
          />
          <InputField
            name="externalRoundId"
            showEmptyFieldValueAddonAfter
            placeholder={externalRoundIdPlaceholder}
          />
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
      dateTimeColumn({
        accessor: "createdOn",
        Header: <Trans zh="投注时间" en="Created On" />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "externalCreatedOn",
        Header: <Trans zh="三方投注时间" en="External Created On" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "externalRoundId",
        Header: <Trans zh="三方订单ID" en="External Id" />,
        disableSortBy: true,
        Cell: ({ value = "" }) => <CopyTextBox value={value} />
      }),
      textColumn({
        accessor: "brandCode",
        Header: <Trans zh="平台" en="Platfrom" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "playerName",
        Header: <Trans zh="玩家" en="Player" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "playerCode",
        Header: <Trans zh="Player Code" en="Player Code" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "betAmount",
        Header: <Trans zh="Bet Amount" en="Bet Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "validBetAmount",
        Header: <Trans zh="Valid Bet Amount" en="Valid Bet Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "settleAmount",
        Header: <Trans zh="Settle Amount" en="Settle Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "commission",
        Header: <Trans zh="Commission" en="Commission" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "turnover",
        Header: <Trans zh="Turnover" en="Turnover" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "winLoss",
        Header: <Trans zh="WinLoss" en="WinLoss" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "gameProviderName",
        Header: <Trans zh="游戏厂商" en="Game Provider" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "subGameProviderName",
        Header: <Trans zh="子游戏厂商" en="Sub Game Provider" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "gameName",
        Header: <Trans zh="游戏名称" en="Game Name" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "platformType",
        Header: <Trans zh="支持设备" en="Supporting Device" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "currencyCode",
        Header: <Trans zh="币种" en="Currency" />,
        disableSortBy: true
      })
    ]

    if (hasUpdateAuth) {
      columns.push(
        textColumn({
          id: "actions",
          Header: <Trans zh="操作" en="Actions" />,
          accessor: (row) => row,
          disableSortBy: true,
          Cell: ({ value: record }) => {
            let { id: roundId } = record
            return (
              <CloseGameOpenRoundDialogDisclosure
                roundId={roundId}
                record={record}
              />
            )
          }
        })
      )
    }

    return columns
  }, [JSON.stringify(items)])
}
