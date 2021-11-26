import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Spinner, Stack, Flex, Box, Card, Set, Blockquote } from "bumbag"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import dateTimeColumn from "../../table/column/dateTime"
import { useOperations, usePlayerTransferWalletList } from "./client"
import { FormattedNumberDecimal, Trans } from "../../i18n"
import { pastWeek } from "../../date/range"
import DateTimeRangeInput from "../../date/DateTimeRangeInput"
import SearchButton from "../../button/SearchButton"
import { Tab as _Tab, TabPanel } from "../../tab"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import textColumn from "../../table/column/textColumn"
import { Descending } from "../../table/order"
import AlertDialog from "../../dialog/Alert"
import { sortBy } from "lodash-es"

export const Key = "wallet-list"

export const PlayerWalletListTab = ({ ...props }) => {
  return (
    <_Tab tabId={Key} {...props}>
      <Trans zh="钱包余额" en="Wallet Balance" />
    </_Tab>
  )
}

export const PlayerWalletListPanel = ({ player, playerCode, ...props }) => {
  let { selectedId } = props
  let isActive = selectedId === Key

  let { isLoading, data, error, mutate, deleteCache } =
    usePlayerTransferWalletList(playerCode)

  let mainWallet = data?.find(({ isMainWallet }) => isMainWallet)
  let transferWallets = data?.filter(({ isMainWallet }) => !isMainWallet)

  return (
    <TabPanel tabId={Key} {...props}>
      <Stack spacing="major-2">
        {isLoading && (
          <Box alignX="center">
            <Spinner />
          </Box>
        )}
        {!isLoading && (
          <Body
            player={player}
            mainWallet={mainWallet}
            transferWallets={transferWallets}
          />
        )}
      </Stack>
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </TabPanel>
  )
}

const Body = ({ player, mainWallet, transferWallets = [] }) => {
  let items = sortBy(transferWallets, ["gameProviderName"])
  let columns = useColumns({ items })
  return (
    <>
      <Blockquote>
        <Trans zh="需滿足提款金額：" en="Wagering requirement：" />
        <FormattedNumberDecimal value={player?.wageringRequirement} />
      </Blockquote>
      <Blockquote borderColor="primary">
        <Trans zh="主錢包：" en="Main wallet：" />
        <FormattedNumberDecimal value={mainWallet?.balance} />
      </Blockquote>
      <Table columns={columns} data={items} />
    </>
  )
}

const useColumns = ({ items = [] }) => {
  return useMemo(() => {
    return [
      textColumn({
        accessor: "gameProviderName",
        Header: <Trans zh="游戏商" en="Game Provider" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "balance",
        Header: <Trans zh="转帐錢包" en="Transfer wallet" />,
        disableSortBy: true,
        Cell: ({ value }) => {
          return <FormattedNumberDecimal value={value} placeholder="--" />
        }
      })
    ]
  }, [JSON.stringify(items)])
}
