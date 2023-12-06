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
  Blockquote,
  FieldStack
} from "bumbag"
import PageContent from "../../page/Content"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import { useOnlinePlayerList } from "./client"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { PlayerStatusLabel } from "../PlayerStatus"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId,
  useIsAdminUser
} from "../../user/context"
import { Code, View } from "./menu"
import { PlayerStatusSelect } from "../PlayerStatus"
import { VipLevelSelect } from "../../vip-levels/VipLevelSelect"
import { Trans, useTrans, FormattedNumber } from "../../i18n"
import SearchButton from "../../button/SearchButton"
import equals from "fast-deep-equal"
import { InputField } from "../../input/Input"
import BrandBar from "../../report/BrandBar"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { VipLevelLabel } from "../../vip-levels/VipLevel"
import { VipLevelTrans } from "../../trans/Vip"
import { UserNameTrans, useUserNameTrans } from "../../trans/User"
import { StatusTrans } from "../../trans/Status"
import { OnlinePlayersTrans } from "../../trans/Player"

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
    <PageContent
      title={<OnlinePlayersTrans />}
      actionBar={
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
      }
    >
      <FieldStack>
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
      </FieldStack>
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

const Summary = ({ onlineUsers }) => {
  if (!Number.isFinite(onlineUsers)) {
    return null
  }

  return (
    <Blockquote borderColor="primary">
      <Heading use="h5">
        <Trans zh="在线玩家总数：" en="Total Online Players：" />
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
