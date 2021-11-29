import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { Heading, Stack, Box, Button, Set, useModalState } from "bumbag"
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
import { Trans, useTrans } from "../../i18n"
import SearchButton from "../../button/SearchButton"
import equals from "fast-deep-equal"
import { InputField } from "../../input/Input"
import BrandBar from "../../report/BrandBar"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { VipLevelLabel } from "../../vip-levels/VipLevel"

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

  let columns = useColumns({ mutate, items: data?.items, brandId })

  return (
    <PageContent
      title={<Trans zh="在线玩家列表" en="Online Players" />}
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
    </PageContent>
  )
}

const SearchBar = ({ brandId, search, isLoading, ...props }) => {
  let usernameInputPlaceholder = useTrans({
    zh: "用户名输入框",
    en: "User name"
  })
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

const useColumns = ({ items = [], brandId } = {}) => {
  return useMemo(() => {
    return [
      sequenceColumn(),
      textColumn({
        accessor: "username",
        Header: <Trans zh="用户名" en="Username" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "vipLevel",
        Header: <Trans zh="VIP 等级" en="VIP Level" />,
        disableSortBy: true,
        Cell: ({ value }) => <VipLevelLabel value={value} placeholder="-" />
      }),
      textColumn({
        accessor: "status",
        Header: <Trans zh="状态" en="Status" />,
        disableSortBy: true,
        Cell: ({ value }) => <PlayerStatusLabel value={value} />
      })
    ]
  }, [JSON.stringify(items)])
}
