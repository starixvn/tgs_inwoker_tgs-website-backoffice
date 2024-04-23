import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { Heading, Box, Button, Set, Level } from "bumbag"
import {
  PlatformPageContent,
  usePlatformId,
  usePlatformPageContentWidth
} from "../../page/PlatformPageContent"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId
} from "../../user/context"
import { Code, Update } from "./menu"
import { AgentStatusSelect } from "../AgentStatus"
import SearchButton from "../../button/SearchButton"
import { InputField } from "../../input/Input"
import AlertDialog from "../../dialog/Alert"
import sequenceColumn from "../../table/column/sequence"
import textColumn from "../../table/column/textColumn"
import { numberDecimalColumn } from "../../table/column/numberColumn"
import { AgentLevelLabel, AgentLevelSelect } from "../AgentLevel"
import { AgentTypeLabel, AgentTypeSelect } from "../AgentType"
import { useAgentList } from "../agent-list/client"
import { AgentAddBalanceDisclosure } from "./AgentAddBalance"
import { AgentDeductBalanceDisclosure } from "./AgentDeductBalance"
import { BalanceTrans, useUserNameTrans } from "../../trans/User"
import { ActionTrans } from "../../trans/Action"
import {
  AgentBalanceAdjustmentTrans,
  AgentLevelTrans,
  AgentTypeTrans,
  AgentUsernameTrans
} from "../../trans/Agent"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return (
    <PlatformPageContent title={<AgentBalanceAdjustmentTrans />}>
      <Body />
    </PlatformPageContent>
  )
}

export const CodeContentPair = [Code, Content]

const Body = ({}) => {
  let brandId = usePlatformId()
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId,
    status: "",
    levelType: "",
    type: "",
    username: ""
  })

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  let {
    data = {},
    isLoading,
    mutate,
    error,
    deleteCache
  } = useAgentList({
    ...toApiParams(state),
    sortby: "username"
  })

  let columns = useColumns({ mutate, items: data?.items, brandId })

  return (
    <Set orientation="vertical" isFilled height="100%">
      <Level alignY="bottom" alignX="left" verticalBelow="mobile">
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
      </Level>
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
    </Set>
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
          <AgentStatusSelect name="status" />
          <AgentLevelSelect name="levelType" />
          <AgentTypeSelect name="type" />
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
        Header: <AgentUsernameTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "levelType",
        Header: <AgentLevelTrans />,
        disableSortBy: true,
        Cell: ({ value }) => <AgentLevelLabel value={value} />
      }),
      textColumn({
        accessor: "type",
        Header: <AgentTypeTrans />,
        disableSortBy: true,
        Cell: ({ value }) => <AgentTypeLabel value={value} />
      }),
      numberDecimalColumn({
        accessor: "balance",
        Header: <BalanceTrans />,
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
            return (
              <Set alignX="center">
                <AgentAddBalanceDisclosure
                  id="add-balance-dialog-disclosure"
                  brandId={brandId}
                  agentId={value?.id}
                  username={username}
                  onSubmitted={mutate}
                />
                <AgentDeductBalanceDisclosure
                  id="deduct-balance-dialog-disclosure"
                  brandId={brandId}
                  agentId={value?.id}
                  username={username}
                  onSubmitted={mutate}
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
