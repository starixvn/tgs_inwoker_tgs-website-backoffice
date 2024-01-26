import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Spinner, Stack, Text, Box, Button, Set, Tabs as _Tabs } from "bumbag"
import {
  Trans,
  FormattedNumber,
  useTrans,
  FormattedNumberDecimal,
  useLangCode
} from "../../i18n"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { GameTypeSelect } from "../../game/GameType"
import GameProviderSelect from "../../game/providers/GameProviderSelect"
import { today } from "../../date/range"
import DateTimeRangeInput from "../../date/DateTimeRangeInput"
import SearchButton from "../../button/SearchButton"
import dateTimeColumn from "../../table/column/dateTime"
import BettingDetail from "./BettingDetailButton"
import { Tab as _Tab, TabPanel } from "../../tab"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { sumColumn } from "../../table/sumColumn"
import { subDays } from "date-fns"
import { useGameBetRecordList } from "../../game/round/client"
import { numberDecimalColumn } from "../../table/column/numberColumn"
import AlertDialog from "../../dialog/Alert"
import {
  BetAmountTrans,
  BetTimeTrans,
  BettingRecordsTrans,
  GameDetailTrans,
  GameNameTrans,
  GameProviderTrans,
  SubGameProviderTrans,
  ValidBetAmountTrans,
  WinLossTrans,
  useGameIdTrans,
  useRoundIdTrans
} from "../../trans/Game"
import { ActionTrans, DetailTrans } from "../../trans/Action"
import { SettleAmountTrans } from "../../trans/Field"
import textColumn from "../../table/column/textColumn"
import { isDev } from "../../env"

export const Key = "betting"

export const Tab = ({ ...props }) => {
  return (
    <_Tab tabId={Key} {...props}>
      <BettingRecordsTrans />
    </_Tab>
  )
}

export const Panel = ({ playerCode, brandId, player, ...props }) => {
  let { selectedId } = props
  let isActive = selectedId === Key
  let dateRange = today()
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    playerCode,
    gameType: "",
    gameProviderId: "",
    from: dateRange.start,
    to: dateRange.end,
    sortBy: [{ id: "createdOn", desc: true }]
  })

  let { pageIndex, pageSize, from, to, gameType, gameProviderId } = state

  let culture = useLangCode()
  let {
    isLoading,
    data = {},
    error,
    mutate,
    deleteCache
  } = useGameBetRecordList(
    isActive
      ? {
          ...toApiParams(state),
          brandId,
          culture
        }
      : undefined
  )

  let columns = useColumns({ items: data?.items })

  let QueryMaxRangeDays = 31
  let DataRetentionDays = 180
  let minDate = subDays(dateRange.start, DataRetentionDays)

  return (
    <TabPanel tabId={Key} {...props}>
      <Stack spacing="major-2">
        <SearchBar
          gameType={gameType}
          gameProviderId={gameProviderId}
          start={from}
          end={to}
          minDate={minDate}
          maxDate={dateRange.end}
          maxRangeDays={QueryMaxRangeDays}
          search={({ start, end, ...formData }) => {
            setState({
              pageIndex: 0,
              from: start,
              to: end,
              ...formData
            })
            mutate()
          }}
          isLoading={isLoading}
        />
        <Table
          columns={columns}
          data={data?.items}
          total={data?.items?.length > 0 && data?.total}
          pageCount={pageCount(pageSize, data?.totalCount)}
          setPageIndex={setPageIndex}
          setSortOrder={setSortOrder}
          initialState={state}
          controlledState={state}
          isLoading={isLoading}
          foot={data?.items?.length > 0}
        />
        {error && <AlertDialog {...error} onClickClose={deleteCache} />}
      </Stack>
    </TabPanel>
  )
}

const SearchBar = ({
  gameType,
  gameProviderId,
  start,
  end,
  minDate,
  maxDate,
  maxRangeDays,
  search,
  isLoading,
  ...props
}) => {
  let formMethods = useForm({
    defaultValues: {
      start,
      end
    }
  })

  const onSubmit = (data) => search(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <GameTypeSelect name="gameType" />
          <GameProviderSelect name="gameProviderId" />
          <DateTimeRangeInput
            minDate={minDate}
            maxDate={maxDate}
            maxRangeDays={maxRangeDays}
            required
          />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ items = [], totals = [] }) => {
  let roundIdTitle = useRoundIdTrans()
  let gameIdTitle = useGameIdTrans()
  return useMemo(() => {
    let columns = [
      dateTimeColumn({
        accessor: "createdOn",
        Header: <BetTimeTrans />,
        TotalCell: () => <Trans zh="总和" en="Total" />,
        Footer: () => <Trans zh="页总和" en="Page Total" />,
        footerCellProps: {
          textAlign: "center"
        }
      })
    ]

    //TODO: confirm with PM
    if (isDev()) {
      columns = [
        ...columns,
        textColumn({
          accessor: "gameProviderName",
          Header: <GameProviderTrans />,
          disableSortBy: true
        }),
        textColumn({
          accessor: "subGameProviderName",
          Header: <SubGameProviderTrans />,
          disableSortBy: true
        }),
        textColumn({
          accessor: "gameName",
          Header: <GameNameTrans />,
          disableSortBy: true
        })
      ]
    }

    columns = [
      ...columns,
      numberDecimalColumn({
        accessor: "betAmount",
        sumColumn: "betAmount",
        Header: <BetAmountTrans />
      }),
      numberDecimalColumn({
        accessor: "validBetAmount",
        sumColumn: "validBetAmount",
        Header: <ValidBetAmountTrans />
      }),
      numberDecimalColumn({
        accessor: "settleAmount",
        sumColumn: "settleAmount",
        Header: <SettleAmountTrans />
      }),
      numberDecimalColumn({
        accessor: "winLoss",
        Header: <WinLossTrans />,
        sumColumn: "winLoss",
        TotalCell: ({ value }) => <FormattedNumberDecimal value={value} />,
        Cell: ({ value }) => {
          let win = value >= 0
          return (
            <Text color={win ? "success" : "danger"}>
              <FormattedNumber value={value} format="+0,0.00" digits={2} />
            </Text>
          )
        }
      }),
      {
        id: "detail",
        accessor: (row) => row,
        Header: <GameDetailTrans />,
        disableSortBy: true,
        headCell: {
          textAlign: "center"
        },
        cell: {
          textAlign: "center",
          whiteSpace: "nowrap"
        },
        TotalCell: () => null,
        Cell: ({ value }) => {
          let { id, gameId = "" } = value
          return (
            <Text>
              <span title={roundIdTitle}>{id}</span> |
              <span title={gameIdTitle}>{gameId}</span>
            </Text>
          )
        }
      },
      {
        id: "actions",
        disableSortBy: true,
        Header: <ActionTrans />,
        headCell: {
          textAlign: "center"
        },
        cell: {
          textAlign: "center"
        },
        accessor: (row) => {
          return row
        },
        TotalCell: () => null,
        Cell: ({ value }) => {
          return (
            <BettingDetail
              record={value}
              id="betting-detail-dialog-disclosure"
              dialogId="betting-detail-dialog"
            >
              <DetailTrans />
            </BettingDetail>
          )
        }
      }
    ]

    return columns
  }, [JSON.stringify(items), JSON.stringify(totals)])
}
