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
import SearchButton from "../../button/SearchButton"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import textColumn from "../../table/column/textColumn"
import { Descending } from "../../table/order"
import AlertDialog from "../../dialog/Alert"
import { sortBy } from "lodash-es"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import Disclosure from "../../dialog/Disclosure"

export const PlayerWalletBalanceDialogDisclosure = ({
  playerCode,
  ...props
}) => {
  let dialog = new useModalState()

  let isDisplay = useIsDisplayMenuByRoute([View])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="钱包余额" en="Wallet Balance" />
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
  let title = useTrans({
    zh: "钱包余额",
    en: "Wallet Balance"
  })

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
        <TransferAllToMainWalletButton
          playerCode={playerCode}
          onSubmitted={onSubmitted}
        />
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

const TransferToMainWalletButton = ({ playerCode, gameProviderCode, onSubmitted }) => {
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
  return useMemo(() => {
    let columns = [
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
      }),
      textColumn({
        id: "actions",
        accessor: (row) => row,
        Header: <Trans zh="操作" en="Actions" />,
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
    ]
    return columns
  }, [JSON.stringify(items)])
}
