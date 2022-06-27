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
import { Code, View, Update, PhoneFilter, RealnameFilter } from "./menu"
import { PlayerStatus, PlayerStatusSelect } from "../PlayerStatus"
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
import { isDev } from "../../env"
import { useBrand } from "../../merchant/platforms/client"
import { useAllAgentSetting } from "../../agent/all-agent/client"
import { SortOrder } from "../../table/order"
import { PlayerWalletBalanceDialogDisclosure } from "./PlayerWalletBalanceDialog"

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
  let {
    isLoading: isLoadingBrand,
    data: brand,
    error: brandError,
    mutate,
    deleteCache
  } = useBrand(brandId)
  let {
    isLoading: isLoadingAllAgent,
    data: allAgentSetting,
    error: allAgentSettingError,
    deleteCache: deleteAllAgentSettingCache
  } = useAllAgentSetting(brandId)

  let isLoading = isLoadingBrand || isLoadingAllAgent
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
        <BodyContent
          brandId={brandId}
          brand={brand}
          allAgentSetting={allAgentSetting}
        />
      )}
      {brandError && <AlertDialog {...brandError} onClickClose={deleteCache} />}
      {allAgentSettingError && (
        <AlertDialog
          {...brandError}
          onClickClose={deleteAllAgentSettingCache}
        />
      )}
    </Set>
  )
}

const BodyContent = ({ brandId = "", brand, allAgentSetting }) => {
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    status: PlayerStatus.Enabled,
    vipId: "",
    username: "",
    parentUsername: "",
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
    sortby: "registeredTime",
    orderby: SortOrder.Descending,
    brandId,
    endRegisteredOn: startOfNextDay(endRegisteredOn)
  })
  let columns = useColumns({
    mutate,
    items: data?.items,
    brandId,
    brand,
    allAgentSetting
  })

  return (
    <PageContent
      title={<Trans zh="玩家列表" en="Players" />}
      actionBar={
        <SearchBar
          brandId={brandId}
          brand={brand}
          status={status}
          allAgentSetting={allAgentSetting}
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

const SearchBar = ({
  brandId,
  brand,
  status,
  allAgentSetting,
  search,
  isLoading,
  ...props
}) => {
  let hasPhoneFilterAuth = useIsDisplayMenuByRoute([PhoneFilter])
  let hasRealnameFilterAuth = useIsDisplayMenuByRoute([RealnameFilter])
  let showAllAgent = allAgentSetting.switch

  let usernameInputPlaceholder = useSearchInputPlaceHolder()
  let domainInputPlaceholder = useTrans({
    zh: "注册域名",
    en: "Registration Domain"
  })
  let phonePlaceholder = useTrans({
    zh: "手机号码",
    en: "Phone"
  })
  let realNamePlaceholder = useTrans({
    zh: "真实姓名",
    en: "Real name"
  })
  let agentNamePlaceholder = useTrans({
    zh: "上级代理",
    en: "Upper Level Agent"
  })
  let allAgentUpperLevelPlaceholder = useTrans({
    zh: "全民代理上級",
    en: "All Agent Upper Level"
  })

  let formMethods = useForm({
    defaultValues: {
      status
    }
  })

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
            name="agentName"
            showEmptyFieldValueAddonAfter
            placeholder={agentNamePlaceholder}
          />
          {showAllAgent && (
            <InputField
              name="parentUsername"
              showEmptyFieldValueAddonAfter
              placeholder={allAgentUpperLevelPlaceholder}
            />
          )}
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
          {hasRealnameFilterAuth && (
            <InputField
              name="realName"
              showEmptyFieldValueAddonAfter
              placeholder={realNamePlaceholder}
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

const useColumns = ({
  mutate,
  items = [],
  brandId,
  brand,
  allAgentSetting
} = {}) => {
  let isAdminUser = useIsAdminUser()

  let hasViewAuth = useIsDisplayMenuByRoute([View])
  let hasUpdateAuth = useIsDisplayMenuByRoute([Update])
  let hasAnyMenu = hasViewAuth || hasUpdateAuth

  let showAllAgent = allAgentSetting.switch

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
      textColumn({
        accessor: "status",
        Header: <Trans zh="状态" en="Status" />,
        disableSortBy: true,
        Cell: ({ value }) => <PlayerStatusLabel value={value} />
      })
    ]

    if (showAllAgent) {
      columns.push(
        textColumn({
          accessor: "parentUsername",
          Header: <Trans zh="全民代理上級" en="All Agent Upper Level" />,
          disableSortBy: true
        })
      )
    }

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
                showParentUsername={showAllAgent}
              />
              <EditButton
                id="edit-player-dialog-disclosure"
                brandId={brandId}
                player={player}
                showParentUsername={showAllAgent}
                onSubmitted={mutate}
              />
              <PlayerWalletBalanceDialogDisclosure playerCode={playerCode} />
            </Set>
          )
        }
      })
    }

    return columns
  }, [JSON.stringify(items), brand, allAgentSetting])
}
