import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Spinner,
  Stack,
  Flex,
  Box,
  Button,
  Set,
  Blockquote,
  Dialog,
  useModalState,
  FieldStack
} from "bumbag"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { View, Update } from "./menu"
import dateTimeColumn from "../../table/column/dateTime"
import { usePlayer } from "./client"
import {
  usePlayerTransferWalletList,
  usePlayerTransferAllToMainWallet,
  usePlayerTransferToMainWallet
} from "./client"
import { FormattedNumberDecimal, Trans, useTrans } from "../../i18n"
import textColumn from "../../table/column/textColumn"
import AlertDialog from "../../dialog/Alert"
import { sortBy } from "lodash-es"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import Disclosure from "../../dialog/Disclosure"
import { numberDecimalColumn } from "../../table/column/numberColumn"
import { WalletBalanceTrans, useWalletBalanceTrans } from "../../trans/User"
import { ActionTrans } from "../../trans/Action"
import { GameProviderTrans } from "../../trans/Game"

export const PlayerWalletBalanceDialogDisclosure = ({
  playerCode,
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([View])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <WalletBalanceTrans />
      </Disclosure>
      {dialog.visible && (
        <PlayerWalletDialog playerCode={playerCode} dialog={dialog} />
      )}
    </>
  )
}

const usePlayerWallets = (playerCode) => {
  let {
    isLoading: isLoadingPlayer,
    data: player,
    error: playerError,
    mutate: mutatePlayer,
    deleteCache: deletePlayerCache
  } = usePlayer(playerCode)

  let {
    isLoading: isLoadingPlayerWallets,
    data: playerWallets,
    error: playerWalletsError,
    mutate: mutatePlayerWallets,
    deleteCache: deletePlayerWalletsCache
  } = usePlayerTransferWalletList(playerCode)

  return {
    isLoading: isLoadingPlayer || isLoadingPlayerWallets,
    error: playerError || playerWalletsError,
    data: { player, playerWallets },
    mutate: (_, shouldRevalidate) => {
      mutatePlayer(_, shouldRevalidate)
      mutatePlayerWallets(_, shouldRevalidate)
    },
    deleteCache: () => {
      deletePlayerCache()
      deletePlayerWalletsCache()
    }
  }
}

const PlayerWalletDialog = ({ playerCode, dialog, ...props }) => {
  let title = useWalletBalanceTrans()

  let { isLoading, data, error, mutate, deleteCache } =
    usePlayerWallets(playerCode)

  const reset = () => {
    deleteCache()
    mutate(null, false)
  }

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  let player = data?.player
  let mainWallet = data?.playerWallets?.find(({ isMainWallet }) => isMainWallet)
  let transferWallets = data?.playerWallets?.filter(
    ({ isMainWallet }) => !isMainWallet
  )

  return (
    <Dialog.Modal
      id="player-wallet-balance-dialog"
      title={title}
      {...dialog}
      hideOnClickOutside={false}
      showCloseButton={true}
      minWidth="50vw"
    >
      <Body
        player={player}
        playerCode={playerCode}
        mainWallet={mainWallet}
        transferWallets={transferWallets}
        onSubmitted={mutate}
      />
    </Dialog.Modal>
  )
}

const Body = ({
  player,
  playerCode,
  mainWallet,
  transferWallets = [],
  onSubmitted
}) => {
  let editable = useIsDisplayMenuByRoute([Update])
  let readOnly = !editable

  let items = sortBy(transferWallets, ["gameProviderName"])
  let columns = useColumns({ items, playerCode, onSubmitted })
  return (
    <FieldStack paddingBottom="1.5rem">
      <Blockquote>
        <Trans zh="需滿足提款金額：" en="Wagering requirement：" />
        <FormattedNumberDecimal value={player?.wageringRequirement} />
      </Blockquote>
      <Set orientation="horizontal" alignY="center">
        <Blockquote borderColor="primary">
          <Trans zh="主錢包：" en="Main wallet：" />
          <FormattedNumberDecimal
            id="main-wallet"
            value={mainWallet?.balance}
          />
        </Blockquote>
        {editable && (
          <TransferAllToMainWalletButton
            playerCode={playerCode}
            onSubmitted={onSubmitted}
          />
        )}
      </Set>
      <Table columns={columns} data={items} />
    </FieldStack>
  )
}

const TransferAllToMainWalletButton = ({
  playerCode,
  onSubmitted,
  ...props
}) => {
  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    usePlayerTransferAllToMainWallet(formData)

  const reset = () => {
    deleteCache()
    mutate(null, false)
    setSubmit(undefined)
  }

  useEffect(() => {
    if (result) {
      reset()
      onSubmitted?.()
    }
  }, [result])

  return (
    <>
      <Button
        onClick={() => {
          setSubmit(playerCode)
        }}
        isLoading={isLoading}
        disabled={isLoading}
      >
        <Trans zh="一键转入" en="Transfer from all sub wallet to main wallet" />
      </Button>
      {error && <AlertDialog {...error} onClickClose={reset} />}
    </>
  )
}

const TransferToMainWalletButton = ({
  playerCode,
  gameProviderCode,
  onSubmitted
}) => {
  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    usePlayerTransferToMainWallet(formData)

  const reset = () => {
    deleteCache()
    mutate(null, false)
    setSubmit(undefined)
  }

  useEffect(() => {
    if (result) {
      reset()
      onSubmitted?.()
    }
  }, [result])

  return (
    <>
      <Button
        onClick={() => {
          setSubmit({
            playerCode,
            gameProviderCode
          })
        }}
        isLoading={isLoading}
        disabled={isLoading}
      >
        <Trans zh="转至主钱包" en="Transfer to main wallet" />
      </Button>
      {error && <AlertDialog {...error} onClickClose={reset} />}
    </>
  )
}

const useColumns = ({ items = [], playerCode, onSubmitted }) => {
  let updateAuth = useIsDisplayMenuByRoute([Update])
  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "gameProviderName",
        Header: <GameProviderTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "freeBalance",
        Header: <Trans zh="转帐钱包" en="Transfer Wallet" />,
        disableSortBy: true,
        placeholder: "--"
      }),
      numberDecimalColumn({
        accessor: "outstandingBalance",
        Header: <Trans zh="未结余额" en="Unsettled Balance" />,
        disableSortBy: true,
        placeholder: "--"
      }),
      numberDecimalColumn({
        accessor: "balance",
        Header: <Trans zh="总余额" en="Total" />,
        disableSortBy: true,
        placeholder: "--"
      })
    ]

    if (updateAuth) {
      columns.push(
        textColumn({
          id: "actions",
          accessor: (row) => row,
          Header: <ActionTrans />,
          disableSortBy: true,
          Cell: ({ value: record }) => {
            return (
              <Set alignX="center">
                <TransferToMainWalletButton
                  playerCode={playerCode}
                  gameProviderCode={record?.gameProviderCode}
                  onSubmitted={onSubmitted}
                />
              </Set>
            )
          }
        })
      )
    }

    return columns
  }, [JSON.stringify(items)])
}
