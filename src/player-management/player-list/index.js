import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { Heading, Stack, Box, Button, Set, Spinner } from "bumbag"
import PageContent from "../../page/Content"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import { usePlayerList } from "./client"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { PlayerStatusLabel } from "../PlayerStatus"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId,
  useIsAdminUser
} from "../../user/context"
import { Code, View, Update, PhoneFilter } from "./menu"
import { PlayerStatusSelect } from "../PlayerStatus"
import { VipLevelSelect } from "../../vip-levels/VipLevelSelect"
import { ViewButton, EditButton } from "./button"
import { Trans, useTrans } from "../../i18n"
import SearchButton from "../../button/SearchButton"
import equals from "fast-deep-equal"
import { InputField } from "../../input/Input"
import BrandBar from "../../report/BrandBar"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { VipLevelLabel } from "../../vip-levels/VipLevel"
import { DateInputRangeField } from "../../date/DateTimeRangeInput"
import { startOfNextDay } from "../../date/startOfNextDay"
import { ReviewPlayerIdDialogDisclosure } from "./ReviewPlayerIdDialog"
import { isDev } from "../../env"
import { useBrand } from "../../merchant/platforms/client"

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
  let { isLoading, data: brand, error, mutate, deleteCache } = useBrand(brandId)

  return (
    <Set orientation="vertical" isFilled>
      <BrandBar
        onBrandChange={(value) => {
          setBrandId(value)
        }}
      />
      {isLoading && (
        <Box alignY="center" alignX="center">
          <Spinner />
        </Box>
      )}
      {!isLoading && brandId && brand && (
        <BodyContent brandId={brandId} brand={brand} />
      )}
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </Set>
  )
}

const BodyContent = ({ brandId = "", brand }) => {
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    status: "",
    vipId: "",
    username: "",
    beginRegisteredOn: "",
    endRegisteredOn: ""
  })

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  let {
    pageIndex,
    pageSize,
    status,
    vipId,
    username = "",
    beginRegisteredOn,
    endRegisteredOn
  } = state
  let {
    data = {},
    isLoading,
    mutate,
    error,
    deleteCache
  } = usePlayerList({
    ...toApiParams(state),
    sortby: "username",
    brandId,
    endRegisteredOn: startOfNextDay(endRegisteredOn)
  })
  let columns = useColumns({ mutate, items: data?.items, brandId, brand })

  return (
    <PageContent
      title={<Trans zh="玩家列表" en="Players" />}
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
        pageCount={pageCount(pageSize, data?.totalCount)}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        isLoading={isLoading}
        getRowId={(row) => row.playerCode}
      />
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

const SearchBar = ({ brandId, search, isLoading, ...props }) => {
  let hasPhoneFilterAuth = useIsDisplayMenuByRoute([PhoneFilter])

  let usernameInputPlaceholder = useSearchInputPlaceHolder()
  let domainInputPlaceholder = useTrans({
    zh: "注册域名",
    en: "Registration Domain"
  })
  let phonePlaceholder = useTrans({
    zh: "手机号码",
    en: "Phone"
  })

  let formMethods = useForm()

  const onSubmit = (data) => search(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set alignY="bottom">
          <PlayerStatusSelect name="status" />
          <VipLevelSelect name="vipId" brandId={brandId} />
          <InputField
            name="username"
            showEmptyFieldValueAddonAfter
            placeholder={usernameInputPlaceholder}
            autocomplete="off"
          />
          <InputField
            name="registerHost"
            showEmptyFieldValueAddonAfter
            placeholder={domainInputPlaceholder}
          />
          {hasPhoneFilterAuth && (
            <InputField
              name="phone"
              showEmptyFieldValueAddonAfter
              placeholder={phonePlaceholder}
            />
          )}
          <DateInputRangeField
            showDateDropdownMenu
            fakeTimeLabel
            label={<Trans zh="注册时间" en="Registration Time" />}
            startProps={{
              name: "beginRegisteredOn"
            }}
            endProps={{
              name: "endRegisteredOn"
            }}
          />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useSearchInputPlaceHolder = () =>
  useTrans({ zh: "用户名输入框", en: "Input user name" })

const useColumns = ({ mutate, items = [], brandId, brand } = {}) => {
  let isAdminUser = useIsAdminUser()

  let hasViewAuth = useIsDisplayMenuByRoute([View])
  let hasUpdateAuth = useIsDisplayMenuByRoute([Update])
  let hasAnyMenu = hasViewAuth || hasUpdateAuth

  return useMemo(() => {
    let columns = [sequenceColumn()]

    if (isAdminUser) {
      columns.push(
        textColumn({
          Header: <Trans zh="玩家代码" en="Player Code" />,
          accessor: "playerCode",
          disableSortBy: true
        })
      )
    }

    columns = [
      ...columns,
      {
        Header: <Trans zh="用户名" en="Username" />,
        accessor: "username",
        disableSortBy: true,
        headCell: {
          textAlign: "center"
        },
        cell: {
          textAlign: "center"
        }
      },
      dateTimeColumn({
        accessor: "registeredTime",
        Header: <Trans zh="注册时间" en="Registration Time" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "registerHost",
        Header: <Trans zh="注册域名" en="Registration Domain" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "agentName",
        Header: <Trans zh="上级代理" en="Upper Level Agent" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "vipLevel",
        Header: <Trans zh="VIP 等级" en="VIP Level" />,
        disableSortBy: true,
        Cell: ({ value }) => <VipLevelLabel value={value} placeholder="-" />
      }),
      {
        disableSortBy: true,
        Header: <Trans zh="状态" en="Status" />,
        accessor: "status",
        headCell: {
          textAlign: "center"
        },
        cell: {
          textAlign: "center"
        },
        Cell: ({ value }) => <PlayerStatusLabel value={value} />
      }
    ]

    if (hasAnyMenu) {
      columns.push({
        id: "actions",
        disableSortBy: true,
        Header: <Trans zh="操作" en="Actions" />,
        headCell: {
          textAlign: "center"
        },
        cell: {
          textAlign: "center"
        },
        accessor: (row) => row,
        Cell: ({ value: player }) => {
          let { playerCode } = player
          return (
            <Set alignX="center">
              <ViewButton
                id="view-player-dialog-disclosure"
                player={player}
                brandId={brandId}
              />
              <EditButton
                id="edit-player-dialog-disclosure"
                brandId={brandId}
                player={player}
                onSubmitted={mutate}
              />
              {brand?.enablePlayerIdentity && (
                <ReviewPlayerIdDialogDisclosure
                  id="review-player-id-dialog-disclosure"
                  brandId={brandId}
                  playerCode={playerCode}
                  onSubmitted={mutate}
                />
              )}
            </Set>
          )
        }
      })
    }

    return columns
  }, [JSON.stringify(items), brand])
}
