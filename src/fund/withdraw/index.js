import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import {
  Switch,
  Route,
  Link,
  useLocation,
  useHistory,
  useParams,
  useRouteMatch
} from "react-router-dom"
import {
  Heading,
  Stack,
  Box,
  Button,
  Set,
  Flex,
  Level,
  FieldStack,
  Blockquote
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
import { Code } from "./menu"
import {
  FormattedNumberDecimal,
  Trans,
  useLangCode,
  useTrans
} from "../../i18n"
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
import { today } from "../../date/range"
import {
  FundWithdrawStatusLabel,
  FundWithdrawStatusSelect,
  isFundApproved,
  isFundUnderReview
} from "./FundWithdrawStatus"
import { DateInputRangeField } from "../../date/DateTimeRangeInput"
import { useFundWithdrawFormList, API } from "./client"
import { startOfNextDay } from "../../date/startOfNextDay"
import { SortOrder } from "../../table/order"
import { Update } from "./menu"
import { ViewFundWithdrawDisclosure } from "./ViewFundWithdraw"
import { VerifyFundWithdrawDisclosure } from "./VerifyFundWithdraw"
import { PaymentMethodSelect } from "../../payment/method/PaymentMethod"
import { UserTypeLabel } from "./UserType"
import maxTime from "date-fns/max"
import isEqualTime from "date-fns/isEqual"
import isSameDay from "date-fns/isSameDay"
import isAfter from "date-fns/isAfter"
import parseISO from "date-fns/parseISO"
import isValidTime from "date-fns/isValid"
import { sortBy, head } from "lodash-es"
import clone from "clone-deep"
import { isDev } from "../../env"
import DownloadButton from "../../button/DownloadButton"
import { urlWith } from "../../client"
import subDays from "date-fns/subDays"
import { useBrandPaymentList } from "../../system/brandpayments/client"
import BrandPaymentTransferType from "../../system/brandpayments/BrandPaymentTransferType"
import { FundWithdrawPaidDialogDisclosure } from "./FundWithdrawPaid"

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

const SecondInMilliseconds = 1000
const MinuteInMilliseconds = 60000

const BodyContent = ({ brandId }) => {
  let { location } = useHistory()

  let todayRange = today()
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    username: "",
    channelName: "",
    status: location?.state?.status ?? "",
    thirdOrderNo: "",
    beginCreateOn: todayRange.start,
    endCreateOn: todayRange.end,
    beginUpdateOn: undefined,
    endUpdateOn: undefined
  })

  useEffect(() => {
    setState({ pageIndex: 0 })
  }, [brandId])

  let {
    pageIndex,
    pageSize,
    username,
    channelName,
    status,
    beginCreateOn,
    endCreateOn,
    beginUpdateOn,
    endUpdateOn
  } = state

  let culture = useLangCode()

  const toSearchParams = () => ({
    ...toApiParams(state),
    bc: state.beginCreateOn,
    ec: startOfNextDay(state.endCreateOn),
    bu: state.beginUpdateOn,
    eu: startOfNextDay(state.endUpdateOn),
    sortby: "CreatedOn",
    orderby: SortOrder.Descending,
    culture
  })

  let {
    isLoading: isLoadingBrandPayment,
    data: brandPaymentList,
    error: brandPaymentListError
  } = useBrandPaymentList({
    brandId,
    transferType: BrandPaymentTransferType.Withdrawal,
    showAll: true
  })

  let manualBrandPaymentIdList = brandPaymentList?.items
    ?.filter?.(({ paymentName, ...rest }) => paymentName == "Manual")
    .map(({ id }) => id)

  let {
    data = {},
    isValidating,
    isLoading,
    mutate: mutateFormList,
    error,
    deleteCache
  } = useFundWithdrawFormList(brandId, toSearchParams(), {
    refreshInterval: 10 * SecondInMilliseconds
  })

  useEffect(() => {
    if (location?.state?.fromNotify) {
      deleteCache()

      todayRange = today()
      setState({
        pageIndex: 0,
        username: "",
        channelName: "",
        status: location?.state?.status ?? "",
        thirdOrderNo: "",
        id: "",
        beginCreateOn: todayRange.start,
        endCreateOn: todayRange.end,
        beginUpdateOn: undefined,
        endUpdateOn: undefined
      })

      mutateFormList(undefined)
    }
  }, [location?.state?.fromNotify])

  let [items, setItems] = useState([])
  let [isUpdateAvailable, setUpdateAvailable] = useState(false)
  let [delayUpdate, setDelayUpdate] = useState(false)

  let [autoLoading, setAutoLoading] = useState(false)

  const showUpdates = () => {
    let newApplications = newApplicationsFromToday(data.items, items)
    if (newApplications.length) {
      // notifyAudio.play()
    }

    setAutoLoading(true)
    setItems(clone(data.items))
    setUpdateAvailable(false)

    setTimeout(() => {
      setAutoLoading(false)
    }, 0.5 * SecondInMilliseconds)
  }

  useEffect(() => {
    if (!delayUpdate && isUpdateAvailable) {
      showUpdates()
    }
  }, [delayUpdate, isUpdateAvailable])

  const mutate = () => {
    mutateFormList()
    setDelayUpdate(false)
  }

  useEffect(() => {
    let hasUpdate = data?.items && !equals(items, data?.items)
    setUpdateAvailable(hasUpdate)

    if (hasUpdate && !delayUpdate) {
      showUpdates()
    }
  }, [JSON.stringify(data?.items)])

  let QueryMaxRangeDays = 31
  let DataRetentionDays = 90
  let minDate = subDays(todayRange.start, DataRetentionDays)

  let columns = useColumns({
    mutate,
    items,
    brandId,
    setDelayUpdate,
    manualBrandPaymentIdList
  })
  return (
    <PageContent
      title={<Trans zh="提款列表" en="Withdraw List" />}
      actionBar={
        <Level alignY="bottom" alignX="left" verticalBelow="mobile">
          <SearchBar
            brandId={brandId}
            username={username}
            channelName={channelName}
            status={status}
            thirdOrderNo={state.thirdOrderNo}
            id={state.id}
            beginCreateOn={beginCreateOn}
            endCreateOn={endCreateOn}
            beginUpdateOn={beginUpdateOn}
            endUpdateOn={endUpdateOn}
            minDate={minDate}
            maxRangeDays={QueryMaxRangeDays}
            search={(data = {}) => {
              setState({
                pageIndex: 0,
                ...data
              })
              mutate()
            }}
            isLoading={isLoading || autoLoading}
          />
          {data?.items?.length > 0 && (
            <Box>
              <DownloadButton
                id="export-report"
                isLoading={isLoading}
                href={urlWith(
                  toSearchParams(),
                  `${API}/exportWithdraw/${brandId}`
                )}
                download="Withdraw.xlsx"
              />
            </Box>
          )}
        </Level>
      }
    >
      <Summary total={data?.sum} />
      <Table
        id="withdraw"
        columns={columns}
        data={items}
        initialState={state}
        controlledState={state}
        pageCount={pageCount(pageSize, data?.totalCount)}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        isLoading={isLoading || autoLoading}
        getRowId={(row) => row.id}
      />
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

const Summary = ({ total }) => {
  if (!Number.isFinite(total)) {
    return null
  }

  return (
    <Blockquote borderColor="primary">
      <Heading use="h5">
        <Trans zh="提款金额总计：" en="Total Withdraw Amount：" />
        <FormattedNumberDecimal id="total-amount" value={total} />
      </Heading>
    </Blockquote>
  )
}

const newApplicationsFromToday = (first = [], second = []) => {
  if (!second || second.length === 0) {
    return []
  }

  let today = new Date()
  let lastMaxApplicationTime = maxTime(
    second.reduce((times, { createdOn }) => {
      let value = parseISO(createdOn)
      if (isValidTime(value)) {
        times.push(value)
      }

      return times
    }, [])
  )

  const findSameById = (id, list = []) => list.find((item) => item.id === id)

  let result = first.filter(({ createdOn, id }) => {
    createdOn = parseISO(createdOn)
    return (
      isSameDay(today, createdOn) &&
      isAfter(createdOn, lastMaxApplicationTime) &&
      !findSameById(id, second)
    )
  })

  return result
}

const SearchBar = ({
  brandId,
  username,
  channelName,
  status,
  thirdOrderNo,
  id,
  beginCreateOn,
  endCreateOn,
  beginUpdateOn,
  endUpdateOn,
  minDate,
  maxRangeDays,
  search,
  isLoading,
  ...props
}) => {
  let formMethods = useForm({
    defaultValues: {
      username,
      channelName,
      status,
      thirdOrderNo,
      id,
      beginCreateOn,
      endCreateOn,
      beginUpdateOn,
      endUpdateOn
    }
  })

  useEffect(() => {
    formMethods.reset({
      username,
      channelName,
      status,
      thirdOrderNo,
      id,
      beginCreateOn,
      endCreateOn,
      beginUpdateOn,
      endUpdateOn
    })
  }, [
    username,
    channelName,
    status,
    thirdOrderNo,
    beginCreateOn,
    endCreateOn,
    beginUpdateOn,
    endUpdateOn
  ])

  let usernameInputPlaceholder = useTrans({
    zh: "用户名",
    en: "Username"
  })

  let channelNameInputPlaceholder = useTrans({
    zh: "通道名称",
    en: "Channel Name"
  })

  let paymentMethodPlaceholder = useTrans({
    zh: "提款类型",
    en: "Withdraw Method"
  })

  let externalIdPlaceholder = useTrans({
    zh: "三方订单编号",
    en: "3rd Party Id"
  })
  let idPlaceholder = useTrans({
    zh: "系统订单编号",
    en: "System Id"
  })
  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(search)}>
        <FieldStack orientation="vertical">
          <Set orientation="horizontal">
            <InputField
              name="username"
              showEmptyFieldValueAddonAfter
              placeholder={usernameInputPlaceholder}
            />
            <InputField
              name="channelName"
              showEmptyFieldValueAddonAfter
              placeholder={channelNameInputPlaceholder}
            />
            <PaymentMethodSelect
              name="method"
              placeholder={paymentMethodPlaceholder}
            />
            <FundWithdrawStatusSelect name="status" />
            <InputField
              name="thirdOrderNo"
              placeholder={externalIdPlaceholder}
              showEmptyFieldValueAddonAfter
            />
            <InputField
              name="id"
              placeholder={idPlaceholder}
              showEmptyFieldValueAddonAfter
            />
          </Set>
          <Set orientation="horizontal">
            <DateInputRangeField
              label={<Trans zh="申请时间" en="Application Time" />}
              startProps={{
                name: "beginCreateOn"
              }}
              endProps={{
                name: "endCreateOn"
              }}
              minDate={minDate}
              maxRangeDays={maxRangeDays}
            />
            <DateInputRangeField
              label={<Trans zh="更新时间" en="Updated Time" />}
              startProps={{
                name: "beginUpdateOn"
              }}
              endProps={{
                name: "endUpdateOn"
              }}
              minDate={minDate}
              maxRangeDays={maxRangeDays}
            />
            <SearchButton
              isLoading={isLoading}
              disabled={isLoading}
              alignSelf="flex-end"
            />
          </Set>
        </FieldStack>
      </form>
    </FormProvider>
  )
}

const useColumns = ({
  brandId,
  items = [],
  mutate,
  setDelayUpdate,
  manualBrandPaymentIdList = []
}) => {
  let hasUpdateMenu = useIsDisplayMenuByRoute([Update])
  return useMemo(() => {
    let columns = [
      sequenceColumn(),
      textColumn({
        accessor: "userName",
        Header: <Trans zh="用户名" en="Username" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "userType",
        Header: <Trans zh="用户类型" en="User Type" />,
        Cell: ({ value }) => <UserTypeLabel value={value} />
      }),
      textColumn({
        accessor: "id",
        Header: <Trans zh="订单号" en="Id" />,
        disableSortBy: true,
        Cell: ({ value }) => value
      }),
      textColumn({
        accessor: "thirdPartyOrderNo",
        Header: <Trans zh="三方单号" en="3rd Party Id" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "amount",
        Header: <Trans zh="提款金额" en="Amount" />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "createdOn",
        Header: <Trans zh="申请时间" en="Application Time" />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "updatedOn",
        Header: <Trans zh="更新时间" en="Update Time" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "status",
        Header: <Trans zh="状态" en="Status" />,
        disableSortBy: true,
        Cell: ({ value }) => (
          <FundWithdrawStatusLabel value={value} data-status={value} />
        )
      })
    ]

    columns.push(
      textColumn({
        accessor: "reviewedUserName",
        Header: <Trans zh="操作者" en="Operator" />,
        disableSortBy: true
      })
    )

    columns.push(
      textColumn({
        accessor: "remark",
        Header: <Trans zh="备注" en="Remark" />,
        disableSortBy: true,
        Cell: ({ value }) => <Box>{value}</Box>
      })
    )

    if (hasUpdateMenu) {
      columns.push(
        textColumn({
          id: "actions",
          accessor: (row) => row,
          disableSortBy: true,
          Header: <Trans zh="操作" en="Actions" />,
          Cell: ({ value, status }) => {
            let { brandPaymentId } = value
            let underReview = isFundUnderReview(value?.status)

            let reviewManualPaid =
              isFundApproved(value?.status) &&
              manualBrandPaymentIdList.includes(brandPaymentId)
            return (
              <Set alignX="center">
                {underReview && (
                  <VerifyFundWithdrawDisclosure
                    id="verify-withdraw-dialog-disclosure"
                    brandId={brandId}
                    formId={value.id}
                    onSubmitted={mutate}
                    onVisibleChange={(visible) => {
                      let delayUpdate = visible
                      setDelayUpdate(delayUpdate)
                    }}
                  />
                )}
                {reviewManualPaid && (
                  <FundWithdrawPaidDialogDisclosure
                    id="fund-withdraw-paid-dialog-disclosure"
                    brandId={brandId}
                    formId={value.id}
                    onSubmitted={mutate}
                    onVisibleChange={(visible) => {
                      let delayUpdate = visible
                      setDelayUpdate(delayUpdate)
                    }}
                  />
                )}
                <ViewFundWithdrawDisclosure
                  id="view-withdraw-dialog-disclosure"
                  brandId={brandId}
                  formId={value.id}
                  onVisibleChange={(visible) => {
                    let delayUpdate = visible
                    setDelayUpdate(delayUpdate)
                  }}
                />
              </Set>
            )
          }
        })
      )
    }

    return columns
  }, [JSON.stringify(items), JSON.stringify(manualBrandPaymentIdList)])
}
