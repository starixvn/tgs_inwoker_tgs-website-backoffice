import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { Heading, Stack, Box, Button, Set, Alert, List } from "bumbag"
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
import { Code, View, Update } from "./menu"
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
import {
  PlayerIdentitySelect,
  PlayerIdentityStateLabel
} from "./PlayerIdentityState"

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
      <BodyContent brandId={brandId} />
    </Set>
  )
}

const BodyContent = ({ brandId = "" }) => {
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    status: "",
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
  } = usePlayerList({
    ...toApiParams(state),
    sortby: "username",
    brandId
  })

  let columns = useColumns({
    mutate,
    items: data?.items,
    brandId
  })

  return (
    <PageContent
      title={<Trans zh="玩家身分审核列表" en="Player Identity List" />}
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
      <Stack>
        <Alert variant="bordered" type="info" accent marginBottom="1rem">
          <List listStyleType="disc" listStylePosition="inside">
            <List.Item>
              <Trans
                zh="未上傳身分證之玩家，不顯示在此列表中"
                en="Players who have not uploaded their ID cards are not shown in this list"
              />
            </List.Item>
          </List>
        </Alert>
      </Stack>
      <Table
        columns={columns}
        data={data?.items}
        initialState={state}
        controlledState={state}
        pageCount={pageCount(state.pageSize, data?.totalCount)}
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
  let usernameInputPlaceholder = useTrans({
    zh: "用户名输入框",
    en: "Input user name"
  })

  let formMethods = useForm({})

  const onSubmit = (data) => search?.(data)

  const maxRangeDays = 31
  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set alignY="bottom">
          <PlayerIdentitySelect name="identityStatus" />
          <InputField
            name="username"
            showEmptyFieldValueAddonAfter
            placeholder={usernameInputPlaceholder}
            autocomplete="off"
          />
          <DateInputRangeField
            label={<Trans zh="申请时间" en="Application Time" />}
            startProps={{
              name: "beginCreateOn"
            }}
            endProps={{
              name: "endCreateOn"
            }}
            maxRangeDays={maxRangeDays}
          />
          <DateInputRangeField
            label={<Trans zh="审核时间" en="Verify Time" />}
            startProps={{
              name: "beginUpdateOn"
            }}
            endProps={{
              name: "endUpdateOn"
            }}
            maxRangeDays={maxRangeDays}
          />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ mutate, items = [], brandId } = {}) => {
  let hasViewAuth = useIsDisplayMenuByRoute([View])
  let hasUpdateAuth = useIsDisplayMenuByRoute([Update])
  let hasAnyMenu = hasViewAuth || hasUpdateAuth

  return useMemo(() => {
    let columns = [
      sequenceColumn(),
      textColumn({
        accessor: "username",
        Header: <Trans zh="用户名" en="Username" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "realName",
        Header: <Trans zh="真实姓名" en="Real name" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "idNumber",
        Header: <Trans zh="身分证" en="IC Number" />,
        disableSortBy: true
      }),
      textColumn({
        id: "attachment",
        accessor: (row) => row,
        Header: <Trans zh="附件" en="Attachment" />,
        disableSortBy: true,
        Cell: ({ value }) => {
          //TODO
          return null
        }
      }),
      textColumn({
        accessor: "status",
        Header: <Trans zh="状态" en="Status" />,
        disableSortBy: true,
        Cell: ({ value }) => <PlayerIdentityStateLabel value={value} />
      }),
      textColumn({
        accessor: "remark",
        Header: <Trans zh="备注" en="Remark" />,
        disableSortBy: true
      })
    ]

    if (hasAnyMenu) {
      columns.push(
        textColumn({
          id: "actions",
          accessor: (row) => row,
          Header: <Trans zh="操作" en="Actions" />,
          disableSortBy: true,
          Cell: ({ value: player }) => {
            let { playerCode } = player
            return (
              <Set alignX="center">
                <ReviewPlayerIdDialogDisclosure
                  id="review-player-id-dialog-disclosure"
                  brandId={brandId}
                  playerCode={playerCode}
                  identityFormId={player.identityFormId}
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
