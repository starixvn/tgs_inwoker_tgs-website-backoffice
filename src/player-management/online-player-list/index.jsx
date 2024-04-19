import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { Heading, Level, Box, Set, Blockquote } from "bumbag"
import {
  PlatformPageContent,
  usePlatformId,
  usePlatformPageContentWidth
} from "../../page/PlatformPageContent"
import sequenceColumn from "../../table/column/sequence"
import { useOnlinePlayerList } from "./client"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { PlayerStatusLabel } from "../PlayerStatus"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute
} from "../../user/context"
import { Code } from "./menu"
import { PlayerStatusSelect } from "../PlayerStatus"
import { VipLevelSelect } from "../../vip-levels/VipLevelSelect"
import { FormattedNumber } from "../../i18n"
import SearchButton from "../../button/SearchButton"
import { InputField } from "../../input/Input"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { VipLevelLabel } from "../../vip-levels/VipLevel"
import { VipLevelTrans } from "../../trans/Vip"
import { UserNameTrans, useUserNameTrans } from "../../trans/User"
import { StatusTrans } from "../../trans/Status"
import { OnlinePlayersTrans, TotalOnlinePlayersTrans } from "../../trans/Player"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return (
    <PlatformPageContent title={<OnlinePlayersTrans />}>
      <Body />
    </PlatformPageContent>
  )
}

export const CodeContentPair = [Code, Content]

const Body = () => {
  let brandId = usePlatformId()
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    status: "",
    vipId: "",
    username: "",
    brandId
  })

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  let { data, isLoading, mutate, error, deleteCache } = useOnlinePlayerList({
    ...toApiParams(state),
    sortby: "username",
    brandId
  })

  let columns = useColumns({ mutate, items: data?.datas?.items, brandId })

  return (
    <Set orientation="vertical" isFilled height="100%">
      <Level alignY="bottom" alignX="left" verticalBelow="mobile">
        <SearchBar
          brandId={brandId}
          search={(data = {}) => {
            setState({
              pageIndex: 0,
              ...data
            })
            mutate()
          }}
          isLoading={isLoading}
        />
      </Level>
      <Summary onlineUsers={data?.onlineUsers} />
      <Table
        columns={columns}
        data={data?.datas?.items}
        initialState={state}
        controlledState={state}
        pageCount={pageCount(state.pageSize, data?.datas?.totalCount)}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        isLoading={isLoading}
      />
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </Set>
  )
}

const Summary = ({ onlineUsers }) => {
  if (!Number.isFinite(onlineUsers)) {
    return null
  }

  return (
    <Blockquote borderColor="primary">
      <Heading use="h5">
        <TotalOnlinePlayersTrans />
        <FormattedNumber value={onlineUsers} />
      </Heading>
    </Blockquote>
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
          <PlayerStatusSelect name="status" />
          <VipLevelSelect name="vipId" brandId={brandId} />
          <InputField
            name="username"
            showEmptyFieldValueAddonAfter
            placeholder={usernameInputPlaceholder}
            autocomplete="off"
          />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ items = [] } = {}) => {
  return useMemo(() => {
    return [
      sequenceColumn(),
      textColumn({
        accessor: "username",
        Header: <UserNameTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "vipLevel",
        Header: <VipLevelTrans />,
        disableSortBy: true,
        Cell: ({ value }) => <VipLevelLabel value={value} placeholder="-" />
      }),
      textColumn({
        accessor: "status",
        Header: <StatusTrans />,
        disableSortBy: true,
        Cell: ({ value }) => <PlayerStatusLabel value={value} />
      })
    ]
  }, [JSON.stringify(items)])
}
