import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import {
  Heading,
  Stack,
  Box,
  Button,
  Set,
  useModalState,
  Flex,
  Level
} from "bumbag"
import PageContent from "../../page/Content"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId
} from "../../user/context"
import { Code, Update } from "./menu"
import { FormattedNumberDecimal, Trans, useTrans } from "../../i18n"
import SearchButton from "../../button/SearchButton"
import equals from "fast-deep-equal"
import { InputField } from "../../input/Input"
import BrandBar from "../../report/BrandBar"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import numberColumn, {
  numberDecimalColumn,
  numberDecimalPercentageColumn
} from "../../table/column/numberColumn"
import { PlayerAddBalanceDisclosure } from "./PlayerAddBalance"
import { PlayerDeductBalanceDisclosure } from "./PlayerDeductBalance"
import { usePlayerList } from "../player-list/client"
import { PlayerWageringRequirementDialogDisclosure } from "./PlayerWageringRequirement"
import { PlayerBatchAddBalanceDisclosure } from "./PlayerBatchAddBalance"
import { PlayerAdjustLockedAmountDialogDisclosure } from "./PlayerAdjustLockedAmountDialog"
import { ActionTrans } from "../../trans/Action"
import { UserNameTrans, useUserNameTrans } from "../../trans/User"

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
  let userBrandId = useUserBrandId()
  let [brandId, setBrandId] = useState(userBrandId)

  return (
    <Set orientation="vertical" isFilled>
      <BrandBar
        onBrandChange={(value) => {
          setBrandId(value)
        }}
      />
      {brandId && <BodyContent brandId={brandId} />}
    </Set>
  )
}

const BodyContent = ({ brandId = "" }) => {
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    username: ""
  })

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  let { pageIndex, pageSize, username } = state
  let {
    data = {},
    isLoading,
    mutate,
    error,
    deleteCache
  } = usePlayerList(
    brandId
      ? {
          ...toApiParams(state),
          sortby: "username",
          brandId
        }
      : undefined
  )

  let columns = useColumns({ mutate, items: data?.items, brandId })
  return (
    <PageContent
      title={
        <Trans
          zh="玩家调账"
          en="Balance Adjustment"
          vi="Điều chỉnh người chơi"
        />
      }
      actionBar={
        <Flex justifyContent="space-between">
          <SearchBar
            brandId={brandId}
            search={(data) => {
              setState({
                pageIndex: 0,
                ...data
              })
              mutate()
            }}
            isLoading={isLoading}
          />
          <Box>
            <PlayerBatchAddBalanceDisclosure brandId={brandId} />
          </Box>
        </Flex>
      }
    >
      <Table
        columns={columns}
        data={data?.items}
        initialState={state}
        controlledState={state}
        pageCount={pageCount(pageSize, data?.totalCount)}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        isLoading={isLoading}
      />
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

const SearchBar = ({ brandId, search, isLoading, ...props }) => {
  let usernameInputPlaceholder = useUserNameTrans()

  let formMethods = useForm()

  const onSubmit = (data) => search(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <InputField
            name="username"
            showEmptyFieldValueAddonAfter
            placeholder={usernameInputPlaceholder}
          />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}
const useColumns = ({ brandId, items = [], mutate }) => {
  let hasUpdateMenu = useIsDisplayMenuByRoute([Update])

  return useMemo(() => {
    let columns = [
      sequenceColumn(),
      textColumn({
        accessor: "username",
        Header: <UserNameTrans />,
        disableSortBy: true
      })
    ]

    if (hasUpdateMenu) {
      columns.push(
        textColumn({
          id: "actions",
          accessor: (row) => row,
          disableSortBy: true,
          Header: <ActionTrans />,
          Cell: ({ value }) => {
            let username = value?.username
            let playerCode = value?.playerCode
            return (
              <Set alignX="center">
                <PlayerAddBalanceDisclosure
                  id="add-balance-dialog-disclosure"
                  brandId={brandId}
                  username={username}
                  playerCode={playerCode}
                  onSubmitted={mutate}
                />
                <PlayerDeductBalanceDisclosure
                  id="deduct-balance-dialog-disclosure"
                  brandId={brandId}
                  username={username}
                  playerCode={playerCode}
                  onSubmitted={mutate}
                />
                <PlayerWageringRequirementDialogDisclosure
                  id="wagering-requirement-dialog-disclosure"
                  brandId={brandId}
                  username={username}
                  playerCode={playerCode}
                />
                <PlayerAdjustLockedAmountDialogDisclosure
                  username={username}
                  playerCode={playerCode}
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
