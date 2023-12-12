import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Dialog,
  useModalState,
  Stack,
  Heading,
  Text,
  Box,
  Set,
  FieldStack,
  Link
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import Disclosure from "../../dialog/Disclosure"
import {
  FormattedDate,
  FormattedDateTime,
  FormattedNumber,
  FormattedNumberDecimal,
  Trans,
  useTrans
} from "../../i18n"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import dateTimeColumn from "../../table/column/dateTime"
import {
  numberDecimalColumn,
  numberDecimalPercentageColumn
} from "../../table/column/numberColumn"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { formatDateTime, formatDayMonthYear } from "../../date/format"
import { FieldValues } from "../../layout/Grid"
import { formatNumberDecimal } from "../../number/format"
import Separator from "../../layout/Separator"
import { startOfNextDay } from "../../date/startOfNextDay"
import { useMarketingGamePlayerList } from "./client"
import { useForm, FormProvider } from "react-hook-form"
import SearchButton from "../../button/SearchButton"
import { InputField } from "../../input/Input"
import { GameProviderTrans, SubGameProviderTrans } from "../../trans/Game"
import { PlayerWinLossTrans } from "../../trans/Player"

export const GamePlayerListDialogDisclosure = ({
  brandId,
  value,
  agentUsername,
  date,
  reportDate,
  ...props
}) => {
  let dialog = useModalState()

  let isEmpty = Number.isFinite(value) && value === 0
  if (isEmpty) {
    return <FormattedNumber value={value} />
  }

  return (
    <>
      <Disclosure use={Link} {...dialog} {...props}>
        <FormattedNumber value={value} />
      </Disclosure>
      {dialog.visible && (
        <PlayerListDialog
          brandId={brandId}
          agentUsername={agentUsername}
          date={date}
          reportDate={reportDate}
          dialog={dialog}
        />
      )}
    </>
  )
}

const PlayerListDialog = ({
  brandId,
  agentUsername,
  date,
  reportDate,
  dialog,
  ...props
}) => {
  let title = useTrans({
    zh: "玩家清單",
    en: "Player List"
  })
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId,
    agentUsername,
    playerUsername: "",
    date,
    reportDate
  })
  let { isLoading, data, error, mutate, deleteCache } =
    useMarketingGamePlayerList(toApiParams(state))

  let columns = useColumns({ items: data?.items })

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <Dialog.Modal
      title={title}
      hideOnClickOutside={false}
      {...dialog}
      showCloseButton
      placement="top"
      showActionButtons={false}
      footer={<CloseButtonFooter dialog={dialog} alignX="right" />}
      maxWidth="90vw"
      css={css`
        & .bb-DialogContent {
          min-width: 80vw;
          max-height: 80vh;
        }
      `}
    >
      <FieldStack
        css={css`
          height: 70vh;
          overflow: auto;
        `}
      >
        <SearchBar
          playerUsername={state?.playerUsername}
          search={(data) => {
            setState({
              pageIndex: 0,
              ...data
            })
            mutate()
          }}
          isLoading={isLoading}
        />
        <Table
          columns={columns}
          data={data?.items}
          initialState={state}
          controlledState={state}
          pageCount={pageCount(state.pageSize, data?.totalCount)}
          setPageIndex={setPageIndex}
          setSortOrder={setSortOrder}
          isLoading={isLoading}
          stickyHead
        />
      </FieldStack>
    </Dialog.Modal>
  )
}

const SearchBar = ({ playerUsername, search, isLoading, ...props }) => {
  let playerUsernamePlaceholder = useTrans({
    zh: "玩家用户名",
    en: "Player Username"
  })

  let formMethods = useForm({
    defaultValues: {
      playerUsername
    }
  })

  const onSubmit = (data) => search(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <InputField
            name="playerUsername"
            showEmptyFieldValueAddonAfter
            placeholder={playerUsernamePlaceholder}
          />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ items = [] }) => {
  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "username",
        Header: <Trans zh="玩家用户名" en="Player Username" />,
        disableSortBy: true
      }),
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
      numberDecimalColumn({
        accessor: "winLossAmount",
        Header: <PlayerWinLossTrans />,
        disableSortBy: true
      })
    ]

    return columns
  }, [JSON.stringify(items)])
}
